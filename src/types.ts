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

export type TMeal = {
  _id: string;
  createdAt: string;
  status: "Pending" | "In Progress" | "Completed";
  pantryStaffId: {
    _id: string;
    name: string;
    contactInfo?: {
      phone?: string;
    };
  };
  dietChartId: {
    _id: string;
    morningMeal: string;
    eveningMeal: string;
    nightMeal: string;
    instructions: string[];
  };
  patientId: {
    _id: string;
    name: string;
    age: number;
  };
};

export type TDeliveryStaff = {
  _id?: string;
  name: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
};

export type TDeliveryAssign = {
  _id?: string;
  deliveryPersonnelId: string;
  mealPreparationId: string;
  patientId: string;
  deliveryTime: Date;
};

export type TDelivery = {
  _id: string;
  createdAt: string;
  deliveryPersonnelId: {
    _id: string;
    name: string;
    contactInfo?: {
      phone?: string;
    };
  };
  mealPreparationId: {
    _id: string;
    pantryStaffId: {
      _id: string;
      name: string;
      contactInfo?: {
        phone?: string;
      };
    };
  };
  patientId: {
    _id: string;
    name: string;
  };
  status: "Pending" | "Completed";
  deliveryTime: string;
  updatedAt: string;
};
