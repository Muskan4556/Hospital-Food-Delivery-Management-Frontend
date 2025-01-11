import { TMealPreparation } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMeal = () => {
  const createMealRequest = async (formData: TMealPreparation) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/meal-preparation`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Error creating diet chart");
    }

    return response.json();
  };

  const {
    mutateAsync: createMeal,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: createMealRequest,
    onSuccess: () => {
      toast.success("Meal assigned successfully");
    },
    onError: () => {
      toast.error("Error occur while assigning meal");
      reset();
    },
  });

  return { createMeal, status, error };
};
