import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientForm } from "./PatientForm";
import { TPatient } from "@/types";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useDeletePatient } from "@/api/patient";

type Props = {
  entityType: string;
  data: TPatient[];
  columns: string[];
  refetch: () => void;
};

const columnRenderers = {
  Name: (item: TPatient) => item.name,
  Age: (item: TPatient) => item.age,
  Gender: (item: TPatient) => item.gender,
  "Room Number": (item: TPatient) => item.roomNumber,
  "Bed Number": (item: TPatient) => item.bedNumber,
  "Floor Number": (item: TPatient) => item.floorNumber,
  "Contact Info": (item: TPatient) =>
    `${item.contactInfo?.phone || "N/A"}, ${item.contactInfo?.email || "N/A"}`,
  Diseases: (item: TPatient) => item.diseases?.join(", ") || "None",
  Allergies: (item: TPatient) => item.allergies?.join(", ") || "None",
  "Emergency Contact": (item: TPatient) =>
    item.emergencyContact
      ?.map((contact) => `${contact.name} (${contact.phone})`)
      .join(", ") || "None",
};

export const EntityTable = ({ entityType, data, columns, refetch }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<TPatient | null>(null);
  const { deletePatient } = useDeletePatient();

  const openCreateDialog = () => {
    setSelectedPatient(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: TPatient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleDeletPatient = async (patientId: string) => {
    await deletePatient(patientId);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">{entityType}</CardTitle>
          <CardDescription>Manage {entityType} records</CardDescription>
        </div>
        <div className="relative">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add {entityType}</span>
              </Button>
            </DialogTrigger>{" "}
            <PatientForm
              entityType={entityType}
              refetch={refetch}
              setIsDialogOpen={setIsDialogOpen}
            />
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {columnRenderers[column as keyof typeof columnRenderers]
                      ? columnRenderers[column as keyof typeof columnRenderers](
                          item
                        )
                      : ""}
                  </TableCell>
                ))}
                <TableCell className="space-y-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() => openEditDialog(item)}
                        className="flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                    </DialogTrigger>{" "}
                    <PatientForm
                      entityType={entityType}
                      refetch={refetch}
                      // @ts-expect-error: Expect an error on the next line
                      selectedPatient={selectedPatient}
                      setIsDialogOpen={setIsDialogOpen}
                    />
                  </Dialog>

                  <Button
                    onClick={() => handleDeletPatient(item._id as string)}
                    variant={"outline"}
                    className=" hover:bg-red-600 hover:text-white"
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

export default EntityTable;
