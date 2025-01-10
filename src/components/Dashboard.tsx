import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Users, Clock, ChefHat, Utensils } from "lucide-react";
import { useGetAllPatients } from "@/api/patient";
import { EntityTable } from "./EntityTable";

const Dashboard = () => {
  const { patients, isLoading, error, refetch } = useGetAllPatients();

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

        {patients && (
          <TabsContent value="patients">
            <EntityTable
              entityType="patient"
              refetch={refetch}
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
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
