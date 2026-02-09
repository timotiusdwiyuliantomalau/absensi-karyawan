import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import FormRegister from "./components/pages/FormRegister";
import Home from "./components/pages/Home";
import DaftarKaryawan from "./components/pages/DaftarKaryawan";
import KaryawanDetail from "./components/pages/KaryawanDetail";
import RekapAbsensiKaryawan from "./components/pages/RekapAbsensiKaryawan";
import Kalender from "./components/pages/Kalender";
import ModalKunjungan from "./components/pages/ModalKunjungan";
import RekapKunjunganKaryawan from "./components/pages/RekapKunjunganKaryawan";
import AdministrasiKaryawan from "./components/pages/AdministrasiKaryawan";
import TambahGerai from "./components/pages/TambahGerai";
import IzinKaryawan from "./components/pages/IzinKaryawan";

const isLoggedIn = localStorage.getItem("myData")&&JSON.parse(localStorage.getItem("myData")||"");
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
  { path: "/rekap-absensi-karyawan", element: <RekapAbsensiKaryawan /> },
  { path: "/kalender", element: <Kalender /> },
  { path: "/kunjungan", element: <ModalKunjungan /> },
  { path: "/rekap-kunjungan-karyawan", element: <RekapKunjunganKaryawan /> },
  { path: "/manajemen-karyawan", element: <AdministrasiKaryawan /> },
  { path: "/tambah-gerai", element: <TambahGerai /> },
  {path:"/izin-karyawan",element:<IzinKaryawan/>}
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
