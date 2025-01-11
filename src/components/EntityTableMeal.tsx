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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {  CalendarIcon, Trash2, Truck } from "lucide-react";
import { TMeal } from "@/types";
import { MealStatus } from "./MealStatus";
import { useDeleteMeal } from "@/api/mealPreparation";
import { useCreateDelivery } from "@/api/deliveryStatus";
import { useGetAllDeliveryStaff } from "@/api/delivery-staff";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

function formatTo12Hour(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const columnRenderers = {
  "Patient Name": (item: TMeal) => item.patientId.name || "N/A",
  "Assigned Pantry Staff": (item: TMeal) => {
    return (
      <div>
        <div>{item.pantryStaffId.name}</div>
        <div>{item.pantryStaffId.contactInfo?.phone}</div>
      </div>
    );
  },
  "Diet Plan": (item: TMeal) =>
    item.dietChartId.morningMeal ||
    item.dietChartId.eveningMeal ||
    item.dietChartId.nightMeal ? (
      <>
        {item.dietChartId.morningMeal && (
          <div>{item.dietChartId.morningMeal}</div>
        )}
        {item.dietChartId.eveningMeal && (
          <div>{item.dietChartId.eveningMeal}</div>
        )}
        {item.dietChartId.nightMeal && <div>{item.dietChartId.nightMeal}</div>}
      </>
    ) : (
      "No Diet Plan"
    ),
  "Assigned On": (item: TMeal) => formatTo12Hour(item.createdAt) || "N/A",
  Instructions: (item: TMeal) =>
    item.dietChartId.instructions && item.dietChartId.instructions.length > 0
      ? item.dietChartId.instructions.map((instruction, index) => (
          <div key={index}>{instruction}</div>
        ))
      : "No Instructions",
};

type Props = {
  entityType: string;
  data: TMeal[];
  columns: string[];
  refetch: () => void;
};

export const EntityTableMeal = ({
  entityType,
  data,
  columns,
  refetch,
}: Props) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { deleteMeal } = useDeleteMeal();
  const { createDelivery } = useCreateDelivery();
  const { deliveryStaff } = useGetAllDeliveryStaff();

  const queryClient = useQueryClient();

  const handleMeal = async (mealId: string) => {
    await deleteMeal(mealId);
    refetch();
  };

  const handleAssignDelivery = async (
    mealId: string,
    deliveryStaff: string,
    patientId: string
  ) => {
    if (date) {
      await createDelivery({
        deliveryPersonnelId: deliveryStaff,
        mealPreparationId: mealId,
        patientId: patientId,
        deliveryTime: date,
      });
      refetch();
      await queryClient.refetchQueries({ queryKey: ["delivery"] });
    }
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
        <div className="relative"></div>
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
            {data.map((item: TMeal) => (
              <TableRow key={item._id}>
                {columns.map((column: string) => {
                  if (column === "Status") {
                    return (
                      <TableCell key={column}>
                        <MealStatus
                          status={item.status}
                          mealId={item._id}
                          refetch={refetch}
                        />
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={column}>
                        {columnRenderers[column as keyof typeof columnRenderers]
                          ? columnRenderers[
                              column as keyof typeof columnRenderers
                            ](item)
                          : ""}
                      </TableCell>
                    );
                  }
                })}
                <TableCell className="space-y-2">
                  <Button
                    variant="outline"
                    className="hover:bg-red-600 hover:text-white"
                    onClick={() => handleMeal(item._id as string)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"}>
                        <CalendarIcon />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <div className="flex">
                            <span>Pick delivery date</span>
                            <span className=" text-red-500 font-bold ml-2" > *</span>
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Truck className="w-4 h-4" />
                          <span>Assign Delivery</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="overflow-auto">
                        <DropdownMenuLabel>
                          Select delivery staff
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {deliveryStaff &&
                          deliveryStaff.map((staff) => (
                            <DropdownMenuItem
                              onClick={() =>
                                handleAssignDelivery(
                                  item._id as string,
                                  staff._id as string,
                                  item.patientId._id as string
                                )
                              }
                              className="font-semibold cursor-pointer"
                            >
                              {staff.name}
                            </DropdownMenuItem>
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
