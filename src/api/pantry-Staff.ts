import { TPantryStaff } from "@/types";
import {  useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllPantryStaff = () => {
  const fetchAllPantryStaff = async (): Promise<TPantryStaff[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/pantry-staff`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching pantry staff data");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: pantryStaff,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pantry-staff"],
    queryFn: fetchAllPantryStaff,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { pantryStaff, isLoading, error, refetch };
};
