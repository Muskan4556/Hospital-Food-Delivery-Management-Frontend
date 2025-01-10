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
import { PatientForm } from "./PaitentForm";
import { TPatient } from "@/types";

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">{entityType}</CardTitle>
          <CardDescription>Manage {entityType} records</CardDescription>
        </div>
        <div className="relative">
          <PatientForm entityType={entityType} refetch={refetch} />
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EntityTable;
