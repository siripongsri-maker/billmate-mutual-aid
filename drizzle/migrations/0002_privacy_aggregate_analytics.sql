CREATE TABLE IF NOT EXISTS public.user_roles (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role IN ('admin','owner')),
 PRIMARY KEY (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own protected analytics role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
INSERT INTO public.user_roles (user_id, role) SELECT user_id, role FROM public.profiles WHERE role IN ('admin','owner') ON CONFLICT DO NOTHING;
CREATE FUNCTION public.can_read_analytics() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT EXISTS (SELECT 1 FROM public.user_roles r JOIN public.profiles p ON p.user_id=r.user_id WHERE r.user_id=auth.uid() AND r.role IN ('admin','owner') AND (p.suspended_until IS NULL OR p.suspended_until<=now()));
$$;
REVOKE ALL ON FUNCTION public.can_read_analytics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_analytics() TO authenticated, service_role;
CREATE TABLE public.traffic_daily (
 day date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Bangkok')::date,
 event text NOT NULL CHECK (event IN ('visit','page_view','bill_view','help_click')),
 page text NOT NULL CHECK (page IN ('home','browse','bill','help','impact','circles','trust','corporate','onboarding','thanks')),
 source text NOT NULL CHECK (source IN ('direct','google','bing','facebook','instagram','line','tiktok','other')),
 count bigint NOT NULL DEFAULT 1 CHECK (count BETWEEN 1 AND 100000),
 PRIMARY KEY (day,event,page,source)
);
GRANT SELECT ON public.traffic_daily TO authenticated;
GRANT ALL ON public.traffic_daily TO service_role;
ALTER TABLE public.traffic_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Protected staff read aggregate traffic" ON public.traffic_daily FOR SELECT TO authenticated USING (public.can_read_analytics() AND day >= (now() AT TIME ZONE 'Asia/Bangkok')::date - 89);
CREATE FUNCTION public.record_traffic(p_event text,p_page text,p_source text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 DELETE FROM public.traffic_daily WHERE day < (now() AT TIME ZONE 'Asia/Bangkok')::date - 89;
 INSERT INTO public.traffic_daily(event,page,source) VALUES(p_event,p_page,p_source)
 ON CONFLICT(day,event,page,source) DO UPDATE SET count=LEAST(traffic_daily.count+1,100000);
END;
$$;
REVOKE ALL ON FUNCTION public.record_traffic(text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_traffic(text,text,text) TO service_role;
COMMENT ON TABLE public.traffic_daily IS 'Anonymous daily counters only. No visitor IDs, IPs, cookies, full URLs, bill IDs or request content. Rolling 90-day window; older rows purged on ingestion.';