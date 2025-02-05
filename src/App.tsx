import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import FormRegister from "./components/pages/FormRegister";
import LoginPage from "./components/pages/LoginPage";
import DaftarKaryawan from "./components/pages/DaftarKaryawan";
import RegisterPage from "./components/pages/RegisterPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/daftar-karyawan" element={<DaftarKaryawan />} />
        <Route path="/register-form" element={<FormRegister />} />
      </Routes>
    </Router>
  );
}
