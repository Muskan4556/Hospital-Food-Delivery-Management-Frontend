import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Users, Clock } from "lucide-react";
import { useGetAllPatients } from "@/api/patient";
import { EntityTable } from "./EntityTable";


const Dashboard = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const { patients, isLoading, error } = useGetAllPatients();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Hospital Food Management Dashboard
        </h1>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <Tabs defaultValue="patients" className="space-y-4 px-">
        <TabsList>
          <TabsTrigger value="patients">
            <Users className="w-4 h-4 mr-2" />
            Patients
          </TabsTrigger>
        </TabsList>

       {patients && <TabsContent value="patients">
          <EntityTable
            entityType="patient"
            data={patients}
            columns={[
              "Name",
              "Age",
              "Gender",
              "Room Number",
              "Bed Number",
              "Floor Number",
              "Contact Info",
              "Diseases",
              "Allergies",
              "Emergency Contact",
            ]}
          />
        </TabsContent>}
      </Tabs>
    </div>
  );
};

export default Dashboard;
