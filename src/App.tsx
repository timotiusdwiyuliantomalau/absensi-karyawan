import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import FormRegister from "./components/pages/FormRegister";
import LoginPage from "./components/pages/LoginPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<FormRegister />} />
      </Routes>
    </Router>
  );
}
