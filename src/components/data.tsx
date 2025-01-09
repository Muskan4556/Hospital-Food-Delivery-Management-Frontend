import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Utensils,
  Clock,
  ChefHat,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { TPatient } from "@/types";
import { useGetAllPatients } from "@/api/patient";

const Dashboard = () => {
  // State for all entities
  // const [patients, setPatients] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     room: "201",
  //     dietType: "Regular",
  //     status: "Active",
  //   },
  // ]);

  const { patients, isLoading, error } = useGetAllPatients();
  console.log(patients);

  const [dietCharts, setDietCharts] = useState([
    {
      id: 1,
      patientId: 1,
      breakfast: "Oatmeal",
      lunch: "Grilled Chicken",
      dinner: "Fish",
      restrictions: "No nuts",
    },
  ]);

  const [pantryStaff, setPantryStaff] = useState([
    { id: 1, name: "Mike Johnson", role: "Chef", shift: "Morning" },
  ]);

  const [deliveryStaff, setDeliveryStaff] = useState([
    { id: 1, name: "Tom Smith", shift: "Morning", status: "Available" },
  ]);

  const [meals, setMeals] = useState([
    {
      id: 1,
      patientId: 1,
      type: "Lunch",
      status: "Preparing",
      assignedStaff: 1,
    },
  ]);

  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      mealId: 1,
      staffId: 1,
      status: "Pending",
      scheduledTime: "12:30 PM",
    },
  ]);

  // State for forms
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'

  // Generic form state
  const [formData, setFormData] = useState({});

  // Form handlers
  const handleFormSubmit = (entityType) => {
    switch (entityType) {
      case "patient":
        if (formMode === "create") {
          setPatients([...patients, { ...formData, id: patients.length + 1 }]);
        } else {
          setPatients(
            patients.map((p) =>
              p.id === selectedEntity.id ? { ...p, ...formData } : p
            )
          );
        }
        break;
      case "dietChart":
        if (formMode === "create") {
          setDietCharts([
            ...dietCharts,
            { ...formData, id: dietCharts.length + 1 },
          ]);
        } else {
          setDietCharts(
            dietCharts.map((d) =>
              d.id === selectedEntity.id ? { ...d, ...formData } : d
            )
          );
        }
        break;
      // Add similar cases for other entities
    }
    setIsFormOpen(false);
    setFormData({});
  };

  const handleDelete = (entityType, id) => {
    switch (entityType) {
      case "patient":
        setPatients(patients.filter((p) => p.id !== id));
        break;
      case "dietChart":
        setDietCharts(dietCharts.filter((d) => d.id !== id));
        break;
      // Add similar cases for other entities
    }
  };

  // Reusable EntityTable component
  // const EntityTable = ({ entityType, data, columns, onEdit, onDelete }) => (
  //   <Card>
  //     <CardHeader className="flex flex-row items-center justify-between">
  //       <div>
  //         <CardTitle className="capitalize">{entityType}</CardTitle>
  //         <CardDescription>Manage {entityType} records</CardDescription>
  //       </div>
  //       <Button
  //         onClick={() => {
  //           setFormMode("create");
  //           setSelectedEntity(null);
  //           setIsFormOpen(true);
  //         }}
  //       >
  //         <Plus className="w-4 h-4 mr-2" />
  //         Add {entityType}
  //       </Button>
  //     </CardHeader>
  //     <CardContent>
  //       <ScrollArea className="h-[400px]">
  //         <Table>
  //           <TableHeader>
  //             <TableRow>
  //               {columns.map((column) => (
  //                 <TableHead key={column}>{column}</TableHead>
  //               ))}
  //               <TableHead>Actions</TableHead>
  //             </TableRow>
  //           </TableHeader>
  //           <TableBody>
  //             {data.map((item) => (
  //               <TableRow key={item.id}>
  //                 {columns.map((column) => (
  //                   <TableCell key={`${item.id}-${column}`}>
  //                     {item[column.toLowerCase()]}
  //                   </TableCell>
  //                 ))}
  //                 <TableCell>
  //                   <div className="flex space-x-2">
  //                     <Button
  //                       variant="outline"
  //                       size="sm"
  //                       onClick={() => onEdit(item)}
  //                     >
  //                       <Pencil className="w-4 h-4" />
  //                     </Button>
  //                     <Button
  //                       variant="destructive"
  //                       size="sm"
  //                       onClick={() => onDelete(item.id)}
  //                     >
  //                       <Trash2 className="w-4 h-4" />
  //                     </Button>
  //                   </div>
  //                 </TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </ScrollArea>
  //     </CardContent>
  //   </Card>
  // );
  const EntityTable = ({ entityType, data, columns, onEdit, onDelete }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">{entityType}</CardTitle>
          <CardDescription>Manage {entityType} records</CardDescription>
        </div>
        <Button
          onClick={() => {
            setFormMode("create");
            setSelectedEntity(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {entityType}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  {columns.map((column) => (
                    <TableCell key={`${item._id}-${column}`}>
                      {/* Handle nested data by checking column name */}
                      {column === "Contact"
                        ? `${item.contactInfo?.phone}` // Show phone from contactInfo
                        : column === "Emergency Contact"
                        ? item.emergencyContact
                            .map(
                              (contact) => `${contact.name} (${contact.phone})`
                            )
                            .join(", ")
                        : item[column.toLowerCase()] ||
                          "-" // Handle other columns
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  // Form Components
  const PatientForm = ({ onSubmit, initialData = {} }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name || initialData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="room">Room</Label>
        <Input
          id="room"
          value={formData.room || initialData.room || ""}
          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="dietType">Diet Type</Label>
        <Select
          onValueChange={(value) =>
            setFormData({ ...formData, dietType: value })
          }
          defaultValue={initialData.dietType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select diet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Diabetic">Diabetic</SelectItem>
            <SelectItem value="Low Sodium">Low Sodium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isLoading) {
    <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-scrxeen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Hospital Food Management Dashboard
        </h1>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">
            <Users className="w-4 h-4 mr-2" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="diet-charts">
            <ChefHat className="w-4 h-4 mr-2" />
            Diet Charts
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="w-4 h-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="meals">
            <Utensils className="w-4 h-4 mr-2" />
            Meals
          </TabsTrigger>
        </TabsList>

        {/* Patients Tab */}
        {/* <TabsContent value="patients">
          <EntityTable
            entityType="patient"
            data={patients}
            columns={["Name", "Room", "Diet Type", "Status"]}
            onEdit={(patient) => {
              setSelectedEntity(patient);
              setFormMode("edit");
              setFormData(patient);
              setIsFormOpen(true);
            }}
            onDelete={(id) => handleDelete("patient", id)}
          />
        </TabsContent> */}
        <TabsContent value="patients">
          <EntityTable
            entityType="patient"
            data={patients}
            columns={["Name", "Room", "Contact", "Emergency Contact"]} // Updated columns
            onEdit={(patient) => {
              setSelectedEntity(patient);
              setFormMode("edit");
              setFormData(patient);
              setIsFormOpen(true);
            }}
            // onDelete={(id) => handleDelete("patient", id)}
          />
        </TabsContent>

        {/* Add similar TabsContent for other entities */}
      </Tabs>

      {/* CRUD Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Create" : "Edit"}{" "}
              {selectedEntity?.type || "Patient"}
            </DialogTitle>
          </DialogHeader>

          {/* Render appropriate form based on entity type */}
          <PatientForm
            onSubmit={() => handleFormSubmit("patient")}
            initialData={selectedEntity}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleFormSubmit("patient")}>
              {formMode === "create" ? "Create" : "Save"}
            </Button>
            {/* <div>}</div> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
