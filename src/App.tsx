import { HashRouter as Router, Route, Routes } from 'react-router-dom';import Home from './components/pages/Home';
import LoginPage from './components/pages/LoginPage';
;

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

