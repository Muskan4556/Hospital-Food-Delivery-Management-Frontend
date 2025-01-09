import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import AuthPage from "./pages/AuthPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <div>Home Page</div>
          </Layout>
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
