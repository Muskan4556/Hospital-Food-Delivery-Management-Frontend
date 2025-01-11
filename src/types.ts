export type TPatient = {
  _id?: string;
  name: string;
  dob: Date;
  diseases?: string[];
  allergies?: string[];
  roomNumber: string;
  bedNumber: string;
  floorNumber: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contactInfo: {
    phone: string;
    email?: string;
  };
  emergencyContact: {
    name?: string;
    phone?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TDietChart = {
  _id?: string;
  patientId: {
    _id: string;
    name?: string;
    diseases?: string[];
    allergies?: string[];
    age?: number;
    gender?: "Male" | "Female" | "Other";
  };
  morningMeal: string;
  eveningMeal: string;
  nightMeal: string;
  ingredients: {
    ingredient: string;
    quantity: string;
  }[];
  instructions?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type TPantryStaff = {
  _id?: string;
  name: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  location: string;
};

export type TMealPreparation = {
  pantryStaffId: string;
  dietChartId: string;
  patientId: string;
  status: "Pending" | "In Progress" | "Completed";
};
