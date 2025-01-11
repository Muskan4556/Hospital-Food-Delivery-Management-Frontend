import { TDelivery, TDeliveryAssign } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllDelivery = () => {
  const fetchAllDelivery = async (): Promise<TDelivery[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/meal-delivery-status`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  };

  const {
    data: delivery,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["delivery"],
    queryFn: fetchAllDelivery,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { delivery, isLoading, error, refetch };
};

export const useCreateDelivery = () => {
  const createDeliveryRequest = async (formData: TDeliveryAssign) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/meal-delivery-status`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Error creating delivery");
    }

    return response.json();
  };

  const {
    mutateAsync: createDelivery,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: createDeliveryRequest,
    onSuccess: () => {
      toast.success("Delivery created successfully");
    },
    onError: () => {
      toast.error("Error creating delivery");
      reset();
    },
  });

  return { createDelivery, status, error };
};

export const useUpdateDeliveryStatus = () => {
  const updateDeliveryStatusRequest = async (data: {
    deliveryId: string;
    status: string;
  }): Promise<TDelivery> => {
    const { deliveryId, status } = data;

    const response = await fetch(
      `${API_BASE_URL}/api/v1/meal-delivery-status/${deliveryId}`,
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
      throw new Error("Error updating delivery status");
    }

    return response.json();
  };

  const {
    mutateAsync: updateDeliveryStatus,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: updateDeliveryStatusRequest,
    onSuccess: () => {
      toast.success("Delivery status updated successfully");
    },
    onError: () => {
      toast.error("Error updating delivery status");
      reset();
    },
  });

  return { updateDeliveryStatus, status, error };
};

export const useDeleteDelivery = () => {
  const deleteDeliveryRequest = async (deliveryId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/meal-delivery-status/${deliveryId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting delivery");
    }

    return response.json();
  };

  const {
    mutateAsync: deleteDelivery,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: deleteDeliveryRequest,
    onSuccess: () => {
      toast.success("Delivery deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting delivery");
      reset();
    },
  });

  return { deleteDelivery, status, error };
};
