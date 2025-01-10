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
import { TPantryStaff } from "@/types";

const columnRenderers = {
  "Staff Name": (item: TPantryStaff) => item.name || "N/A",
  Phone: (item: TPantryStaff) => item.contactInfo?.phone || "N/A",
  Email: (item: TPantryStaff) => item.contactInfo?.email || "N/A",
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
}: Props) => {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">{entityType}</CardTitle>
          <CardDescription>Manage {entityType} records</CardDescription>
        </div>
        <div className="relative">
          
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
              <TableRow key={item.name}>
                {columns.map((column: string) => (
                  <TableCell key={column}>
                    {columnRenderers[column as keyof typeof columnRenderers]
                      ? columnRenderers[column as keyof typeof columnRenderers](
                          item
                        )
                      : ""}
                  </TableCell>
                ))}
                <TableCell>
                    <Button variant={"outline"}>Assign Meal</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
