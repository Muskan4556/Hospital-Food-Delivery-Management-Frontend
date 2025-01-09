import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  value: string;
};

const LoadingButton = ({ value }: Props) => {
  return (
    <Button
      disabled
      className="mt-4 w-full py-2 bg-[#0066FF] text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
    >
      <div>{value} </div>
      <Loader2 className="ml-2 h-4 w-4 animate-spin " />
    </Button>
  );
};

export default LoadingButton;
