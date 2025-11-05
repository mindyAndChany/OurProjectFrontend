// import { useState } from "react";

// export default function Login() {
//   const [user, setUser] = useState({ username: "", password: "" });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Login attempt:", user);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[70vh]">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded-2xl p-6 w-80"
//       >
//         <h2 className="text-xl font-bold mb-4 text-center">התחברות</h2>
//         <input
//           type="text"
//           placeholder="שם משתמש"
//           value={user.username}
//           onChange={(e) => setUser({ ...user, username: e.target.value })}
//           className="border w-full mb-3 p-2 rounded"
//         />
//         <input
//           type="password"
//           placeholder="סיסמה"
//           value={user.password}
//           onChange={(e) => setUser({ ...user, password: e.target.value })}
//           className="border w-full mb-4 p-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-700 text-white w-full p-2 rounded hover:bg-blue-800"
//         >
//           התחברי
//         </button>
//       </form>
//     </div>
//   );
// }
import { useState } from "react";

export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", user);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-80 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">התחברות</h2>
        <input
          type="text"
          placeholder="שם משתמש"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="border w-full mb-4 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border w-full mb-6 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white w-full py-2 rounded-lg hover:bg-blue-800 transition-all shadow-md"
        >
          התחברי
        </button>
      </form>
    </div>
  );
}
