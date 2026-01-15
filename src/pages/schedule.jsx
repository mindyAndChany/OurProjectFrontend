import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import heLocale from 'date-fns/locale/he';
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getweeklySchedulesThunk } from "../redux/slices/SCHEDULE/getScheduleThunk";
import { addRealyLessonThunk } from "../redux/slices/LESSONS/addRealyLessonThunk";

/**
 * קומפוננטת מערכת שבועית - מציגה את לוח השעות של כל הכיתות או כיתה ספציפית
 * התצוגה משתנה בהתאם לבחירת המשתמש:
 * - כל הכיתות: תצוגת אקסל עם טבלה נפרדת לכל יום
 * - כיתה ספציפית: טבלה שבועית מפורטת עם כל השיעורים
 */
export default function ScheduleViewer() {
  // State: תאריך נבחר ומזהה כיתה נבחרת
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClassId, setSelectedClassId] = useState("kodesh"); // "kodesh" = לימודי קודש
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLesson, setModalLesson] = useState(null);
  const [modalCancelled, setModalCancelled] = useState(false);
  const [modalReason, setModalReason] = useState("");

  // קבלת נתונים מה-Redux store
  const lessons = useSelector((state) => state.lessons?.data ?? []); // שיעורים ספציפיים לתאריך
  const schedule = useSelector((state) => state.weekly_schedule?.data ?? []); // מערכת שבועית קבועה
  const classes = useSelector((state) => state.classes?.data ?? []); // רשימת כיתות
  const dispatch = useDispatch();

  // טעינת נתוני כיתות ומערכת בעת טעינת הקומפוננטה
  useEffect(() => {
    dispatch(getClassesThunk());
    dispatch(getweeklySchedulesThunk());
  }, [dispatch]);

  // פתיחת מודל לאישור/ביטול שיעור
  const openLessonModal = (lesson, date, classIdOverride) => {
    const classId = classIdOverride ?? lesson.class_id;
    const payload = {
      id: 0,
      class_id: classId,
      date: format(date, "yyyy-MM-dd"),
      start_time: lesson.start_time || "",
      end_time: lesson.end_time || "",
      topic: lesson.topic || "",
      teacher_name: lesson.teacher_name || "",
      is_cancelled: false,
      cancellation_reason: "",
    };
    setModalLesson(payload);
    setModalCancelled(false);
    setModalReason("");
    setModalOpen(true);
  };

  const closeLessonModal = () => {
    setModalOpen(false);
    setModalLesson(null);
    setModalCancelled(false);
    setModalReason("");
  };

  const confirmLessonModal = () => {
    if (!modalLesson) return;
    const finalPayload = {
      ...modalLesson,
      is_cancelled: modalCancelled,
      cancellation_reason: modalCancelled ? (modalReason || "התקבל ביטול ללא סיבה") : "",
    };
    dispatch(addRealyLessonThunk(finalPayload));
    closeLessonModal();
  };

  // יצירת מערך של 6 ימים (ראשון עד שישי, ללא שבת)
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 6 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  /**
   * פונקציה לעיצוב שעה - מסירה שניות מהתצוגה
   * @param {string} timeStr - שעה בפורמט HH:MM:SS או HH:MM
   * @returns {string} - שעה בפורמט HH:MM
   */
  const formatTime = (timeStr = "") => {
    return timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr;
  };

  /**
   * פונקציה לקבלת כל השיעורים ליום מסוים
   * תחילה מחפשת שיעורים ספציפיים לתאריך, אם אין - מחזירה מהמערכת הקבועה
   * @param {Date} date - התאריך המבוקש
   * @returns {Array} - מערך שיעורים
   */
  const getDailyLessons = (date) => {
    const dayOfWeek = date.getDay();
    const dateStr = format(date, "yyyy-MM-dd");

    // חיפוש שיעורים ספציפיים לתאריך זה
    const realLessons = lessons.filter((l) => l.date === dateStr);
    const filteredByClass = selectedClassId
      ? realLessons.filter((l) => String(l.class_id) === String(selectedClassId))
      : realLessons;

    // אם יש שיעורים ספציפיים - מחזירים אותם
    if (filteredByClass.length > 0) return filteredByClass;

    // אחרת - מחזירים מהמערכת השבועית הקבועה
    const weeklyByDay = schedule.filter((s) => s.day_of_week === dayOfWeek);
    return selectedClassId
      ? weeklyByDay.filter((s) => String(s.class_id) === String(selectedClassId))
      : weeklyByDay;
  };

  /**
   * פונקציה לאיסוף כל שעות השיעורים בשבוע (למיון השורות בטבלה)
   * @returns {Array} - מערך ממוין של שעות התחלה
   */
  const getAllTimes = useMemo(() => {
    const times = new Set();
    
    weekDays.forEach((day) => {
      getDailyLessons(day).forEach((lesson) => {
        if (lesson.start_time) times.add(lesson.start_time);
      });
    });

    return Array.from(times).sort();
  }, [weekDays, schedule, lessons, selectedClassId]);

  /**
   * פונקציה לקבלת כל השיעורים בשעה מסוימת ביום מסוים
   * (שימושי כאשר יש כמה כיתות באותה שעה)
   * @param {Date} date - התאריך
   * @param {string} time - שעת ההתחלה
   * @returns {Array} - מערך שיעורים
   */
  const getLessonsAtTime = (date, time) => {
    return getDailyLessons(date).filter((lesson) => lesson.start_time === time);
  };

  // שמות הימים בעברית
  const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];

  /**
   * פונקציה לקבלת שם כיתה לפי מזהה
   * @param {number} classId - מזהה הכיתה
   * @returns {string} - שם הכיתה
   */
  const getClassName = (classId) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "לא ידוע";
  };

  /**
   * פונקציה לקבלת שיעור ספציפי לפי כיתה, יום ושעה
   * (שימוש בתצוגת האקסל)
   * @param {number} classId - מזהה הכיתה
   * @param {number} dayOfWeek - יום בשבוע (0-6)
   * @param {string} time - שעת התחלה
   * @returns {Object|null} - אובייקט שיעור או null
   */
  const getLessonForClassAndTime = (classId, dayOfWeek, time) => {
    const dayLessons = schedule.filter(
      (s) => s.day_of_week === dayOfWeek && s.class_id === classId && s.start_time === time
    );
    return dayLessons[0] || null;
  };

  // סינון כיתות לימודי קודש (14-22)
  const kodeshClasses = useMemo(() => {
    return classes.filter((cls) => cls.id >= 14 && cls.id <= 22);
  }, [classes]);

  /**
   * תצוגה 1: לימודי קודש - סגנון אקסל
   * כאשר נבחר "לימודי קודש", מציגים טבלה נפרדת לכל יום עם כיתות 14-22
   * כל טבלה מכילה את כיתות לימודי קודש בעמודות ואת השעות בשורות
   */
  if (selectedClassId === "kodesh") {
    return (
      <div className="min-h-screen px-6 py-10 text-right bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-full mx-auto">
          {/* כותרת וסרגל בקרה */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">מערכת לימודי קודש שנתי/תש״פ</h2>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* בחירת תאריך */}
              <label className="text-lg font-semibold text-gray-700">בחר תאריך:</label>
              <input
                type="date"
                className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(parseISO(e.target.value))}
              />
              <span className="text-lg text-gray-600 ml-4">
                {format(weekDays[0], "dd/MM")} - {format(weekDays[5], "dd/MM/yyyy")}
              </span>

              {/* בחירת כיתה */}
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-lg font-semibold text-gray-700">בחר כיתה:</label>
                <select
                  className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition min-w-48"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  <option value="kodesh">לימודי קודש</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* לולאה על כל ימי השבוע - טבלה נפרדת לכל יום */}
          <div className="space-y-8">
            {weekDays.map((day) => {
              const dayOfWeek = day.getDay();
              // סינון שיעורים רק ליום זה ורק לכיתות לימודי קודש (14-22)
              const daySchedule = schedule.filter(
                (s) => s.day_of_week === dayOfWeek && s.class_id >= 14 && s.class_id <= 22
              );
              // איסוף כל השעות ביום זה (ללא כפילויות)
              const times = [...new Set(daySchedule.map((s) => s.start_time))].sort();

              // אם אין שיעורים ביום זה - דלג עליו
              if (times.length === 0) return null;

              return (
                <div key={day.toISOString()} className="bg-white rounded-xl shadow-lg p-6">
                  {/* כותרת יום */}
                  <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-indigo-700">
                      {dayNames[dayOfWeek]} - {format(day, "dd/MM/yyyy")}
                    </h3>
                    {/* תגית מיוחדת לימי ראשון ורביעי */}
                    {[0, 3].includes(dayOfWeek) && (
                      <span className="text-sm font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                        {dayOfWeek === 0 ? "לימודי הוראה" : "לימודי התמחות"}
                      </span>
                    )}
                  </div>

                  {/* טבלת היום: עמודות = כיתות, שורות = שעות */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-indigo-600">
                          <th className="border border-gray-300 p-2 text-white font-bold w-20">שעה</th>
                          {/* עמודה לכל כיתת לימודי קודש */}
                          {kodeshClasses.map((cls) => (
                            <th
                              key={cls.id}
                              className="border border-gray-300 p-2 text-white font-semibold min-w-32"
                            >
                              {cls.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* שורה לכל שעה */}
                        {times.map((time, idx) => (
                          <tr key={time} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 p-2 text-center font-semibold text-gray-700 bg-gray-100">
                              {formatTime(time)}
                            </td>
                            {/* תא לכל כיתת לימודי קודש בשעה זו */}
                            {kodeshClasses.map((cls) => {
                              const lesson = getLessonForClassAndTime(cls.id, dayOfWeek, time);
                              return (
                                <td
                                  key={cls.id}
                                  className="border border-gray-300 p-2 text-center align-middle"
                                >
                                  {lesson ? (
                                    <div
                                      className="text-gray-800 font-medium cursor-pointer hover:text-indigo-700"
                                      onClick={() => openLessonModal(lesson, day, cls.id)}
                                      title="לחץ לאישור/ביטול שיעור"
                                    >
                                      {lesson.topic || "-"}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-sm italic">לימודי התמחות</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /**
   * תצוגה 2: כיתה ספציפית - טבלה שבועית מפורטת
   * כאשר נבחרה כיתה, מציגים טבלה אחת עם כל ימי השבוע כעמודות
   */
  return (
    <div className="min-h-screen px-6 py-10 text-right bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* כותרת וסרגל בקרה */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">מערכת שבועית</h2>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* בחירת תאריך */}
            <label className="text-lg font-semibold text-gray-700">בחר תאריך:</label>
            <input
              type="date"
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(parseISO(e.target.value))}
            />
            <span className="text-lg text-gray-600 ml-4">
              {format(weekDays[0], "dd/MM")} - {format(weekDays[5], "dd/MM/yyyy")}
            </span>

            {/* בחירת כיתה */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-lg font-semibold text-gray-700">בחר כיתה:</label>
              <select
                className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition min-w-48"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="kodesh">לימודי קודש</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* טבלת מערכת שבועית */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full border-collapse">
            {/* כותרת טבלה - ימי השבוע */}
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700">
                <th className="border border-gray-300 p-4 text-white text-sm font-bold w-24">שעה</th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className="border border-gray-300 p-4 text-white font-bold min-w-44"
                  >
                    <div className="text-lg">{dayNames[day.getDay()]}</div>
                    <div className="text-sm font-normal">
                      {format(day, "dd/MM/yyyy", { locale: heLocale })}
                    </div>
                    {/* תגית מיוחדת לימי ראשון ורביעי */}
                    {[0, 3].includes(day.getDay()) && (
                      <div className="mt-1 text-xs font-semibold text-indigo-100">
                        {day.getDay() === 0 ? "לימודי הוראה" : "לימודי התמחות"}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* גוף הטבלה - שורות לפי שעות */}
            <tbody>
              {getAllTimes.length > 0 ? (
                getAllTimes.map((time, idx) => (
                  <tr
                    key={time}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    {/* עמודת השעה */}
                    <td className="border border-gray-300 p-4 font-semibold text-center bg-gray-100 text-gray-700">
                      {formatTime(time)}
                    </td>
                    {/* תא לכל יום */}
                    {weekDays.map((day) => {
                      const lessonsAtSlot = getLessonsAtTime(day, time);
                      return (
                        <td
                          key={`${day.toISOString()}-${time}`}
                          className="border border-gray-300 p-4 align-top"
                        >
                          {lessonsAtSlot.length > 0 ? (
                            <div className="space-y-3">
                              {/* כרטיס לכל שיעור (יכול להיות יותר משיעור אחד באותה שעה) */}
                              {lessonsAtSlot.map((lesson) => (
                                <div
                                  key={`${lesson.id ?? lesson.class_id}-${time}`}
                                  className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                                  onClick={() => openLessonModal(lesson, day)}
                                  title="לחץ לאישור/ביטול שיעור"
                                >
                                  {/* שורת כותרת: שם כיתה + טווח שעות */}
                                  <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                                    {/* <span className="font-semibold">{getClassName(lesson.class_id)}</span> */}
                                    <span>{formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}</span>
                                  </div>
                                  {/* נושא השיעור */}
                                  <div className="font-bold text-indigo-900 text-sm">
                                    {lesson.topic || "ללא נושא"}
                                  </div>
                                  {/* שם המורה (אם קיים) */}
                                  {lesson.teacher_name && (
                                    <div className="text-xs text-gray-700 mt-1">
                                      <span className="font-semibold">מורה:</span> {lesson.teacher_name}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-300 text-center text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                // הודעה אם אין שיעורים
                <tr>
                  <td colSpan={7} className="border border-gray-300 p-8 text-center text-gray-500">
                    אין שיעורים בשבוע זה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* מודל אישור/ביטול שיעור */}
        {modalOpen && modalLesson && (
          <div
            className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-4"
            dir="rtl"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                confirmLessonModal();
              }
            }}
          >
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">אישור שיעור לתאריך נבחר</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div><span className="font-semibold">כיתה:</span> {getClassName(Number(modalLesson.class_id))}</div>
                <div><span className="font-semibold">תאריך:</span> {modalLesson.date}</div>
                <div><span className="font-semibold">שעה:</span> {formatTime(modalLesson.start_time)} - {formatTime(modalLesson.end_time)}</div>
                <div><span className="font-semibold">נושא:</span> {modalLesson.topic || 'ללא נושא'}</div>
                {modalLesson.teacher_name && (
                  <div><span className="font-semibold">מורה:</span> {modalLesson.teacher_name}</div>
                )}
              </div>

              <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-110"
                    checked={modalCancelled}
                    onChange={(e) => setModalCancelled(e.target.checked)}
                  />
                  <span className="font-semibold">סמן אם השיעור מבוטל</span>
                </label>
                {modalCancelled && (
                  <textarea
                    className="mt-3 w-full border rounded px-3 py-2"
                    rows={3}
                    placeholder="סיבת ביטול (חובה)"
                    value={modalReason}
                    onChange={(e) => setModalReason(e.target.value)}
                  />
                )}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={confirmLessonModal}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  אשר (ENTER)
                </button>
                <button
                  onClick={closeLessonModal}
                  className="border px-4 py-2 rounded"
                >
                  סגור
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">בברירת מחדל (ENTER) השיעור מאושר לתאריך זה.</div>
            </div>
          </div>
        )}

        {/* הערה תחתונה */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow border-l-4 border-indigo-600">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">הערה:</span> הטבלה מציגה את כל השיעורים מלוח השעות השבועי, כולל עדכונים והשיעורים הנוכחיים.
          </p>
        </div>
      </div>
    </div>
  );
}
