// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
//       <h1 className="text-xl font-bold">מערכת ניהול</h1>
//       <div className="flex gap-4">
//         <Link to="/">דף הבית</Link>
//         <Link to="/login">התחברות</Link>
//       </div>
//     </nav>
//   );
// }
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">מערכת ניהול</h1>
      <div className="flex gap-6 text-lg">
        <Link to="/" className="hover:text-yellow-300 transition-colors">דף הבית</Link>
        <Link to="/login" className="hover:text-yellow-300 transition-colors">התחברות</Link>
      </div>
    </nav>
  );
}