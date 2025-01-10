import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useCreatePatient, useUpdatePatient } from "@/api/patient";
import { TPatient } from "@/types";
import { useEffect } from "react";

type PatientFormProps = {
  entityType: string;
  refetch: () => void;
  setIsDialogOpen: (open: boolean) => void;
  selectedPatient?: TPatient;
};

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  diseases: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  floorNumber: z.string().min(1, "Floor number is required"),
  age: z.number().min(1, "Age is required").positive("Age must be positive"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  contactInfo: z.object({
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().optional(),
  }),
  emergencyContact: z
    .array(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .min(1, "At least one emergency contact is required"),
});

type PatientFormData = z.infer<typeof patientSchema>;

export const PatientForm = ({
  entityType,
  refetch,
  selectedPatient,
  setIsDialogOpen,
}: PatientFormProps) => {
  const { createPatient } = useCreatePatient();
  const { updatePatient } = useUpdatePatient();

  const defaultValues = selectedPatient
    ? {
        name: selectedPatient.name,
        dob: selectedPatient.dob,
        diseases: selectedPatient.diseases,
        allergies: selectedPatient.allergies,
        roomNumber: selectedPatient.roomNumber,
        bedNumber: selectedPatient.bedNumber,
        floorNumber: selectedPatient.floorNumber,
        age: selectedPatient.age,
        contactInfo: selectedPatient.contactInfo,
        emergencyContact: selectedPatient.emergencyContact,
      }
    : {
        name: "",
        dob: "",
        diseases: [""],
        allergies: [""],
        roomNumber: "",
        bedNumber: "",
        floorNumber: "",
        age: 0,
        gender: "Male",
        contactInfo: { phone: "", email: "" },
        emergencyContact: [{ name: "", phone: "" }],
      };

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    // @ts-expect-error: Expect an error on the next line
    defaultValues,
  });

  useEffect(() => {
    if (selectedPatient) {
      form.reset({
        name: selectedPatient.name,
        dob: selectedPatient.dob
          ? new Date(selectedPatient.dob).toISOString().split("T")[0]
          : "",
        diseases: selectedPatient.diseases,
        allergies: selectedPatient.allergies,
        roomNumber: selectedPatient.roomNumber,
        bedNumber: selectedPatient.bedNumber,
        floorNumber: selectedPatient.floorNumber,
        age: selectedPatient.age,
        contactInfo: selectedPatient.contactInfo,
        emergencyContact: selectedPatient.emergencyContact,
      });
    } else {
      form.reset({
        name: "",
        dob: "",
        diseases: [""],
        allergies: [""],
        roomNumber: "",
        bedNumber: "",
        floorNumber: "",
        age: 0,
        gender: "Male",
        contactInfo: { phone: "", email: "" },
        emergencyContact: [{ name: "", phone: "" }],
      });
    }
  }, [selectedPatient, form]);

  const {
    fields: diseaseFields,
    append: appendDisease,
    remove: removeDisease,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error: Expect an error on the next line
    name: "diseases" as keyof PatientFormData,
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error: Expect an error on the next line
    name: "allergies",
  });

  const {
    fields: emergencyFields,
    append: appendEmergency,
    remove: removeEmergency,
  } = useFieldArray({
    control: form.control,
    name: "emergencyContact",
  });

  const onSubmit = async (data: PatientFormData) => {
    const formattedData = {
      ...data,
      dob: new Date(data.dob),
    };
    if (selectedPatient) {
      await updatePatient({
        // @ts-expect-error: Expect an error on the next line
        patientId: selectedPatient._id,
        formData: formattedData,
      });
      setIsDialogOpen(false);
      refetch();
    } else {
      await createPatient(formattedData);
      setIsDialogOpen(false);
      refetch();
    }
  };

  return (
    <DialogContent className="w-[100%] h-[70%] overflow-auto">
      <DialogTitle>Add a New {entityType}</DialogTitle>
      <DialogDescription>Fill out the form below</DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Age"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      name="gender"
                      className="w-full py-2 px- border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Room Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Room Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bedNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bed Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Bed Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Floor Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Diseases */}
          <div className="space-y-4">
            <FormLabel className="font-semibold">Diseases</FormLabel>
            {diseaseFields.map((field, index) => (
              <div key={field.id} className="flex space-x-4">
                <FormField
                  control={form.control}
                  name={`diseases.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter Disease" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeDisease(index)}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              // @ts-expect-error: Expect an error on the next line
              onClick={() => appendDisease("")}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Disease</span>
            </Button>
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <FormLabel className="font-semibold">Allergies</FormLabel>
            {allergyFields.map((field, index) => (
              <div key={field.id} className="flex space-x-4">
                <FormField
                  control={form.control}
                  name={`allergies.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter Allergy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeAllergy(index)}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              // @ts-expect-error: Expect an error on the next line
              onClick={() => appendAllergy("")}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Allergy</span>
            </Button>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <FormLabel className="font-semibold">Emergency Contacts</FormLabel>

            {emergencyFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Name */}
                  <FormField
                    control={form.control}
                    name={`emergencyContact.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Phone */}
                  <FormField
                    control={form.control}
                    name={`emergencyContact.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remove Button */}
                {emergencyFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeEmergency(index)}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
            ))}

            {/* Add Emergency Contact Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendEmergency({ name: "", phone: "" })}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Emergency Contact</span>
            </Button>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};
