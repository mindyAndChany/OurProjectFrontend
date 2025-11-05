// export default function Home() {
//   return (
//     <div className="text-center">
//       <h2 className="text-2xl font-semibold mb-4">ברוכה הבאה למערכת הניהול</h2>
//       <p>כאן יופיעו ניתובים בעתיד לעמודי תלמידות, נוכחות, לוח שנה והשאלת ציוד.</p>
//     </div>
//   );
// }
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <h2 className="text-3xl font-semibold text-blue-700">ברוכה הבאה למערכת הניהול</h2>
      <p className="text-gray-700 max-w-md">
        כאן יופיעו ניתובים בעתיד לעמודי תלמידות, נוכחות, לוח שנה והשאלת ציוד.
      </p>
      <div className="w-32 h-1 bg-blue-600 rounded-full"></div>
    </div>
  );
}
