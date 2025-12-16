import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome.tsx";
import HomePage from "./pages/HomePage";
import Kattendence from "./pages/Kattendence";
import Equipments from "./pages/Equipments";
import Calendar from "./pages/Calendar";
import './tailwind.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-[Rubik]">
      {/* <Navbar /> */}
      <div className="p-8">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Equipments" element={<Equipments />} />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Kattendence" element={<Kattendence />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
