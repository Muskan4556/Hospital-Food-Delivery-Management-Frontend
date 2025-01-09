import { useLogout } from "@/api/auth";
import { useAppContext } from "@/context/useAppContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { isLoggedIn, validateToken, userRole } = useAppContext();
  const { logoutUser } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth/login");
    await validateToken();
  };

  return (
    <header className="bg-blue-600 text-white px-4 py-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to={"/"} className="ml-3 text-xl md:text-2xl font-semibold">
            MedCare Hospital
          </Link>
        </div>
        <nav className="space-x-6">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="font-semibold cursor-pointer md:text-lg">{userRole}</div>
              <div
                onClick={handleLogout}
                className="hover:text-gray-200 hover:underline font-semibold cursor-pointer md:text-lg"
              >
                Logout
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="hover:text-gray-200 hover:underline font-semibold cursor-pointer md:text-lg"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
