import { TMeal, TMealPreparation } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useGetAllMeal = () => {
  const fetchAllMeal = async (): Promise<TMeal[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/meal-preparation`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching diet charts");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: meals,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["meal"],
    queryFn: fetchAllMeal,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { meals, isLoading, error, refetch };
};

export const useUpdateMealStatus = () => {
  const updateMealStatusRequest = async (data: {
    mealId: string;
    status: string;
  }): Promise<TMeal> => {
    const { mealId, status } = data;

    const response = await fetch(
      `${API_BASE_URL}/api/v1/meal-preparation/${mealId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating diet chart");
    }

    return response.json();
  };

  const {
    mutateAsync: updateMealStatus,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: updateMealStatusRequest,
    onSuccess: () => {
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Error updating status");
      reset();
    },
  });

  return { updateMealStatus, status, error };
};

export const useDeleteMeal = () => {
  const deleteMealRequest = async (mealId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/meal-preparation/${mealId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error deleting diet chart");
    }
    return response.json();
  };

  const {
    mutateAsync: deleteMeal,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: deleteMealRequest,
    onSuccess: () => {
      toast.success("Meal deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting meal");
      reset();
    },
  });

  return { deleteMeal, status, error };
};