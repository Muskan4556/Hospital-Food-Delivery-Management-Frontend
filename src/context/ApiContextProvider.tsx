import React, { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useValidateToken } from "@/api/auth";

export type AppContextType = {
  isLoggedIn: boolean;
  validateToken: () => Promise<void>;
  status: "idle" | "pending" | "error" | "success";
  error: Error | null;
  userRole: string | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const { validateToken: validateTokenApi } = useValidateToken();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const {
    mutateAsync: validateToken,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: validateTokenApi,
    onSuccess: (data) => {
      setIsLoggedIn(true);
      setUserRole(data.userRole);
    },
    onError: () => {
      setIsLoggedIn(false);
      setUserRole(null);
      reset();
    },
  });

  useEffect(() => {
    validateToken().catch(() => {});
  }, [validateToken]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        isLoggedIn,
        validateToken,
        status,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
