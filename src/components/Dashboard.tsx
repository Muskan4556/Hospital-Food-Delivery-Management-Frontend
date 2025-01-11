import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Users, Clock, ChefHat, Utensils } from "lucide-react";
import { useGetAllPatients } from "@/api/patient";
import { EntityTable } from "./EntityTable";
import { useGetAllDietCharts } from "@/api/diet-chart";
import { EntityTableDietChart } from "./EntityTableDietChart";
import Loader from "./Loader";
import { useGetAllPantryStaff } from "@/api/pantry-Staff";
import { EntityTablePantryStaff } from "./EntityTablePantryStaff";

const Dashboard = () => {
  const { patients, isLoading, refetch } = useGetAllPatients();
  const {
    dietCharts,
    isLoading: isLoadingDiet,
    refetch: refetchDietCharts,
  } = useGetAllDietCharts();

  const {
    pantryStaff,
    isLoading: isLoadingPantryStaff,
    refetch: refetchPantryStaff,
  } = useGetAllPantryStaff();

  if (isLoading || isLoadingDiet || isLoadingPantryStaff) {
    return <Loader />;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Badge>
      </div>

      <Tabs defaultValue="diet-charts" className="space-y-4 ">
        <TabsList className="flex-col flex-wrap overflow-auto">
          <TabsTrigger value="patients">
            <Users className="w-4 h-4 mr-2" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="diet-charts">
            <ChefHat className="w-4 h-4 mr-2" />
            Diet Charts
          </TabsTrigger>
          <TabsTrigger value="pantry-staff">
            <Users className="w-4 h-4 mr-2" />
            Pantry Staff
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

        {dietCharts && (
          <TabsContent value="diet-charts">
            <EntityTableDietChart
              entityType="Diet Chart"
              refetch={refetchDietCharts}
              data={dietCharts}
              columns={[
                "Patient Name",
                "Morning Meal",
                "Evening Meal",
                "Night Meal",
                "Ingredients",
                "Instructions",
              ]}
            />
          </TabsContent>
        )}
        {pantryStaff && (
          <TabsContent value="pantry-staff">
            <EntityTablePantryStaff
              entityType="Pantry Staff"
              refetch={refetchPantryStaff}
              data={pantryStaff}
              columns={["Name", "Contact Info", "Location"]}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
