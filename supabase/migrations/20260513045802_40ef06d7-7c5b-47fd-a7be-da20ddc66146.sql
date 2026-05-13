-- Allow authenticated users to execute the role-check function used by RLS policies
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Keep anonymous users from calling the admin role-check RPC directly
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

-- Ensure ownership/security behavior remains safe and stable
ALTER FUNCTION public.has_role(uuid, public.app_role)
  SECURITY DEFINER
  SET search_path = public;