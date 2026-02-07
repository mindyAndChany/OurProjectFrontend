// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getTeachersThunk } from '../redux/slices/TEACHERS/getTeachersThunk';
// import { getRoomsThunk } from '../redux/slices/ROOMS/getRoomsThunk';
// import { getClassesThunk } from '../redux/slices/CLASSES/getClassesThunk';
// import { addWeeklyLessonThunk } from '../redux/slices/SCHEDULE/addSchedulThunk';

// export default function WeeklyScheduleEditor() {
//   const dispatch = useDispatch();
//   const classes = useSelector(state => state.classes?.data || []);
//   const teachers = useSelector(state => state.teacher?.data || []);
//   const rooms = useSelector(state => state.rooms?.data || []);

//   const [selectedClassId, setSelectedClassId] = useState('');
//   const [weekSchedule, setWeekSchedule] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({});
// const currentYear = new Date().getFullYear();
// const [selectedYear, setSelectedYear] = useState(currentYear);

//   useEffect(() => {
//     dispatch(getTeachersThunk());
//     dispatch(getRoomsThunk());
//     dispatch(getClassesThunk());
//   }, [dispatch]);

//   const openModal = (day) => {
//     console.log("📆 פתיחת מודל ליום:", day); // 0 = ראשון, 1 = שני וכו'

//     setModalData({
//       day_of_week: day,
//       class_id: selectedClassId,
//       start_time: '',
//       end_time: '',
//       topic_id: '',
//       topicRef: {},
//       teacher_name: '',
//       room_id: '',
//       roomRef: {},
//     });
//     setModalOpen(true);
//   };

//   const saveLesson = () => {
//     console.log("📤 נתונים לשמירה:", modalData);
//   if (
//     modalData.class_id==undefined ||
//     modalData.day_of_week==undefined ||
//     !modalData.start_time ||
//     !modalData.end_time ||
//     !modalData.topic_id ||
//     !modalData.room_id
//   ) {
//     alert('נא למלא את כל השדות החובה');
//     return;
//   }

//   const topic = teachers.find(t => Number(t.id) === Number(modalData.topic_id));
//   const room = rooms.find(r => Number(r.id) === Number(modalData.room_id));

//   if (!topic || !room) {
//     alert('מורה או חדר לא נמצאו');
//     return;
//   }

//   const payload = {
//     id: 0,
//     class_id:modalData.class_id,
//     day_of_week: modalData.day_of_week,
//     start_time: modalData.start_time,
//     end_time: modalData.end_time,
//     topic_id: topic.id,
//     // topicRef: { id: topic.id, name: topic.name },
//     teacher_name: topic.name,
//     room_id: room.id,
//     // roomRef: {
//     //   id: room.id,
//     //   name: room.name,
//     //   number: room.number,
//     //   is_computer_lab: room.is_computer_lab,
//     //   has_makren: room.has_makren,
//     //   floor: room.floor,
//     //   seat_count: room.seat_count,
//     //   is_available: room.is_available,
//     //   primary_use: room.primary_use,
//     // },
//      year: selectedYear,
//   };

//   console.log('📦 payload שנשלח:', payload);
//   dispatch(addWeeklyLessonThunk(payload));
//   setModalOpen(false);
// };


//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-indigo-800 mb-6">עריכת מערכת שבועית קבועה</h1>
//       <div className="mb-4">
//         <div className="mb-4">
//   <label className="font-semibold">בחר שנה:</label>
//   <select
//     className="border p-2 rounded ml-3"
//     value={selectedYear}
//     onChange={(e) => setSelectedYear(Number(e.target.value))}
//   >
//     {[2024, 2025, 2026, 2027].map((year) => (
//       <option key={year} value={year}>{year}</option>
//     ))}
//   </select>
// </div>

//         <label className="font-semibold">בחר כיתה:</label>
//         <select
//           className="border p-2 rounded ml-3"
//           value={selectedClassId}
//           onChange={(e) => setSelectedClassId(e.target.value)}
//         >
//           <option value="">בחר כיתה</option>
//           {classes.map(cls => (
//             <option key={cls.id} value={cls.id}>{cls.name}</option>
//           ))}
//         </select>
//       </div>

//       <div className="grid grid-cols-6 gap-4">
//         {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"].map((dayName, i) => (
//           <div key={i} className="border rounded-lg bg-white shadow p-4">
//             <div className="font-bold text-indigo-700 mb-2">{dayName}</div>
//             <button
//               className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
//               onClick={() => openModal(i)}
//             >
//               הוסף שיעור
//             </button>
//           </div>
//         ))}
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" dir="rtl">
//           <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl">
//             <h2 className="text-xl font-bold mb-4">הוספת שיעור ליום</h2>
//             <div className="grid grid-cols-2 gap-3">
//               <label className="flex flex-col">
//                 <span>שעת התחלה</span>
//                 <input type="time" value={modalData.start_time} onChange={(e) => setModalData({ ...modalData, start_time: e.target.value })} className="border rounded px-2 py-1" />
//               </label>
//               <label className="flex flex-col">
//                 <span>שעת סיום</span>
//                 <input type="time" value={modalData.end_time} onChange={(e) => setModalData({ ...modalData, end_time: e.target.value })} className="border rounded px-2 py-1" />
//               </label>
//               <label className="flex flex-col col-span-2">
//                 <span>נושא</span>
//                 <select value={modalData.topic_id} onChange={(e) => setModalData({ ...modalData, topic_id: Number(e.target.value) })}
// className="border rounded px-2 py-1">
//                   <option value="">בחר נושא</option>
//                   {teachers.map(t => (
//                     <option key={t.id} value={t.id}>{t.name}</option>
//                   ))}
//                 </select>
//               </label>
//               <label className="flex flex-col col-span-2">
//                 <span>חדר</span>
//                 <select value={modalData.room_id} onChange={(e) => setModalData({ ...modalData, room_id: Number(e.target.value) })} className="border rounded px-2 py-1">
//                   <option value="">בחר חדר</option>
//                   {rooms.map(r => (
//                     <option key={r.id} value={r.id}>{r.name} ({r.number})</option>
//                   ))}
//                 </select>
//               </label>
//             </div>
//             <div className="mt-5 flex gap-2">
//               <button onClick={saveLesson} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">שמור</button>
//               <button onClick={() => setModalOpen(false)} className="border px-4 py-2 rounded">ביטול</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeachersThunk } from '../redux/slices/TEACHERS/getTeachersThunk';
import { getRoomsThunk } from '../redux/slices/ROOMS/getRoomsThunk';
import { getClassesThunk } from '../redux/slices/CLASSES/getClassesThunk';
import { getweeklySchedulesThunk } from '../redux/slices/SCHEDULE/getScheduleThunk';
import { addWeeklyLessonThunk } from '../redux/slices/SCHEDULE/addSchedulThunk';
import { Plus, Clock, School, User } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';

const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

export default function WeeklyScheduleEditor() {
  const dispatch = useDispatch();
  const classes = useSelector(state => state.classes?.data || []);
  const teachers = useSelector(state => state.teacher?.data || []);
  const rooms = useSelector(state => state.rooms?.data || []);
  const schedule = useSelector(state => state.weekly_schedule?.data ?? []);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  useEffect(() => {
    dispatch(getTeachersThunk());
    dispatch(getRoomsThunk());
    dispatch(getClassesThunk());
    dispatch(getweeklySchedulesThunk());
  }, [dispatch]);

  const filteredSchedule = schedule.filter(lesson => {
    if (selectedClassId === 'kodesh') return lesson.year === selectedYear;
    return lesson.class_id?.toString() === selectedClassId && lesson.year === selectedYear;
  });

  const openModal = (day, class_id) => {
    setModalData({
      day_of_week: day,
      class_id,
      start_time: '',
      end_time: '',
      topic_id: '',
      teacher_name: '',
      room_id: '',
    });
    setModalOpen(true);
  };

  const saveLesson = () => {
    const { class_id, day_of_week, start_time, end_time, topic_id, room_id } = modalData;
    if (!class_id || !day_of_week || !start_time || !end_time || !topic_id || !room_id) {
      alert('נא למלא את כל השדות');
      return;
    }

    const roomTaken = schedule.some(l =>
      l.day_of_week === day_of_week &&
      l.room_id === room_id &&
      l.year === selectedYear &&
      ((start_time >= l.start_time && start_time < l.end_time) ||
        (end_time > l.start_time && end_time <= l.end_time))
    );
    if (roomTaken) {
      alert('⚠️ החדר כבר תפוס בזמן הזה');
      return;
    }

    const teacher = teachers.find(t => t.id === topic_id);
    const room = rooms.find(r => r.id === room_id);

    const payload = {
      id: 0,
      class_id,
      day_of_week,
      start_time,
      end_time,
      topic_id,
      teacher_name: teacher?.name,
      room_id,
      year: selectedYear,
    };

    dispatch(addWeeklyLessonThunk(payload));
    setModalOpen(false);
  };

  const handleAddTopic = () => {
    fetch('http://localhost:4000/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTopicName, course_id: 0 })
    }).then(() => {
      dispatch(getTeachersThunk());
      setNewTopicName('');
      setNewTopicDialog(false);
    });
  };

  const renderDayGrid = () => {
    if (selectedClassId === 'kodesh') {
      // לימודי קודש: טבלת יום מול כיתות (ללא שעות קבועות)
      const grouped = {};
      for (let d = 0; d < 6; d++) grouped[d] = {};
      filteredSchedule.forEach(l => {
        const day = l.day_of_week;
        if (!grouped[day][l.class_id]) grouped[day][l.class_id] = [];
        grouped[day][l.class_id].push(l);
      });
      const filteredClasses = classes.filter(c => c.id >= 14 && c.id <= 22);

      const classIds = filteredClasses.map(c => c.id);
      const classNames = filteredClasses.map(c => c.name);
      // const classIds = [...new Set(filteredSchedule.map(l => l.class_id))];
      // const classNames = classIds.map(cid => classes.find(c => c.id === cid)?.name || cid);

      return dayNames.map((name, i) => (
        <div key={i} className="mb-10" dir="rtl">
          <h2 className="text-xl font-bold text-gray-700 mb-2">{name}</h2>
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-center border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {classIds.map((cid, idx) => (
                    <th key={cid} className="border p-2" dir="rtl">{classNames[idx]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {classIds.map(cid => (
                    <td key={cid} className="border p-2 align-top">
                      {(grouped[i]?.[cid] || []).map((lesson, idx) => (
                        <div key={idx} className="mb-2 p-1 bg-gray-50 rounded border text-xs">
                          <div className="flex items-center gap-1"><Clock size={14} />{lesson.start_time}-{lesson.end_time}</div>
                          {lesson.roomRef && (
                            <div className="flex items-center gap-2 text-sm">
                              <School size={16} />{lesson.roomRef.number}
                            </div>
                          )}
                          <div className="flex items-center gap-1"><User size={14} />{lesson.topicRef.name}</div>
                        </div>


                      ))}
                      {/* כפתור הוספת שיעור לכיתה זו ביום זה */}
                      <button
                        onClick={() => openModal(i, cid)}
                        className="mt-1 text-xs text-blue-600 hover:underline"
                      >
                        הוסף שיעור
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ));
    } else {
      // רגיל לפי כיתה: ימים בשורה אחת
      return (
        <div className="grid grid-cols-6 gap-4" dir="rtl">
          {dayNames.map((name, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-2">{name}</h2>
              {filteredSchedule.filter(l => l.day_of_week === i).map((l, idx) => (
                <div key={idx} className="border px-2 py-1 rounded mb-2 flex flex-col gap-1 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm"><Clock size={16} />{l.start_time} - {l.end_time}</div>
                  {/* <div className="flex items-center gap-2 text-sm"><School size={16} />{l.roomRef.number}</div> */}
                  {l.roomRef && (
                    <div className="flex items-center gap-2 text-sm">
                      <School size={16} />{l.roomRef.number}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm"><User size={16} />{l.topicRef.name}</div>
                </div>
              ))}

              <button className="text-blue-600 hover:underline" onClick={() => openModal(i, selectedClassId)}>
                הוסף שיעור
              </button>
            </div>
          ))}
        </div>

      );
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#0A3960] mb-6">עריכת מערכת שבועית</h1>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">שנה</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">כיתה</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">בחר כיתה</option>
            <option value="kodesh">לימודי קודש</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      {renderDayGrid()}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>הוספת שיעור</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField label="שעת התחלה" type="time" fullWidth value={modalData.start_time || ''} onChange={e => setModalData({ ...modalData, start_time: e.target.value })} />
          <TextField label="שעת סיום" type="time" fullWidth value={modalData.end_time || ''} onChange={e => setModalData({ ...modalData, end_time: e.target.value })} />
          <Select fullWidth value={modalData.topic_id || ''} onChange={e => setModalData({ ...modalData, topic_id: e.target.value })} displayEmpty>
            <MenuItem value=""><em>בחר נושא</em></MenuItem>
            {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
            <MenuItem value="__new__" onClick={() => { setNewTopicDialog(true); setModalOpen(false); }}>+ נושא חדש</MenuItem>
          </Select>
          <Select fullWidth value={modalData.room_id || ''} onChange={e => setModalData({ ...modalData, room_id: e.target.value })} displayEmpty>
            <MenuItem value=""><em>בחר חדר</em></MenuItem>
            {rooms.map(r => <MenuItem key={r.id} value={r.id}>{r.number}</MenuItem>)}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>ביטול</Button>
          <Button onClick={saveLesson}>שמור</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newTopicDialog} onClose={() => setNewTopicDialog(false)}>
        <DialogTitle>הוספת נושא חדש</DialogTitle>
        <DialogContent>
          <TextField label="שם נושא" fullWidth value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTopicDialog(false)}>ביטול</Button>
          <Button onClick={handleAddTopic}>הוסף</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
