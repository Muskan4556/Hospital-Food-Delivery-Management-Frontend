import { useUpdateMealStatus } from "@/api/mealPreparation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Circle } from "lucide-react";

const statusArray = ["Pending", "In Progress", "Completed"];

type Props = { status: string; mealId: string; refetch: () => void };

export const MealStatus = ({ status, mealId, refetch }: Props) => {
  const { updateMealStatus } = useUpdateMealStatus();

  const handleStatus = async (status: string, mealId: string) => {
    await updateMealStatus({ mealId, status });
    refetch();
  };

  return (
    <div className="whitespace-nowrap">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all ease-in-out duration-200 border">
            <Circle
              className={`w-4 h-4 ${
                status === "Pending" ? "text-red-500 fill-red-500" : ""
              } 
                  ${
                    status === "In Progress"
                      ? "text-yellow-500 fill-yellow-500"
                      : ""
                  }
                  ${
                    status === "Completed"
                      ? "text-green-500 fill-green-500"
                      : ""
                  }`}
              stroke="none"
            />
            <div className="font-medium text-gray-800">{status}</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-lg border border-gray-200">
          <DropdownMenuLabel className="text-gray-700 font-semibold">
            Change Status
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusArray.map((s) => (
            <DropdownMenuItem
              onClick={() => handleStatus(s, mealId)}
              key={s}
              className="cursor-pointer text-gray-700 hover:text-white hover:bg-green-600 px-3 py-1 rounded-md transition-colors"
            >
              {s}{" "}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
