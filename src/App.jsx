// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800">
//       <Navbar />
//       <div className="p-6">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
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
