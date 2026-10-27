REVOKE ALL ON public.traffic_daily FROM anon;
REVOKE ALL ON public.traffic_daily FROM authenticated;
GRANT SELECT ON public.traffic_daily TO authenticated;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.user_roles FROM authenticated;
GRANT SELECT ON public.user_roles TO authenticated;