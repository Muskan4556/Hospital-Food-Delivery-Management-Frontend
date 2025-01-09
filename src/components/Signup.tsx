import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useCreateNewUser } from "@/api/auth";
import LoadingButton from "./LoadingButton";
import { useAppContext } from "@/context/useAppContext";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one symbol"
    )
    .refine(
      (value) =>
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /\d/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value),
      {
        message:
          "Password must be strong (min 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol)",
      }
    ),
});

export type SignupData = z.infer<typeof formSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser, error, status } = useCreateNewUser();
  const navigate = useNavigate();
  const { validateToken } = useAppContext();

  const form = useForm<SignupData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupData) => {
    try {
      await registerUser(data);
      if (!error) {
        await validateToken();
        navigate("/");
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center px-4 sm:px-6 md:px-8 mt-4"
      >
        <motion.div
          className="max-w-md w-full p-8 space-y-6 bg-white shadow-lg border rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0066FF] mb-4">
              MedCare Hospital
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              Let's get you started!
            </h2>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter a password"
                        className="bg-white"
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {status === "pending" ? (
            <LoadingButton value="Sign Up" />
          ) : (
            <Button
              type="submit"
              className="mt-4 w-full py-2 bg-[#0066FF] text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </Button>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#0066FF] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </form>
    </Form>
  );
};

export default Signup;
