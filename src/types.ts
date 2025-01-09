export type TPatient = {
  _id: string;
  name: string;
  dob: Date;
  diseases: string[];
  allergies: string[];
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
