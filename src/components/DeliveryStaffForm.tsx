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
import { useCreateDeliveryStaff, useUpdateDeliveryStaff } from "@/api/delivery-staff";
import { TDeliveryStaff } from "@/types";

type DeliveryStaffFormProps = {
  entityType: string;
  refetch: () => void;
  setIsDialogOpen: (open: boolean) => void;
  selectedStaff?: TDeliveryStaff;
};

const deliveryStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
});

type DeliveryStaffFormData = z.infer<typeof deliveryStaffSchema>;

export const DeliveryStaffForm = ({
  entityType,
  refetch,
  selectedStaff,
  setIsDialogOpen,
}: DeliveryStaffFormProps) => {
  const { createDeliveryStaff } = useCreateDeliveryStaff();
  const { updateDeliveryStaff } = useUpdateDeliveryStaff();

  const defaultValues: DeliveryStaffFormData = selectedStaff
    ? {
        name: selectedStaff.name,
        contactInfo: {
          phone: selectedStaff.contactInfo.phone || "",
          email: selectedStaff.contactInfo.email || "",
        },
      }
    : {
        name: "",
        contactInfo: { phone: "", email: "" },
      };

  const form = useForm<DeliveryStaffFormData>({
    resolver: zodResolver(deliveryStaffSchema),
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
      });
    } else {
      form.reset({
        name: "",
        contactInfo: { phone: "", email: "" },
      });
    }
  }, [selectedStaff, form]);

  const onSubmit = async (data: DeliveryStaffFormData) => {
    if (selectedStaff && selectedStaff._id) {
      await updateDeliveryStaff({
        deliveryStaffId: selectedStaff._id,
        formData: data,
      });
      setIsDialogOpen(false);
      refetch();
    } else {
      await createDeliveryStaff(data);
      setIsDialogOpen(false);
      refetch();
    }
  };

  return (
    <DialogContent className="w-[100%] overflow-auto">
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
          <div className="flex justify-end space-x-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
