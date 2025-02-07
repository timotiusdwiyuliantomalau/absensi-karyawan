import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import FormRegister from "./components/pages/FormRegister";
import { getCookie } from "./utils/cookies";
import Home from "./components/pages/Home";
import DaftarKaryawan from "./components/pages/DaftarKaryawan";
import KaryawanDetail from "./components/pages/KaryawanDetail";

const isLoggedIn = getCookie("myData");
const router = createHashRouter([
  {
    path: "/",
    element: isLoggedIn ? <Navigate to="/home" /> : <LoginPage />,
  },
  {
    path: "/register",
    element: isLoggedIn ? <Navigate to="/home" /> : <RegisterPage />,
  },
  {
    path: "/home",
    element: isLoggedIn ? <Home></Home> : <Navigate to="/" />,
  },
  {
    path: "/daftar-karyawan",
    element: <DaftarKaryawan />,
  },
  {
    path: "/daftar-karyawan/:email",
    element: <KaryawanDetail />,
  },
  { path: "/register-form", element: <FormRegister /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
