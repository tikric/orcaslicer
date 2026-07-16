import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getAccessInfo, type AccessInfo } from "@/lib/access.functions";

export type AccessState = {
  loading: boolean;
  signedIn: boolean;
  info: AccessInfo | null;
};

/** Hook centralizado: sessão + trial + role. */
export function useAccess(): AccessState {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = () => {
      const isOffline =
        typeof window !== "undefined" && localStorage.getItem("offline_session") === "true";
      if (isOffline) {
        setSignedIn(true);
        return true;
      }
      return false;
    };

    if (checkSession()) return;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!checkSession()) {
          setSignedIn(!!data?.session);
        }
      })
      .catch(() => {
        if (!checkSession()) {
          setSignedIn(false);
        }
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!checkSession()) {
        setSignedIn(!!session);
      }
    });

    const handleStorageChange = () => {
      checkSession();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const query = useQuery({
    queryKey: ["access-info", signedIn],
    queryFn: () => getAccessInfo(),
    enabled: signedIn === true,
    staleTime: 60_000,
    retry: false,
  });

  return {
    loading: signedIn === null || (signedIn && query.isLoading),
    signedIn: !!signedIn,
    info: query.data ?? null,
  };
}
