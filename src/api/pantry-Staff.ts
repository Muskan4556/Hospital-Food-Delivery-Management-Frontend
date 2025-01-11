import { TPantryStaff } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useCreatePantryStaff = () => {
  const createPantryStaffRequest = async (formData: TPantryStaff) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/pantry-staff`, {
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
    mutateAsync: createPantryStaff,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: createPantryStaffRequest,
    onSuccess: () => {
      toast.success("Pantry staff created successfully");
    },
    onError: () => {
      toast.error("Error creating pantry staff");
      reset();
    },
  });

  return { createPantryStaff, status, error };
};

export const useDeletePantryStaff = () => {
  const deletePantryStaffRequest = async (pantryStaffId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/pantry-staff/${pantryStaffId}`,
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
    mutateAsync: deletePantryStaff,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: deletePantryStaffRequest,
    onSuccess: () => {
      toast.success("Diet chart deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting diet chart");
      reset();
    },
  });

  return { deletePantryStaff, status, error };
};

export const useUpdatePantryStaff = () => {
  const updatePantryStaffRequest = async (data: {
    pantryStaffId: string;
    formData: TPantryStaff;
  }): Promise<TPantryStaff> => {
    const { pantryStaffId, formData } = data;
    const updatedFormData = {
      ...formData,
      pantryStaffId,
    };
    const response = await fetch(
      `${API_BASE_URL}/api/v1/pantry-staff/${pantryStaffId}`,
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
    mutateAsync: updatePantryStaff,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: updatePantryStaffRequest,
    onSuccess: () => {
      toast.success("Diet chart updated successfully");
    },
    onError: () => {
      toast.error("Error updating diet chart");
      reset();
    },
  });

  return { updatePantryStaff, status, error };
};
