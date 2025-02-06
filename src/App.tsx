import { createHashRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import Home from "./components/pages/Home";
import DaftarKaryawan from "./components/pages/DaftarKaryawan";
import FormRegister from "./components/pages/FormRegister";

const router = createHashRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/home", element: <Home /> },
  { path: "/daftar-karyawan", element: <DaftarKaryawan /> },
  { path: "/register-form", element: <FormRegister /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
