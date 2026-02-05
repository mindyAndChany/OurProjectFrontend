import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeachersThunk } from '../redux/slices/TEACHERS/getTeachersThunk';
import { getRoomsThunk } from '../redux/slices/ROOMS/getRoomsThunk';
import { getClassesThunk } from '../redux/slices/CLASSES/getClassesThunk';
import { addWeeklyLessonThunk } from '../redux/slices/SCHEDULE/addSchedulThunk';

export default function WeeklyScheduleEditor() {
  const dispatch = useDispatch();
  const classes = useSelector(state => state.classes?.data || []);
  const teachers = useSelector(state => state.teacher?.data || []);
  const rooms = useSelector(state => state.rooms?.data || []);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [weekSchedule, setWeekSchedule] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
const currentYear = new Date().getFullYear();
const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    dispatch(getTeachersThunk());
    dispatch(getRoomsThunk());
    dispatch(getClassesThunk());
  }, [dispatch]);

  const openModal = (day) => {
    console.log("📆 פתיחת מודל ליום:", day); // 0 = ראשון, 1 = שני וכו'

    setModalData({
      day_of_week: day,
      class_id: selectedClassId,
      start_time: '',
      end_time: '',
      topic_id: '',
      topicRef: {},
      teacher_name: '',
      room_id: '',
      roomRef: {},
    });
    setModalOpen(true);
  };

  const saveLesson = () => {
    console.log("📤 נתונים לשמירה:", modalData);
  if (
    modalData.class_id==undefined ||
    modalData.day_of_week==undefined ||
    !modalData.start_time ||
    !modalData.end_time ||
    !modalData.topic_id ||
    !modalData.room_id
  ) {
    alert('נא למלא את כל השדות החובה');
    return;
  }

  const topic = teachers.find(t => Number(t.id) === Number(modalData.topic_id));
  const room = rooms.find(r => Number(r.id) === Number(modalData.room_id));

  if (!topic || !room) {
    alert('מורה או חדר לא נמצאו');
    return;
  }

  const payload = {
    id: 0,
    class_id:modalData.class_id,
    day_of_week: modalData.day_of_week,
    start_time: modalData.start_time,
    end_time: modalData.end_time,
    topic_id: topic.id,
    // topicRef: { id: topic.id, name: topic.name },
    teacher_name: topic.name,
    room_id: room.id,
    // roomRef: {
    //   id: room.id,
    //   name: room.name,
    //   number: room.number,
    //   is_computer_lab: room.is_computer_lab,
    //   has_makren: room.has_makren,
    //   floor: room.floor,
    //   seat_count: room.seat_count,
    //   is_available: room.is_available,
    //   primary_use: room.primary_use,
    // },
     year: selectedYear,
  };

  console.log('📦 payload שנשלח:', payload);
  dispatch(addWeeklyLessonThunk(payload));
  setModalOpen(false);
};


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">עריכת מערכת שבועית קבועה</h1>
      <div className="mb-4">
        <div className="mb-4">
  <label className="font-semibold">בחר שנה:</label>
  <select
    className="border p-2 rounded ml-3"
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e.target.value))}
  >
    {[2024, 2025, 2026, 2027].map((year) => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
</div>

        <label className="font-semibold">בחר כיתה:</label>
        <select
          className="border p-2 rounded ml-3"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="">בחר כיתה</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"].map((dayName, i) => (
          <div key={i} className="border rounded-lg bg-white shadow p-4">
            <div className="font-bold text-indigo-700 mb-2">{dayName}</div>
            <button
              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
              onClick={() => openModal(i)}
            >
              הוסף שיעור
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">הוספת שיעור ליום</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span>שעת התחלה</span>
                <input type="time" value={modalData.start_time} onChange={(e) => setModalData({ ...modalData, start_time: e.target.value })} className="border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col">
                <span>שעת סיום</span>
                <input type="time" value={modalData.end_time} onChange={(e) => setModalData({ ...modalData, end_time: e.target.value })} className="border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col col-span-2">
                <span>נושא</span>
                <select value={modalData.topic_id} onChange={(e) => setModalData({ ...modalData, topic_id: Number(e.target.value) })}
className="border rounded px-2 py-1">
                  <option value="">בחר נושא</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col col-span-2">
                <span>חדר</span>
                <select value={modalData.room_id} onChange={(e) => setModalData({ ...modalData, room_id: Number(e.target.value) })} className="border rounded px-2 py-1">
                  <option value="">בחר חדר</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.number})</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={saveLesson} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">שמור</button>
              <button onClick={() => setModalOpen(false)} className="border px-4 py-2 rounded">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
