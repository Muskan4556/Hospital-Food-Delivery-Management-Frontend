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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { TDietChart } from "@/types";
import { useState } from "react";
import { useDeleteDietChart } from "@/api/diet-chart";
import { DietChartForm } from "./DietChartForm";

const columnRenderers = {
  "Patient Name": (item: TDietChart) => item.patientId.name || "N/A",
  "Morning Meal": (item: TDietChart) => item.morningMeal || "N/A",
  "Evening Meal": (item: TDietChart) => item.eveningMeal || "N/A",
  "Night Meal": (item: TDietChart) => item.nightMeal || "N/A",
  Ingredients: (item: TDietChart) =>
    item.ingredients && item.ingredients.length > 0 ? (
      <>
        {item.ingredients.map((i, index) => (
          <div key={index}>
            {i.ingredient} ({i.quantity})
          </div>
        ))}
      </>
    ) : (
      "No Ingredients"
    ),
  Instructions: (item: TDietChart) =>
    item.instructions && item.instructions.length > 0 ? (
      <>
        {item.instructions.map((instruction, index) => (
          <div key={index}>{instruction}</div>
        ))}
      </>
    ) : (
      "No Instructions"
    ),
};

type Props = {
  entityType: string;
  data: TDietChart[];
  columns: string[];
  refetch: () => void;
};

export const EntityTableDietChart = ({
  entityType,
  data,
  columns,
  refetch,
}: Props) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDietChart, setSelectedDietChart] = useState<TDietChart | null>(
    null
  );
  const { deleteDietChart } = useDeleteDietChart();

  const openCreateDialog = () => {
    setSelectedDietChart(null);
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (dietChart: TDietChart) => {
    setSelectedDietChart(dietChart);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDietChart = async (dietChartId: string) => {
    await deleteDietChart(dietChartId);
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
            <DietChartForm
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
            {data.map((item: TDietChart) => (
              <TableRow key={item.patientId._id}>
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
                    {selectedDietChart && (
                      <DietChartForm
                        entityType={entityType}
                        refetch={refetch}
                        selectedDiet={selectedDietChart}
                        setIsDialogOpen={setIsEditDialogOpen}
                      />
                    )}
                  </Dialog>

                  <Button
                    onClick={() => handleDeleteDietChart(item._id as string)}
                    variant="outline"
                    className="hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
