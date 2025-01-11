import { TDeliveryStaff } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllDeliveryStaff = () => {
  const fetchAllDeliveryStaff = async (): Promise<TDeliveryStaff[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/delivery-personnel`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching delivery staff data");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: deliveryStaff,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["delivery-staff"],
    queryFn: fetchAllDeliveryStaff,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { deliveryStaff, isLoading, error, refetch };
};

export const useCreateDeliveryStaff = () => {
  const createDeliveryStaffRequest = async (formData: TDeliveryStaff) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/delivery-personnel`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Error creating delivery staff");
    }

    return response.json();
  };

  const {
    mutateAsync: createDeliveryStaff,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: createDeliveryStaffRequest,
    onSuccess: () => {
      toast.success("Delivery staff created successfully");
    },
    onError: () => {
      toast.error("Error creating delivery staff");
      reset();
    },
  });

  return { createDeliveryStaff, status, error };
};

export const useDeleteDeliveryStaff = () => {
  const deleteDeliveryStaffRequest = async (deliveryStaffId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/delivery-personnel/${deliveryStaffId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting delivery staff");
    }

    return response.json();
  };

  const {
    mutateAsync: deleteDeliveryStaff,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: deleteDeliveryStaffRequest,
    onSuccess: () => {
      toast.success("Delivery staff deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting delivery staff");
      reset();
    },
  });

  return { deleteDeliveryStaff, status, error };
};

export const useUpdateDeliveryStaff = () => {
  const updateDeliveryStaffRequest = async (data: {
    deliveryStaffId: string;
    formData: TDeliveryStaff;
  }): Promise<TDeliveryStaff> => {
    const { deliveryStaffId: deliveryStaffId, formData } = data;
    const updatedFormData = {
      ...formData,
      deliveryStaffId,
    };
    const response = await fetch(
      `${API_BASE_URL}/api/v1/delivery-personnel/${deliveryStaffId}`,
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
      throw new Error("Error updating delivery Staff");
    }

    return response.json();
  };

  const {
    mutateAsync: updateDeliveryStaff,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: updateDeliveryStaffRequest,
    onSuccess: () => {
      toast.success("Delivery staff updated successfully");
    },
    onError: () => {
      toast.error("Error updating delivery staff");
      reset();
    },
  });

  return { updateDeliveryStaff, status, error };
};
