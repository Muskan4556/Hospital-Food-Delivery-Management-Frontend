import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, ChefHat, Utensils, Truck, Package } from "lucide-react";
import { useGetAllPatients } from "@/api/patient";
import { EntityTable } from "./EntityTable";
import { useGetAllDietCharts } from "@/api/diet-chart";
import { EntityTableDietChart } from "./EntityTableDietChart";
import Loader from "./Loader";
import { useGetAllPantryStaff } from "@/api/pantry-Staff";
import { EntityTablePantryStaff } from "./EntityTablePantryStaff";
import { useGetAllMeal } from "@/api/mealPreparation";
import { EntityTableMeal } from "./EntityTableMeal";
import { useGetAllDeliveryStaff } from "@/api/delivery-staff";
import { EntityTableDeliveryStaff } from "./EntityTableDeliveryStaff";
import { useGetAllDelivery } from "@/api/deliveryStatus";
import { EntityTableDelivery } from "./EntityDeliveryStatus";

const Dashboard = () => {
  const { patients, isLoading, refetch, error } = useGetAllPatients();
  const {
    dietCharts,
    isLoading: isLoadingDiet,
    refetch: refetchDietCharts,
    error: errorDietCharts,
  } = useGetAllDietCharts();

  const {
    pantryStaff,
    isLoading: isLoadingPantryStaff,
    refetch: refetchPantryStaff,
    error: errorPantryStaff,
  } = useGetAllPantryStaff();
  const {
    meals,
    isLoading: isLoadingMeal,
    refetch: refetchMeal,
    error: errorMeal,
  } = useGetAllMeal();

  const {
    deliveryStaff,
    isLoading: isLoadingDeliveryStaff,
    refetch: refetchDeliveryStaff,
    error: errorDeliveryStaff,
  } = useGetAllDeliveryStaff();

  const {
    delivery,
    isLoading: isLoadingDelivery,
    refetch: refetchDelivery,
    error: errorDelivery,
  } = useGetAllDelivery();

  if (
    isLoading ||
    isLoadingDiet ||
    isLoadingPantryStaff ||
    isLoadingMeal ||
    isLoadingDeliveryStaff ||
    isLoadingDelivery
  ) {
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
            Pantry Team
          </TabsTrigger>
          <TabsTrigger value="delivery-personnel">
            <Truck className="w-4 h-4 mr-2" />
            Delivery Team
          </TabsTrigger>
          <TabsTrigger value="meals">
            <Utensils className="w-4 h-4 mr-2" />
            Meal Preparation
          </TabsTrigger>
          <TabsTrigger value="delivery-status">
            <Package className="w-4 h-4 mr-2" />
            Delivery Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-red-500">
              Failed to load patients:{" "}
              {error.message || "An unknown error occurred."}
            </p>
          ) : patients ? (
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
          ) : (
            <p>No patient data available.</p>
          )}
        </TabsContent>

        <TabsContent value="diet-charts">
          {isLoadingDiet ? (
            <Loader />
          ) : errorDietCharts ? (
            <p className="text-red-500">
              Failed to load diet charts:{" "}
              {errorDietCharts.message || "An unknown error occurred."}
            </p>
          ) : dietCharts ? (
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
          ) : (
            <p>No diet chart data available.</p>
          )}
        </TabsContent>

        <TabsContent value="pantry-staff">
          {isLoadingPantryStaff ? (
            <Loader />
          ) : errorPantryStaff ? (
            <p className="text-red-500">
              Failed to load pantry staff:{" "}
              {errorPantryStaff.message || "An unknown error occurred."}
            </p>
          ) : pantryStaff ? (
            <EntityTablePantryStaff
              entityType="Pantry Team"
              refetch={refetchPantryStaff}
              data={pantryStaff}
              columns={["Name", "Contact Info", "Location"]}
            />
          ) : (
            <p>No pantry staff data available.</p>
          )}
        </TabsContent>

        <TabsContent value="delivery-personnel">
          {isLoadingDeliveryStaff ? (
            <Loader />
          ) : errorDeliveryStaff ? (
            <p className="text-red-500">
              Failed to load delivery team:{" "}
              {errorDeliveryStaff.message || "An unknown error occurred."}
            </p>
          ) : deliveryStaff ? (
            <EntityTableDeliveryStaff
              entityType="Delivery Team"
              refetch={refetchDeliveryStaff}
              data={deliveryStaff}
              columns={["Name", "Contact Info"]}
            />
          ) : (
            <p>No delivery team data available.</p>
          )}
        </TabsContent>

        <TabsContent value="meals">
          {isLoadingMeal ? (
            <Loader />
          ) : errorMeal ? (
            <p className="text-red-500">
              Failed to load meals:{" "}
              {errorMeal.message || "An unknown error occurred."}
            </p>
          ) : meals ? (
            <EntityTableMeal
              entityType="Meals"
              refetch={refetchMeal}
              data={meals}
              columns={[
                "Patient Name",
                "Assigned Pantry Staff",
                "Diet Plan",
                "Status",
                "Assigned On",
                "Instructions",
              ]}
            />
          ) : (
            <p>No meal data available.</p>
          )}
        </TabsContent>

        <TabsContent value="delivery-status">
          {isLoadingDelivery ? (
            <Loader />
          ) : errorDelivery ? (
            <p className="text-red-500">
              Failed to load delivery status:{" "}
              {errorDelivery.message || "An unknown error occurred."}
            </p>
          ) : delivery ? (
            <EntityTableDelivery
              entityType="Deliveries"
              refetch={refetchDelivery}
              data={delivery}
              columns={[
                "Patient Name",
                "Assigned Pantry Staff",
                "Assigned Delivery Personnel",
                "Status",
                "Assigned On",
                "Delivery Time"
              ]}
            />
          ) : (
            <p>No delivery status data available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
