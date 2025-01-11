import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { useCreatePantryStaff, useUpdatePantryStaff } from "@/api/pantry-Staff";
import { TPantryStaff } from "@/types";

type PantryStaffFormProps = {
  entityType: string;
  refetch: () => void;
  setIsDialogOpen: (open: boolean) => void;
  selectedStaff?: TPantryStaff;
};

const pantryStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
  location: z.string().min(1, "Location is required"),
});

type PantryStaffFormData = z.infer<typeof pantryStaffSchema>;

export const PantryStaffForm = ({
  entityType,
  refetch,
  selectedStaff,
  setIsDialogOpen,
}: PantryStaffFormProps) => {
  const { createPantryStaff } = useCreatePantryStaff();
  const { updatePantryStaff } = useUpdatePantryStaff();

  const defaultValues: PantryStaffFormData = selectedStaff
    ? {
        name: selectedStaff.name,
        contactInfo: {
          phone: selectedStaff.contactInfo.phone || "",
          email: selectedStaff.contactInfo.email || "",
        },
        location: selectedStaff.location,
      }
    : {
        name: "",
        contactInfo: { phone: "", email: "" },
        location: "",
      };

  const form = useForm<PantryStaffFormData>({
    resolver: zodResolver(pantryStaffSchema),
    defaultValues,
  });

  useEffect(() => {
    if (selectedStaff) {
      form.reset({
        name: selectedStaff.name,
        contactInfo: {
          phone: selectedStaff.contactInfo.phone || "",
          email: selectedStaff.contactInfo.email || "",
        },
        location: selectedStaff.location,
      });
    } else {
      form.reset({
        name: "",
        contactInfo: { phone: "", email: "" },
        location: "",
      });
    }
  }, [selectedStaff, form]);

  const onSubmit = async (data: PantryStaffFormData) => {
    if (selectedStaff && selectedStaff._id) {
      await updatePantryStaff({
        pantryStaffId: selectedStaff._id,
        formData: data,
      });
      setIsDialogOpen(false);
      refetch();
    } else {
      await createPantryStaff(data);
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter staff name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
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
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
