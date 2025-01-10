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
  patientId: string;
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

export type TPantryStaff= {
  name: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  location: string;
};
