CREATE TABLE public.share_links (
 code text PRIMARY KEY CHECK(code ~ '^[a-f0-9]{24}$'),
 kind text NOT NULL CHECK(kind IN ('bill','circle')),
 target_id text NOT NULL CHECK(target_id IN ('b1','b2','b3','b4','b5','b6','c1','c2','c3','c4')),
 channel text NOT NULL CHECK(channel IN ('line','facebook','instagram','tiktok','other')),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(kind,target_id,channel)
);
GRANT SELECT ON public.share_links TO anon, authenticated;
GRANT INSERT ON public.share_links TO authenticated;
GRANT ALL ON public.share_links TO service_role;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public safe share destinations" ON public.share_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Analytics staff create share links" ON public.share_links FOR INSERT TO authenticated WITH CHECK(public.can_read_analytics());
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.share_links FROM anon, authenticated;
REVOKE INSERT ON public.share_links FROM anon;
CREATE TABLE public.share_daily (
 day date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Bangkok')::date,
 code text NOT NULL REFERENCES public.share_links(code),
 event text NOT NULL CHECK(event IN ('open','help_click','join_click','share_click')),
 count bigint NOT NULL DEFAULT 1 CHECK(count BETWEEN 1 AND 100000),
 PRIMARY KEY(day,code,event)
);
GRANT SELECT ON public.share_daily TO authenticated;
GRANT ALL ON public.share_daily TO service_role;
ALTER TABLE public.share_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read share totals" ON public.share_daily FOR SELECT TO authenticated USING(public.can_read_analytics() AND day >= (now() AT TIME ZONE 'Asia/Bangkok')::date - 89);
REVOKE ALL ON public.share_daily FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.share_daily FROM authenticated;
CREATE FUNCTION public.record_share(p_code text,p_event text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE k text;
BEGIN
 SELECT kind INTO k FROM public.share_links WHERE code=p_code;
 IF k IS NULL OR (p_event='help_click' AND k<>'bill') OR (p_event='join_click' AND k<>'circle') THEN RAISE EXCEPTION 'Invalid share event'; END IF;
 DELETE FROM public.share_daily WHERE day < (now() AT TIME ZONE 'Asia/Bangkok')::date - 89;
 INSERT INTO public.share_daily(code,event) VALUES(p_code,p_event) ON CONFLICT(day,code,event) DO UPDATE SET count=LEAST(share_daily.count+1,100000);
END;
$$;
REVOKE ALL ON FUNCTION public.record_share(text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.record_share(text,text) TO service_role;
COMMENT ON TABLE public.share_daily IS 'Daily share-link counters, not visitor-level events. No IPs, users, cookies, form contents or raw URLs; rolling 90-day reporting, purged on ingestion.';