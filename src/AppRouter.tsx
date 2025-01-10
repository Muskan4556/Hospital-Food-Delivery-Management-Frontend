import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import { useAppContext } from "./context/useAppContext";

const AppRouter = () => {
  const { isLoggedIn, loading } = useAppContext();

  if (loading) {
    return <div>Loading...</div>; // You can show a loading spinner or some UI here
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />
      <Route
        path="/auth/signup"
        element={
          <Layout>
            <AuthPage />
          </Layout>
        }
      />
      <Route
        path="/auth/login"
        element={
          <Layout>
            <AuthPage />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
