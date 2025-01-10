import { TPatient } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreatePatient = () => {
  const createPatientRequest = async (formData: TPatient) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/patient`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Error creating patient");
    }

    return response.json();
  };

  const {
    mutateAsync: createPatient,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: createPatientRequest,
    onSuccess: () => {
      toast.success("Patient created successfully");
    },
    onError: () => {
      toast.error("Error creating patient");
      reset();
    },
  });

  return { createPatient, status, error };
};

export const useUpdatePatient = () => {
  const updatePatientRequest = async (data: {
    patientId: string;
    formData: TPatient;
  }): Promise<TPatient> => {
    const { patientId, formData } = data;
    const response = await fetch(
      `${API_BASE_URL}/api/v1/patient/${patientId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating patient");
    }

    return response.json();
  };

  const {
    mutateAsync: updatePatient,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: updatePatientRequest,
    onSuccess: () => {
      toast.success("Patient updated successfully");
    },
    onError: () => {
      toast.error("Error updating patient");
      reset();
    },
  });

  return { updatePatient, status, error };
};

export const useGetAllPatients = () => {
  const fetchPatients = async (): Promise<TPatient[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/patient`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching patients");
    }
    const data = await response.json();

    return data;
  };

  const {
    data: patients,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { patients, isLoading, error, refetch };
};

export const useDeletePatient = () => {
  const deletePatientRequest = async (patientId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/patient/${patientId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting patient");
    }

    return response.json();
  };

  const {
    mutateAsync: deletePatient,
    status,
    error,
    reset,
  } = useMutation({
    mutationFn: deletePatientRequest,
    onSuccess: () => {
      toast.success("Patient deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting patient");
      reset();
    },
  });

  return { deletePatient, status, error };
};
