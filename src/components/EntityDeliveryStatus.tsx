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
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { TDelivery } from "@/types";
import { useDeleteDelivery } from "@/api/deliveryStatus";
import { DeliveryStatus } from "./DeliveryStatus";

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
  "Patient Name": (item: TDelivery) => item.patientId.name || "N/A",
  "Assigned Pantry Staff": (item: TDelivery) => {
    return (
      <div>
        <div>{item.mealPreparationId.pantryStaffId.name}</div>
        <div>{item.mealPreparationId.pantryStaffId.contactInfo?.phone}</div>
      </div>
    );
  },
  "Assigned Delivery Personnel": (item: TDelivery) => {
    return (
      <div>
        <div>{item.deliveryPersonnelId.name}</div>
        <div>{item.deliveryPersonnelId.contactInfo?.phone}</div>
      </div>
    );
  },
  "Assigned On": (item: TDelivery) => formatTo12Hour(item.createdAt) || "N/A",
  "Delivery Time": (item: TDelivery) => formatTo12Hour(item.deliveryTime) || "N/A",
};

type Props = {
  entityType: string;
  data: TDelivery[];
  columns: string[];
  refetch: () => void;
};

export const EntityTableDelivery = ({
  entityType,
  data,
  columns,
  refetch,
}: Props) => {
  const { deleteDelivery } = useDeleteDelivery();

  const handleDelete = async (deliveryId: string) => {
    await deleteDelivery(deliveryId);
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
            {data.map((item: TDelivery) => (
              <TableRow key={item._id}>
                {columns.map((column: string) => {
                  if (column === "Status") {
                    return (
                      <TableCell key={column}>
                        <DeliveryStatus
                            status={item.status}
                            deliveryId={item._id}
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
                    onClick={() => handleDelete(item._id)}
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
