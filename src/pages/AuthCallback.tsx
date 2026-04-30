import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
        return;
      }

      if (session) {
        // Check if this is a password recovery
        const params = new URLSearchParams(window.location.search);
        if (params.get("type") === "recovery") {
          navigate("/dashboard?tab=settings");
        } else {
          // Check for saved redirect URL from signup/ProtectedRoute flow
          const redirect = localStorage.getItem("artlypet_redirect");
          if (redirect) {
            localStorage.removeItem("artlypet_redirect");
            navigate(redirect);
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
