REVOKE INSERT, UPDATE, DELETE ON TABLE public.products FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.products FROM PUBLIC;
GRANT INSERT ON TABLE public.products TO service_role;
