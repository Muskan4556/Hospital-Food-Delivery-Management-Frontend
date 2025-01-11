import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { TMealPreparation, TPantryStaff } from "@/types";
import { useState } from "react";
import { useDeletePantryStaff } from "@/api/pantry-Staff";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { ChefHat, Edit, Plus, Trash2 } from "lucide-react";
import { PantryStaffForm } from "./PantryStaffForm";
import { useGetAllDietCharts } from "@/api/diet-chart";
import { useCreateMeal } from "@/api/mealPreparation";
import { useQueryClient } from "@tanstack/react-query";

const columnRenderers = {
  Name: (item: TPantryStaff) => item.name || "N/A",
  "Contact Info": (item: TPantryStaff) => (
    <div className="space-y-2">
      <div>{item.contactInfo?.email || "N/A"}</div>
      <div>{item.contactInfo?.phone || "N/A"}</div>
    </div>
  ),
  Location: (item: TPantryStaff) => item.location || "N/A",
};

type Props = {
  entityType: string;
  data: TPantryStaff[];
  columns: string[];
  refetch: () => void;
};

export const EntityTablePantryStaff = ({
  entityType,
  data,
  columns,
  refetch,
}: Props) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPantryStaff, setSelectedPantryStaff] =
    useState<TPantryStaff | null>(null);

  const { deletePantryStaff } = useDeletePantryStaff();
  const { dietCharts } = useGetAllDietCharts();
  const { createMeal } = useCreateMeal();

  const queryClient = useQueryClient();

  const handleMealPreparation = async (
    pantryStaffId: string,
    dietChartId: string,
    patientId: string
  ) => {
    const formData: TMealPreparation = {
      pantryStaffId,
      dietChartId,
      patientId,
      status: "Pending",
    };
    await createMeal(formData);
    await queryClient.refetchQueries({ queryKey: ["meal"] });
  };

  const openCreateDialog = () => {
    setSelectedPantryStaff(null);
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (pantryStaff: TPantryStaff) => {
    setSelectedPantryStaff(pantryStaff);
    setIsEditDialogOpen(true);
  };

  const handleDeletePantryStaff = async (pantryStaffId: string) => {
    await deletePantryStaff(pantryStaffId);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">{entityType}</CardTitle>
          <CardDescription className="mt-2">
            Manage {entityType} records
          </CardDescription>
        </div>
        <div className="relative">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add {entityType}</span>
              </Button>
            </DialogTrigger>
            <PantryStaffForm
              entityType={entityType}
              refetch={refetch}
              setIsDialogOpen={setIsCreateDialogOpen}
            />
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column: string) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: TPantryStaff) => (
              <TableRow key={item._id}>
                {columns.map((column: string) => (
                  <TableCell key={column}>
                    {columnRenderers[column as keyof typeof columnRenderers]
                      ? columnRenderers[column as keyof typeof columnRenderers](
                          item
                        )
                      : ""}
                  </TableCell>
                ))}
                <TableCell className="space-y-2">
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => openEditDialog(item)}
                        className="flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                    </DialogTrigger>
                    {selectedPantryStaff && (
                      <PantryStaffForm
                        entityType={entityType}
                        refetch={refetch}
                        selectedStaff={selectedPantryStaff}
                        setIsDialogOpen={setIsEditDialogOpen}
                      />
                    )}
                  </Dialog>

                  <Button
                    onClick={() => handleDeletePantryStaff(item._id as string)}
                    variant="outline"
                    className="hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <ChefHat className="w-4 h-4" />
                          <span>Assign Patient's Meal</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="overflow-auto">
                        <DropdownMenuLabel>
                          Select diet chart for
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {dietCharts &&
                          dietCharts.map((diet) => (
                            <DropdownMenuSub key={diet._id}>
                              <DropdownMenuSubTrigger
                                onClick={() =>
                                  handleMealPreparation(
                                    item._id as string,
                                    diet._id as string,
                                    diet.patientId._id as string
                                  )
                                }
                              >
                                <div className="flex flex-col cursor-pointer">
                                  <div className="font-bold">
                                    {diet.patientId.name}
                                  </div>
                                  {diet?.patientId?.diseases && (
                                    <div className="text-sm text-gray-500">
                                      <span className="font-bold">
                                        Diseases:
                                      </span>{" "}
                                      {diet?.patientId?.diseases?.join(", ")}
                                    </div>
                                  )}
                                  {diet?.patientId?.allergies && (
                                    <div className="text-sm text-red-500">
                                      <span className="font-bold">
                                        Allergies:
                                      </span>{" "}
                                      {diet?.patientId?.allergies?.join(", ")}
                                    </div>
                                  )}
                                </div>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem>
                                    <span className="font-bold">
                                      Morning Meal:
                                    </span>{" "}
                                    {diet.morningMeal}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <span className="font-bold">
                                      Evening Meal:
                                    </span>{" "}
                                    {diet.eveningMeal}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <span className="font-bold">
                                      Night Meal:
                                    </span>{" "}
                                    {diet.nightMeal}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
