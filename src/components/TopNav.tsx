import { User } from "lucide-react";

export default function TopNav() {
  return (
    <header className="backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md sticky top-0 z-50 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <User className="text-gray-700" size={28} />
        <span className="text-gray-800 font-semibold text-lg">פרופיל</span>
      </div>
      <div className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition">
        חזרה לדף הבית
      </div>
    </header>
  );
}
