import React, { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useValidateToken } from "@/api/auth";

export type AppContextType = {
  isLoggedIn: boolean;
  validateToken: () => Promise<void>;
  status: "idle" | "pending" | "error" | "success";
  error: Error | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const { validateToken: validateTokenApi } = useValidateToken();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    mutateAsync: validateToken,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: validateTokenApi,
    onSuccess: () => {
      setIsLoggedIn(true);
    },
    onError: () => {
      setIsLoggedIn(false);
      reset();
    },
  });

  useEffect(() => {
    validateToken().catch(() => {
    });
  }, [validateToken]);

  return (
    <AppContext.Provider
      value={{
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
