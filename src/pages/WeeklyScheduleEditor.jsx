import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomsThunk } from '../redux/slices/ROOMS/getRoomsThunk';
import { getClassesThunk } from '../redux/slices/CLASSES/getClassesThunk';
import { getweeklySchedulesThunk } from '../redux/slices/SCHEDULE/getScheduleThunk';
import { addWeeklyLessonThunk } from '../redux/slices/SCHEDULE/addSchedulThunk';
import { deleteWeeklyLessonThunk } from '../redux/slices/SCHEDULE/deleteWeeklyLessonThunk';
import { Plus, Clock, School, User } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, Menu, MenuItem } from '@mui/material';
import { addTopicThunk } from '../redux/slices/TOPIC/addTopicThunk';
import { getTopicsByCourseThunk } from '../redux/slices/TOPIC/getTopicsByCourseThunk';
import { getTopicsThunk } from '../redux/slices/TOPIC/getTopicsThunk';
import { updateWeeklyLessonThunk } from '../redux/slices/SCHEDULE/updateWeeklyLessonThunk';

const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

export default function WeeklyScheduleEditor() {
  const dispatch = useDispatch();
  const classes = useSelector(state => state.classes?.data || []);
  const rooms = useSelector(state => state.rooms?.data || []);
  const schedule = useSelector(state => state.weekly_schedule?.data ?? []);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedClassId, setSelectedClassId] = useState('kodesh');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const selectedClass = classes.find(c => String(c.id) === String(selectedClassId));
  const [course_id,setCourse_id] =useState(19);
  const teachers = useSelector(state => state.topics?.byCourse[course_id] || []);

  const updateCourseByClassId = (classId) => {
    if (!classId) return;
    const cls = classes.find(c => String(c.id) === String(classId));
    if (cls?.course_id) {
      setCourse_id(cls.course_id);
      dispatch(getTopicsByCourseThunk(cls.course_id));
    }
  };

  const updateCourseForKodesh = () => {
    setCourse_id(19);
    dispatch(getTopicsByCourseThunk(19));
  };


  useEffect(() => {
    dispatch(getRoomsThunk());
    dispatch(getClassesThunk());
    dispatch(getweeklySchedulesThunk());
  }, [dispatch]);

  //קבלת רשימת המורות המתאימות לכיתה שנבחרה
  useEffect(()=>{
    if (!selectedClassId || selectedClassId === 'kodesh') return;
    updateCourseByClassId(selectedClassId);
  },[selectedClassId, classes, dispatch])

  useEffect(() => {
    if (selectedClassId === 'kodesh') {
      updateCourseForKodesh();
    }
  }, [selectedClassId, dispatch])

  const filteredSchedule = schedule.filter(lesson => {
    if (selectedClassId === 'kodesh') return lesson.year === selectedYear;
    return lesson.class_id?.toString() === selectedClassId && lesson.year === selectedYear;
  });

  const openModal = (day, class_id, options = {}) => {
    if (selectedClassId === 'kodesh') {
      updateCourseForKodesh();
    } else {
      updateCourseByClassId(class_id);
    }
    setModalData({
      id: undefined,
      day_of_week: day,
      class_id,
      start_time: '',
      end_time: '',
      topic_id: '',
      teacher_name: '',
      room_id: '',
      group: 'all',
      isDayGroup: options.isDayGroup ?? false,
    });
    setModalOpen(true);
  };

  const getKodeshClasses = () => classes.filter(c => c.id >= 14 && c.id <= 22);

  const getGroupClassIds = (group) => {
    const kodeshClasses = getKodeshClasses();
    if (group === 'heh') return kodeshClasses.filter(c => c.name?.includes('ה')).map(c => c.id);
    if (group === 'vav') return kodeshClasses.filter(c => c.name?.includes('ו')).map(c => c.id);
    return kodeshClasses.map(c => c.id);
  };

  const saveLesson = () => {
    const { id, class_id, day_of_week, start_time, end_time, topic_id, room_id, group } = modalData;
    if (!day_of_week || !start_time || !end_time || !topic_id || !room_id) {
      alert('נא למלא את כל השדות');
      return;
    }

    const roomTaken = schedule.some(l =>
      l.day_of_week === day_of_week &&
      l.room_id === room_id &&
      l.year === selectedYear &&
      (id ? String(l.id) !== String(id) : true) &&
      ((start_time >= l.start_time && start_time < l.end_time) ||
        (end_time > l.start_time && end_time <= l.end_time))
    );
    if (roomTaken) {
      alert('⚠️ החדר כבר תפוס בזמן הזה');
      return;
    }

    const teacher = teachers.find(t => t.id === topic_id);
    const room = rooms.find(r => r.id === room_id);

    if (id) {
      const payload = {
        id: id ?? 0,
        class_id,
        day_of_week,
        start_time,
        end_time,
        topic_id,
        teacher_name: teacher?.name,
        room_id,
        year: selectedYear,
      };
      dispatch(updateWeeklyLessonThunk(payload));
    } else if (selectedClassId === 'kodesh') {
      const classIds = getGroupClassIds(group || 'all');
      if (!classIds.length) {
        alert('לא נמצאו כיתות לקבוצה שנבחרה');
        return;
      }
      classIds.forEach(cid => {
        const payload = {
          id: 0,
          class_id: cid,
          day_of_week,
          start_time,
          end_time,
          topic_id,
          teacher_name: teacher?.name,
          room_id,
          year: selectedYear,
        };
        dispatch(addWeeklyLessonThunk(payload));
      });
    } else {
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
    }
    setModalOpen(false);
  };

  const handleDeleteLesson = (lesson) => {
    if (!lesson?.id) {
      alert('לא ניתן למחוק שיעור ללא מזהה');
      return;
    }
    const confirmed = window.confirm('האם למחוק את השיעור?');
    if (!confirmed) return;
    dispatch(deleteWeeklyLessonThunk(lesson.id));
  };

  const handleOpenContextMenu = (event, lesson) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            lesson,
          }
        : null,
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleEditLesson = (lesson) => {
    if (!lesson) return;
    setModalData({
      id: lesson.id,
      day_of_week: lesson.day_of_week,
      class_id: lesson.class_id,
      start_time: formatTime(lesson.start_time),
      end_time: formatTime(lesson.end_time),
      topic_id: lesson.topic_id,
      teacher_name: lesson.teacher_name,
      room_id: lesson.room_id,
    });
    setModalOpen(true);
  };

  const handleAddTopic = (cid) => {
    let courseIdToUse = course_id;
    if (courseIdToUse === 19 && cid) {
      const cls = classes.find(c => String(c.id) === String(cid));
      if (cls?.course_id) {
        courseIdToUse = cls.course_id;
        setCourse_id(cls.course_id);
      }
    }
    if (!courseIdToUse) {
      alert('יש לבחור כיתה לפני הוספת נושא');
      return;
    }
    dispatch(addTopicThunk({ name: newTopicName, course_id: courseIdToUse }));
    dispatch(getTopicsByCourseThunk(courseIdToUse));
    setNewTopicName('');
    setNewTopicDialog(false);
  };

  //שיניתי לשימוש בטנק
  // const handleAddTopic = () => {
  //   fetch(`${import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL}/api/topics`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ name: newTopicName, course_id: 0 })
  //   }).then(() => {
  //     dispatch(getTeachersThunk());
  //     setNewTopicName('');
  //     setNewTopicDialog(false);
  //   });
  // };

    /**
   * פונקציה לעיצוב שעה - מסירה שניות מהתצוגה
   * @param {string} timeStr - שעה בפורמט HH:MM:SS או HH:MM
   * @returns {string} - שעה בפורמט HH:MM
   */
  const formatTime = (timeStr = "") => {
    return timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr;
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
      // const classNames = filteredClasses.map(c => c.name);
      const classNames = classIds.map(cid => {
  const cls = classes.find(c => c.id === cid);
  return cls ? cls.name : `כיתה ${cid}`;
});

      // const classIds = [...new Set(filteredSchedule.map(l => l.class_id))];
      // const classNames = classIds.map(cid => classes.find(c => c.id === cid)?.name || cid);

      return dayNames.map((name, i) => (
        <div key={i} className="mb-10" dir="rtl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-700">{name}</h2>
            <button
              onClick={() => openModal(i, null, { isDayGroup: true })}
              className="text-xs text-blue-600 hover:underline"
            >
              הוסף שיעור ליום זה
            </button>
          </div>
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
                        <div
                          key={idx}
                          className="mb-2 p-1 bg-gray-50 rounded border text-xs"
                          onContextMenu={(e) => handleOpenContextMenu(e, lesson)}
                          title="לחיצה ימנית לפעולות"
                        >
                          <div className="flex items-center gap-1"><Clock size={14} /> {formatTime(lesson.start_time)}-{formatTime(lesson.end_time)}</div>
                          {lesson.roomRef && (
                            <div className="flex items-center gap-2 text-sm">
                              <School size={16} />{lesson.roomRef.number}
                            </div>
                          )|| (
                            <div className="flex items-center gap-1 text-sm"><School size={14} />{rooms.find(r => r.id === lesson.room_id)?.number || 'חדר לא ידוע'}</div>
                          )}
                           {lesson.topicRef && (
                              <div className="flex items-center gap-2 text-sm"><User size={16} />{lesson.topicRef.name}</div>
                           ) || (
                             <div className="flex items-center gap-1"><User size={14} />{teachers.find(t => t.id === lesson.topic_id)?.name || 'מורה לא ידוע'}</div>
                           )}
                        </div>


                      ))}
                      {/* כפתור הוספת שיעור לכיתה זו ביום זה */}
                      <button
                        onClick={() => {
                          if (!cid) {
                            alert("לא ניתן להוסיף שיעור אם לא נבחרה כיתה"); return;
                          }
                          openModal(i, cid, { isDayGroup: false });
                        }}   className="mt-1 text-xs text-blue-600 hover:underline" >
                        הוסף שיעור לכיתה זו
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
                <div
                  key={idx}
                  className="border px-2 py-1 rounded mb-2 flex flex-col gap-1 bg-gray-50"
                  onContextMenu={(e) => handleOpenContextMenu(e, l)}
                  title="לחיצה ימנית לפעולות"
                >
                  <div className="flex items-center gap-2 text-sm"><Clock size={16} />{formatTime(l.start_time)}-{formatTime(l.end_time)}</div>
                  {/* <div className="flex items-center gap-2 text-sm"><School size={16} />{l.roomRef.number}</div> */}
                  {l.roomRef && (
                    <div className="flex items-center gap-2 text-sm">
                      <School size={16} />{l.roomRef.number}
                    </div>
                  )|| (
                    <div className="flex items-center gap-1 text-sm"><School size={14} />{rooms.find(r => r.id === l.room_id)?.number || 'חדר לא ידוע'}</div>
                  )}
                {l.topicRef && (
                  <div className="flex items-center gap-2 text-sm"><User size={16} />{l.topicRef.name}</div>
                )|| (
                  <div className="flex items-center gap-1 text-sm"><User size={14} />{teachers.find(t => t.id === l.topic_id)?.name || 'מורה לא ידוע'}</div>
                )}
                </div>
              ))}

              <button
                onClick={() => {
                  if (!selectedClassId) {
                    alert("לא ניתן להוסיף שיעור אם לא נבחרה כיתה");
                    return;
                  }
                  openModal(i, selectedClassId);
                }}
                className="mt-1 text-xs text-blue-600 hover:underline"
              >
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
        <DialogTitle>{modalData?.id ? 'עריכת שיעור' : 'הוספת שיעור'}</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField label="שעת התחלה" type="time" fullWidth value={modalData.start_time || ''} onChange={e => setModalData({ ...modalData, start_time: e.target.value })} />
          <TextField label="שעת סיום" type="time" fullWidth value={modalData.end_time || ''} onChange={e => setModalData({ ...modalData, end_time: e.target.value })} />
          {selectedClassId === 'kodesh' && !modalData?.id && modalData?.isDayGroup && (
            <Select
              fullWidth
              value={modalData.group || 'all'}
              onChange={e => setModalData({ ...modalData, group: e.target.value })}
              displayEmpty
            >
              <MenuItem value="all">כל הכיתות</MenuItem>
              <MenuItem value="heh">כיתות ה</MenuItem>
              <MenuItem value="vav">כיתות ו</MenuItem>
            </Select>
          )}
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

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleEditLesson(contextMenu?.lesson);
            handleCloseContextMenu();
          }}
        >
          עריכה
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteLesson(contextMenu?.lesson);
            handleCloseContextMenu();
          }}
        >
          מחיקה
        </MenuItem>
      </Menu>

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
