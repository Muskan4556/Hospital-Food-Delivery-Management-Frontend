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
import { TDeliveryStaff } from "@/types";
import { useState } from "react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { DeliveryStaffForm } from "./DeliveryStaffForm";
import { useDeleteDeliveryStaff } from "@/api/delivery-staff";

const columnRenderers = {
  Name: (item: TDeliveryStaff) => item.name || "N/A",
  "Contact Info": (item: TDeliveryStaff) => (
    <div className="space-y-2">
      <div>{item.contactInfo?.email || "N/A"}</div>
      <div>{item.contactInfo?.phone || "N/A"}</div>
    </div>
  ),
};

type Props = {
  entityType: string;
  data: TDeliveryStaff[];
  columns: string[];
  refetch: () => void;
};

export const EntityTableDeliveryStaff = ({
  entityType,
  data,
  columns,
  refetch,
}: Props) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDeliveryStaff, setSelectedDeliveryStaff] =
    useState<TDeliveryStaff | null>(null);

  const { deleteDeliveryStaff } = useDeleteDeliveryStaff();

  const openCreateDialog = () => {
    setSelectedDeliveryStaff(null);
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (deliveryStaff: TDeliveryStaff) => {
    setSelectedDeliveryStaff(deliveryStaff);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDeliveryStaff = async (deliveryStaffId: string) => {
    await deleteDeliveryStaff(deliveryStaffId);
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
            <DeliveryStaffForm
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
            {data.map((item: TDeliveryStaff) => (
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
                    {selectedDeliveryStaff && (
                      <DeliveryStaffForm
                        entityType={entityType}
                        refetch={refetch}
                        selectedStaff={selectedDeliveryStaff}
                        setIsDialogOpen={setIsEditDialogOpen}
                      />
                    )}
                  </Dialog>

                  <Button
                    onClick={() =>
                      handleDeleteDeliveryStaff(item._id as string)
                    }
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
