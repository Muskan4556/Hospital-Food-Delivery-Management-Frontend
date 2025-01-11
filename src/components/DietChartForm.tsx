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
import { TDietChart } from "@/types";
import { useEffect } from "react";
import { useCreateDietChart, useUpdateDietChart } from "@/api/diet-chart";

type DietFormProps = {
  entityType: string;
  refetch: () => void;
  setIsDialogOpen: (open: boolean) => void;
  selectedDiet?: TDietChart;
};

const dietSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  morningMeal: z.string().min(1, "Morning meal is required"),
  eveningMeal: z.string().min(1, "Evening meal is required"),
  nightMeal: z.string().min(1, "Night meal is required"),
  ingredients: z.array(
    z.object({
      ingredient: z.string().min(1, "Ingredient is required"),
      quantity: z.string().min(1, "Quantity is required"),
    })
  ),
  instructions: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

type DietFormData = z.infer<typeof dietSchema>;

export const DietChartForm = ({
  entityType,
  refetch,
  selectedDiet,
  setIsDialogOpen,
}: DietFormProps) => {
  const { createDietChart } = useCreateDietChart();
  const { updateDietChart } = useUpdateDietChart();

  const defaultValues = selectedDiet
    ? {
        patientId: selectedDiet.patientId._id.toString(),
        morningMeal: selectedDiet.morningMeal,
        eveningMeal: selectedDiet.eveningMeal,
        nightMeal: selectedDiet.nightMeal,
        ingredients: selectedDiet.ingredients,
        instructions: selectedDiet.instructions,
      }
    : {
        patientId: "",
        morningMeal: "",
        eveningMeal: "",
        nightMeal: "",
        ingredients: [{ ingredient: "", quantity: "" }],
        instructions: [],
      };

  const form = useForm<DietFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues,
  });

  useEffect(() => {
    if (selectedDiet) {
      form.reset({
        patientId: selectedDiet.patientId._id.toString(),
        morningMeal: selectedDiet.morningMeal,
        eveningMeal: selectedDiet.eveningMeal,
        nightMeal: selectedDiet.nightMeal,
        ingredients: selectedDiet.ingredients,
        instructions: selectedDiet.instructions,
      });
    } else {
      form.reset({
        patientId: "",
        morningMeal: "",
        eveningMeal: "",
        nightMeal: "",
        ingredients: [{ ingredient: "", quantity: "" }],
        instructions: [],
      });
    }
  }, [selectedDiet, form]);

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });
  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    // @ts-expect-error: Expect an error on the next line
    name: "instructions",
  });

  const onSubmit = async (data: DietFormData) => {
    const { patientId, ...rest } = data;
    const formattedData = {
      ...rest,
      patientId: { _id: patientId },
    };
    if (selectedDiet && selectedDiet._id) {
      await updateDietChart({
        dietChartId: selectedDiet._id,
        formData: formattedData,
      });
      setIsDialogOpen(false);
      refetch();
    } else {
      await createDietChart(formattedData);
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
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Patient ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="morningMeal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Morning Meal</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Morning Meal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eveningMeal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evening Meal</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Evening Meal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nightMeal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Night Meal</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Night Meal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormLabel className="font-semibold">Ingredients</FormLabel>
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex space-x-4">
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.ingredient`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Ingredient" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeIngredient(index)}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendIngredient({ ingredient: "", quantity: "" })}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ingredient</span>
            </Button>
          </div>
          <div className="space-y-4">
            <FormLabel className="font-semibold">Instructions</FormLabel>
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex space-x-4">
                <FormField
                  control={form.control}
                  name={`instructions.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Instruction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeInstruction(index)}
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
              onClick={() => appendInstruction("")} // Add a blank instruction field
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Instruction</span>
            </Button>
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
