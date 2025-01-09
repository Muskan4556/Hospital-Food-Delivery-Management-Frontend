import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TPatient } from "@/types";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  entityType: string;
  data: TPatient[];
  columns: string[];
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

export const EntityTable = ({ entityType, data, columns }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">{entityType}</CardTitle>
          <CardDescription>Manage {entityType} records</CardDescription>
        </div>
        <Button
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {entityType}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Add scrolling and some padding for mobile devices */}
        <div className="overflow-x-auto px-2 py-3">
          <Table className="min-w-full table-auto">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="text-sm p-2">
                    {column}
                  </TableHead>
                ))}
                <TableHead className="text-sm p-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${item._id}-${column}`}
                      className="p-2 text-sm"
                    >
                      {columnRenderers[column as keyof typeof columnRenderers]
                        ? columnRenderers[
                            column as keyof typeof columnRenderers
                          ](item)
                        : "-"}
                    </TableCell>
                  ))}
                  <TableCell className="p-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFormMode("edit");
                        setSelectedEntity(item);
                        setIsFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
