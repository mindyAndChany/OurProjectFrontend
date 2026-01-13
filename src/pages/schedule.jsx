import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import heLocale from 'date-fns/locale/he';
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";

export default function ScheduleViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const lessons = useSelector((state) => state.lessons.data);
  const schedule = useSelector((state) => state.weekly_schedule.data);
  const classes = useSelector((state) => state.classes.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClassesThunk());
  }, [dispatch]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const getDailyLessons = (date) => {
    const dayOfWeek = date.getDay();
    const dateStr = format(date, "yyyy-MM-dd");

    const realLessons = lessons.filter((l) => l.date === dateStr);

    if (realLessons.length > 0) return realLessons;

    return schedule.filter((s) => s.day_of_week === dayOfWeek);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-right">
      <h2 className="text-3xl font-bold mb-6">מערכת שבועית</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          className="border rounded p-2"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => setSelectedDate(parseISO(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="border rounded-xl shadow p-4 bg-white"
          >
            <h3 className="font-bold text-xl mb-2">
              {format(day, "EEEE dd/MM/yyyy", { locale: heLocale })}
            </h3>

            <ul className="space-y-2">
              {getDailyLessons(day).map((lesson, i) => (
                <li
                  key={i}
                  className="p-3 border rounded-lg bg-gray-50 flex flex-col"
                >
                  <span className="font-semibold">{lesson.topic}</span>
                  <span>כיתה: {getClassName(lesson.class_id)}</span>
                  <span>
                    {lesson.start_time} - {lesson.end_time}
                  </span>
                  <span>מורה: {lesson.teacher_name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  function getClassName(classId) {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "כיתה לא ידועה";
  }
}
