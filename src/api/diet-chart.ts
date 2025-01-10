import { TDietChart } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateDietChart = () => {
  const createDietChartRequest = async (formData: TDietChart) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/diet-charts`, {
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
    mutateAsync: createDietChart,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: createDietChartRequest,
    onSuccess: () => {
      toast.success("Diet chart created successfully");
    },
    onError: () => {
      toast.error("Error creating diet chart");
      reset();
    },
  });

  return { createDietChart, status, error };
};

export const useUpdateDietChart = () => {
  const updateDietChartRequest = async (data: {
    dietChartId: string;
    formData: TDietChart;
  }): Promise<TDietChart> => {
    const { dietChartId, formData } = data;
    const updatedFormData = {
      ...formData,
      dietChartId,
    };
    const response = await fetch(
      `${API_BASE_URL}/api/v1/diet-charts/${dietChartId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating diet chart");
    }

    return response.json();
  };

  const {
    mutateAsync: updateDietChart,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: updateDietChartRequest,
    onSuccess: () => {
      toast.success("Diet chart updated successfully");
    },
    onError: () => {
      toast.error("Error updating diet chart");
      reset();
    },
  });

  return { updateDietChart, status, error };
};

export const useGetAllDietCharts = () => {
  const fetchDietCharts = async (): Promise<TDietChart[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/diet-charts`, {
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
    data: dietCharts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["diet-charts"],
    queryFn: fetchDietCharts,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { dietCharts, isLoading, error, refetch };
};

export const useDeleteDietChart = () => {
  const deleteDietChartRequest = async (dietChartId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/diet-charts/${dietChartId}`,
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
    mutateAsync: deleteDietChart,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: deleteDietChartRequest,
    onSuccess: () => {
      toast.success("Diet chart deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting diet chart");
      reset();
    },
  });

  return { deleteDietChart, status, error };
};
