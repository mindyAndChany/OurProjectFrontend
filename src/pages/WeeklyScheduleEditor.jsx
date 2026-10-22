import React, { useEffect, useState, useMemo } from 'react';
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
import { CURRENT_YEAR, SCHOOL_YEARS } from '../utils/constants';

const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

/**
 * פונקציה לעיצוב שעה - מסירה שניות מהתצוגה
 * @param {string} timeStr - שעה בפורמט HH:MM:SS או HH:MM
 * @returns {string} - שעה בפורמט HH:MM
 */
const formatTime = (timeStr = "") => {
  const str = String(timeStr ?? "");
  return str.length >= 5 ? str.slice(0, 5) : str;
};

// המרת שעה לדקות — להשוואה מספרית (עובד גם עם HH:MM:SS)
const toMinutes = (timeStr = "") => {
  const [h = 0, m = 0] = String(timeStr).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

// מיון לפי שעת התחלה, מהמוקדם למאוחר
const byStartTime = (a, b) => toMinutes(a?.start_time) - toMinutes(b?.start_time);

export default function WeeklyScheduleEditor() {
  const dispatch = useDispatch();
  const classes = useSelector(state => state.classes?.data || []);
  const rooms = useSelector(state => state.rooms?.data || []);
  const schedule = useSelector(state => state.weekly_schedule?.data ?? []);
  const courses = useSelector(state => state.courses?.data || []);

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  // תחום: קודש/הוראה/התמחויות
  const [selectedDomain, setSelectedDomain] = useState('kodesh');
  // ברירת מחדל: קודש, אחרת אין כיתה נבחרת (כללי לתחום)
  const [selectedClassId, setSelectedClassId] = useState('kodesh');
  // סינון שנה עבור התמחויות
  const [selectedYearLevel, setSelectedYearLevel] = useState('all'); // 'all' | 'a' | 'b'
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  // מחיקה מרובה: בחירת שיעורים (מזהי שורות) + מצב בחירה
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // קורסים לפי תחום
  const getDomainKey = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('kodesh')) return 'kodesh';
    if (t.includes('hitmachuyot') || t.includes('hitmahut')) return 'hitmachuyot';
    if (t.includes('horaah') || t.includes('horaa')) return 'horaah';
    return t;
  };

  const domainCourseIds = useMemo(() => {
    if (!selectedDomain) return new Set();
    return new Set(
      (courses || [])
        .filter((c) => getDomainKey(c?.type) === selectedDomain)
        .map((c) => String(c.id))
    );
  }, [courses, selectedDomain]);

  // כיתות מסוננות לפי תחום + שנה (רק בהתמחויות)
  // טווח הכיתות של לימודי קודש — מקור אמת יחיד לכל התצוגות
  const KODESH_CLASS_MIN = 14;
  const KODESH_CLASS_MAX = 22;
  const getKodeshClasses = () =>
    (classes || []).filter((c) => Number(c.id) >= KODESH_CLASS_MIN && Number(c.id) <= KODESH_CLASS_MAX);

  const filteredClasses = useMemo(() => {
    if (!selectedDomain) return [];
    // קודש: אותה רשימה שהטבלה מציגה, כדי שהבורר והתצוגה לא ייפרדו
    if (selectedDomain === 'kodesh') return getKodeshClasses();
    if (domainCourseIds.size === 0) return [];
    let filtered = (classes || []).filter((cls) => domainCourseIds.has(String(cls.course_id ?? cls.courseId)));
    if (selectedDomain === 'hitmachuyot' && selectedYearLevel !== 'all') {
      // נניח שיש שדה year_level או name שמכיל "א" או "ב"
      filtered = filtered.filter(cls => {
        if (!cls.name) return false;
        if (selectedYearLevel === 'a') return /\b[אa]\b|שנה.?א/i.test(cls.name);
        if (selectedYearLevel === 'b') return /\b[בb]\b|שנה.?ב/i.test(cls.name);
        return true;
      });
    }
    return filtered;
  }, [classes, domainCourseIds, selectedDomain, selectedYearLevel]);

  // מורים/נושאים מסוננים לפי תחום
  const [course_id, setCourse_id] = useState(19);
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

  // עדכון קורס ברירת מחדל לפי תחום
  useEffect(() => {
    if (selectedDomain === 'kodesh') {
      setCourse_id(19);
      dispatch(getTopicsByCourseThunk(19));
      setSelectedClassId('kodesh');
    } else {
      // אין כיתה נבחרת כברירת מחדל, מציגים מערכת כללית לתחום
      setSelectedClassId('');
      // קח קורס ראשון בתחום זה (אם יש)
      const firstCourse = courses.find(c => getDomainKey(c?.type) === selectedDomain);
      if (firstCourse) {
        setCourse_id(firstCourse.id);
        dispatch(getTopicsByCourseThunk(firstCourse.id));
      }
    }
  }, [selectedDomain, courses, dispatch]);



  useEffect(() => {
    dispatch(getRoomsThunk());
    dispatch(getClassesThunk());
    dispatch(getweeklySchedulesThunk());
    dispatch({ type: 'courses/getCoursesThunk' });
  }, [dispatch]);

  //קבלת רשימת המורות המתאימות לכיתה שנבחרה

  useEffect(() => {
    if (!selectedClassId || selectedClassId === 'kodesh') return;
    updateCourseByClassId(selectedClassId);
  }, [selectedClassId, classes, dispatch]);


  useEffect(() => {
    if (selectedClassId === 'kodesh') {
      updateCourseForKodesh();
    }
  }, [selectedClassId, dispatch]);


  const toggleSelected = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleLessonIds.forEach((id) => next.delete(id));
      } else {
        visibleLessonIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  // מחיקה מרובה — בקשה אחת לכל מזהה, במקביל; מדווח רק על מה שנכשל בפועל
  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    if (!window.confirm(`האם למחוק ${ids.length} שיעורים? הפעולה אינה ניתנת לביטול.`)) return;

    const result = await dispatch(deleteWeeklyLessonThunk(ids));
    if (deleteWeeklyLessonThunk.fulfilled.match(result)) {
      const { failedIds } = result.payload;
      if (failedIds.length > 0) {
        alert(`נמחקו ${result.payload.deletedIds.length} שיעורים, ${failedIds.length} לא נמחקו. נסי לרענן ולמחוק שוב.`);
      }
      exitSelectionMode();
    } else {
      alert('המחיקה נכשלה. בדקי את החיבור לשרת ונסי שוב.');
    }
  };

  // מערכת מסוננת לפי תחום/כיתה
  const filteredSchedule = useMemo(() => {
    if (selectedClassId === 'kodesh') return schedule.filter(lesson => lesson.year === selectedYear);
    if (!selectedClassId) {
      // כל הכיתות בתחום
      return schedule.filter(lesson => lesson.year === selectedYear && domainCourseIds.has(String(classes.find(c => c.id === lesson.class_id)?.course_id)));
    }
    return schedule.filter(lesson => lesson.class_id?.toString() === selectedClassId && lesson.year === selectedYear);
  }, [schedule, selectedClassId, selectedYear, domainCourseIds, classes]);

  // השורות הנראות כרגע במסך (אחרי סינון תחום/כיתה/שנה) — לחירה במצב בחירה
  // מוגדר אחרי filteredSchedule — אין להעביר אותו למעלה
  const visibleLessons = useMemo(
    () => filteredSchedule.filter((l) => l.id !== undefined && l.id !== null),
    [filteredSchedule]
  );
  const visibleLessonIds = useMemo(() => visibleLessons.map((l) => l.id), [visibleLessons]);

  // שיעורים ממוינים לפי שעת התחלה — עבור "רגיל לפי כיתה"
  const scheduleByDay = useMemo(() => {
    const grouped = dayNames.map(() => []);
    filteredSchedule.forEach((l) => {
      if (l.day_of_week >= 0 && l.day_of_week < dayNames.length) grouped[l.day_of_week].push(l);
    });
    return grouped.map((lessons) => [...lessons].sort(byStartTime));
  }, [filteredSchedule]);

  // שיעורים ממוינים לפי שעת התחלה — עבור טבלאות יום מול כיתות (תחום / לימודי קודש)
  const groupedByDayAndClass = useMemo(() => {
    const grouped = dayNames.map(() => ({}));
    filteredSchedule.forEach((l) => {
      const day = l.day_of_week;
      if (!(day >= 0 && day < dayNames.length)) return;
      const key = l.class_id;
      if (!grouped[day][key]) grouped[day][key] = [];
      grouped[day][key].push(l);
    });
    Object.values(grouped).forEach((byClass) => {
      Object.values(byClass).forEach((lessons) => lessons.sort(byStartTime));
    });
    return grouped;
  }, [filteredSchedule]);
  const allVisibleSelected =
    visibleLessonIds.length > 0 && visibleLessonIds.every((id) => selectedIds.has(id));

  const openModal = (day, class_id, options = {}) => {
    if (selectedClassId === 'kodesh') {
      // שיעור לכיתה מסוימת: נושאי הקורס של אותה כיתה (ה' → 7, ו' → 8); השרת מוסיף להם את
      // הנושאים המשותפים של קורס 19. הוספה ללא כיתה מקבלת את הרשימה המשותפת בלבד.
      const cls = class_id ? classes.find(c => String(c.id) === String(class_id)) : null;
      if (cls?.course_id) {
        setCourse_id(cls.course_id);
        dispatch(getTopicsByCourseThunk(cls.course_id));
      } else {
        updateCourseForKodesh();
      }
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
      // ברירת מחדל: רק הכיתה של התא שנלחץ. הרחבה לקבוצה/לכל הכיתות רק בבחירה מפורשת
      group: 'single',
      isDayGroup: options.isDayGroup ?? false,
    });
    setModalOpen(true);
  };


  const getGroupClassIds = (group) => {
    const kodeshClasses = getKodeshClasses();
    if (group === 'heh') return kodeshClasses.filter(c => c.name?.includes('ה')).map(c => c.id);
    if (group === 'vav') return kodeshClasses.filter(c => c.name?.includes('ו')).map(c => c.id);
    return kodeshClasses.map(c => c.id);
  };

  // במצב עריכה אין class_id/group ב-modalData — לוקחים אותם מהשיעור עצמו ומהגבול "כיתה אחת"
  const saveLesson = async () => {
    const { id, day_of_week, start_time, end_time, topic_id, room_id } = modalData;
    const group = modalData.group ?? 'single';
    // מזהה הכיתה של התא/שיעור — בשיעור קיים הוא מגיע מהרשומה עצמה
    const class_id = modalData.class_id
      ?? (id ? schedule.find(l => String(l.id) === String(id))?.class_id : undefined);
    if ((day_of_week === null || day_of_week === undefined) || !start_time || !end_time || !topic_id || !room_id) {
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

    // בדיקת כפילות: לאותו יום, אותה שנה — לא ייתכן שיעור נוסף בכיתה באותה שעת התחלה
    // (שיעור קיים מחוץ לתחום/שנה שנבחר עדיין נבדק, כדי שלא תיווצר כפילות)
    const findDuplicateClass = (classIdsToCheck) => {
      for (const cid of classIdsToCheck) {
        const existing = schedule.find(l =>
          String(l.class_id) === String(cid) &&
          Number(l.day_of_week) === Number(day_of_week) &&
          Number(l.year) === Number(selectedYear) &&
          (id ? String(l.id) !== String(id) : true) &&
          toMinutes(l.start_time) === toMinutes(start_time)
        );
        if (existing) return { cid, existing };
      }
      return null;
    };
    const duplicate = findDuplicateClass(
      id ? [class_id] : group === 'single' || group == null ? [class_id] : getGroupClassIds(group)
    );
    if (duplicate) {
      const cls = classes.find(c => String(c.id) === String(duplicate.cid));
      alert(
        `⚠️ לכיתה ${cls?.name || duplicate.cid} כבר יש שיעור בשעה זו ` +
        `(${formatTime(duplicate.existing.start_time)}-${formatTime(duplicate.existing.end_time)}). ` +
        'לא ניתן להוסיף שיעור נוסף לאותה כיתה באותה שעה.'
      );
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
      // ברירת מחדל: הכיתה של התא שנלחץ. רק בחירה מפורשת ("כל הכיתות"/קבוצה) מרחיבה
      const classIds = group === 'single' || group == null
        ? [class_id]
        : getGroupClassIds(group);
      if (!classIds.length || classIds.some((cid) => cid === null || cid === undefined)) {
        alert('לא נמצאו כיתות לקבוצה שנבחרה');
        return;
      }

      // בדיקת התנגשות חדר פר-כיתה: החדר חייב להיות פנוי בכולן לפני שמירה
      const conflict = classIds.find((cid) =>
        schedule.some(l =>
          String(l.class_id) === String(cid) &&
          l.day_of_week === day_of_week &&
          String(l.room_id) === String(room_id) &&
          l.year === selectedYear &&
          start_time < l.end_time && end_time > l.start_time
        )
      );
      if (conflict) {
        const cls = classes.find(c => String(c.id) === String(conflict));
        alert(`⚠️ החדר תפוס בכיתה ${cls?.name || conflict} בשעה הזו`);
        return;
      }

      // הבקשות נשלחות זו אחר זו, כדי ש-failure של אחת לא יעבור בשקט
      const failed = [];
      for (const cid of classIds) {
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
        const result = await dispatch(addWeeklyLessonThunk(payload));
        if (!addWeeklyLessonThunk.fulfilled.match(result)) failed.push(cid);
      }
      if (failed.length > 0) {
        alert(`נוספו ${classIds.length - failed.length} שיעורים, ${failed.length} נכשלו. נסי לרענן ולבדוק.`);
      }
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

  // תיבת סימון מוצגת בכל שורת שיעור כאשר מצב הבחירה פעיל
  const renderSelectBox = (lesson) => {
    if (!selectionMode || lesson?.id === undefined || lesson?.id === null) return null;
    return (
      <label className="flex items-center gap-1 cursor-pointer mb-1 text-xs text-blue-700">
        <input
          type="checkbox"
          checked={selectedIds.has(lesson.id)}
          onChange={() => toggleSelected(lesson.id)}
        />
        בחר
      </label>
    );
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
    // לפני הטעינה נוודא שהנושאים שנטענים הם של הקורס שאליו שייכת הכיתה של השיעור
    // (בקודש הכיתה קובעת: ה' → קורס 7, ו' → קורס 8). השרת מוסיף לשתיהן את נושאי 19 המשותפים.
    if (selectedClassId === 'kodesh') {
      const cls = classes.find(c => String(c.id) === String(lesson.class_id));
      if (cls?.course_id) {
        setCourse_id(cls.course_id);
        dispatch(getTopicsByCourseThunk(cls.course_id));
      }
    }
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

  const renderDayGrid = () => {
    // תצוגה כללית לתחום (אין כיתה נבחרת): טבלת יום מול כיתות בתחום
    if (!selectedClassId && selectedDomain !== 'kodesh') {
      const domainClassList = filteredClasses;
      const classIds = domainClassList.map(c => c.id);
      const classNames = domainClassList.map(c => c.name);
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
                  {classNames.map((n, idx) => (
                    <th key={classIds[idx]} className="border p-2" dir="rtl">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {classIds.map(cid => (
                    <td key={cid} className="border p-2 align-top">
                      {(groupedByDayAndClass[i]?.[cid] || []).map((lesson, idx) => (
                        <div
                          key={idx}
                          className="mb-2 p-1 bg-gray-50 rounded border text-xs"
                          onContextMenu={(e) => handleOpenContextMenu(e, lesson)}
                          title="לחיצה ימנית לפעולות"
                        >
                          {renderSelectBox(lesson)}
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
    }
    // לימודי קודש: טבלת יום מול כיתות (ללא שעות קבועות)
    if (selectedClassId === 'kodesh') {
      const filteredKodesh = getKodeshClasses();
      const classIds = filteredKodesh.map(c => c.id);
      const classNames = classIds.map(cid => {
        const cls = classes.find(c => c.id === cid);
        return cls ? cls.name : `כיתה ${cid}`;
      });
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
                      {(groupedByDayAndClass[i]?.[cid] || []).map((lesson, idx) => (
                        <div
                          key={idx}
                          className="mb-2 p-1 bg-gray-50 rounded border text-xs"
                          onContextMenu={(e) => handleOpenContextMenu(e, lesson)}
                          title="לחיצה ימנית לפעולות"
                        >
                          {renderSelectBox(lesson)}
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
    }
    // רגיל לפי כיתה: ימים בשורה אחת
    return (
      <div className="grid grid-cols-6 gap-4" dir="rtl">
        {dayNames.map((name, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4">
            <h2 className="font-bold text-lg text-gray-800 mb-2">{name}</h2>
            <button
              onClick={() => openModal(i, selectedClassId, { isDayGroup: true })}
              className="mb-2 text-xs text-blue-600 hover:underline"
            >
              הוסף שיעור ליום זה
            </button>
            {scheduleByDay[i].map((l, idx) => (
              <div
                key={idx}
                className="border px-2 py-1 rounded mb-2 flex flex-col gap-1 bg-gray-50"
                onContextMenu={(e) => handleOpenContextMenu(e, l)}
                title="לחיצה ימנית לפעולות"
              >
                {renderSelectBox(l)}
                <div className="flex items-center gap-2 text-sm"><Clock size={16} />{formatTime(l.start_time)}-{formatTime(l.end_time)}</div>
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
                openModal(i, selectedClassId, { isDayGroup: false });
              }}
              className="mt-1 text-xs text-blue-600 hover:underline"
            >
              הוסף שיעור לכיתה זו
            </button>
          </div>
        ))}
      </div>
    );
  };


  return (
    // pt-24: התפריט העליון קבוע (fixed) וגובהו עד 68px — הריפוד מוריד את הכותרת מתחתיו
    <div className="px-8 pb-8 pt-24 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-[#0A3960]">עריכת מערכת שבועית</h1>
        <button
          onClick={() => (selectionMode ? exitSelectionMode() : setSelectionMode(true))}
          className={`text-sm font-semibold px-4 py-2 rounded border-2 shadow-sm ${selectionMode ? 'border-red-600 text-red-700 bg-red-50' : 'border-red-600 text-white bg-red-600 hover:bg-red-700'}`}
        >
          {selectionMode ? 'יציאה מבחירה' : '☑ בחירה מרובה ומחיקה'}
        </button>
      </div>
      {/* בחירת תחום */}
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block font-semibold mb-1">תחום</label>
          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="border rounded px-3 py-2 min-w-[120px]"
          >
            <option value="kodesh">קודש</option>
            <option value="horaah">הוראה</option>
            <option value="hitmachuyot">התמחויות</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">שנת לימודים</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {SCHOOL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {/* סינון שנה א/ב בהתמחויות */}
        {selectedDomain === 'hitmachuyot' && (
          <div>
            <label className="block font-semibold mb-1">שנה בהתמחות</label>
            <select
              value={selectedYearLevel}
              onChange={e => setSelectedYearLevel(e.target.value)}
              className="border rounded px-3 py-2 min-w-[100px]"
            >
              <option value="all">כל השנים</option>
              <option value="a">שנה א</option>
              <option value="b">שנה ב</option>
            </select>
          </div>
        )}
        {/* בחירת כיתה - רק אם לא תצוגה כללית לתחום */}
        {(selectedDomain === 'kodesh' || filteredClasses.length > 0) && (
          <div>
            <label className="block font-semibold mb-1">כיתה</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="border rounded px-3 py-2 min-w-[120px]"
            >
              {/* קודש */}
              {selectedDomain === 'kodesh' && <option value="kodesh">כל לימודי קודש</option>}
              <option value="">כל הכיתות בתחום</option>
              {filteredClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* סרגל מחיקה מרובה — מוצג רק במצב בחירה */}
      {selectionMode && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-lg border border-blue-200 bg-blue-50" dir="rtl">
          <span className="font-semibold text-[#0A3960]">נבחרו {selectedIds.size} שיעורים</span>
          <button
            onClick={toggleSelectAllVisible}
            className="text-sm text-blue-700 hover:underline disabled:opacity-50"
            disabled={visibleLessonIds.length === 0}
          >
            {allVisibleSelected ? 'בטל בחירת הכל' : `בחר הכל (${visibleLessonIds.length})`}
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.size === 0}
            className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-3 py-1 rounded"
          >
            מחק נבחרים
          </button>
          <button onClick={exitSelectionMode} className="text-sm text-gray-600 hover:underline">
            ביטול
          </button>
          <span className="text-xs text-gray-500">
            המחיקה חלה על השיעורים המסומנים בכל התצוגה, כולל כיתות אחרות במידה וסומנו.
          </span>
        </div>
      )}

      {renderDayGrid()}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{modalData?.id ? 'עריכת שיעור' : 'הוספת שיעור'}</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField label="שעת התחלה" type="time" fullWidth value={modalData.start_time || ''} onChange={e => setModalData({ ...modalData, start_time: e.target.value })} />
          <TextField label="שעת סיום" type="time" fullWidth value={modalData.end_time || ''} onChange={e => setModalData({ ...modalData, end_time: e.target.value })} />
          {selectedClassId === 'kodesh' && !modalData?.id && (
            <Select
              fullWidth
              value={modalData.group || 'single'}
              onChange={e => setModalData({ ...modalData, group: e.target.value })}
              displayEmpty
            >
              <MenuItem value="single">
                רק הכיתה הזו
                {(() => {
                  const cls = classes.find(c => String(c.id) === String(modalData.class_id));
                  return cls ? ` (${cls.name})` : '';
                })()}
              </MenuItem>
              <MenuItem value="all">כל הכיתות</MenuItem>
              <MenuItem value="heh">כיתות ה</MenuItem>
              <MenuItem value="vav">כיתות ו</MenuItem>
            </Select>
          )}
          <Select fullWidth value={modalData.topic_id || ''} onChange={e => setModalData({ ...modalData, topic_id: e.target.value })} displayEmpty>
            <MenuItem value=""><em>בחר נושא</em></MenuItem>
            {/* הנושא הנוכחי נשמר ברשימה גם אם הוא שייך לקורס אחר — אחרת עריכת שיעור הייתה מאבדת אותו */}
            {modalData.topic_id && teachers.every(t => String(t.id) !== String(modalData.topic_id)) && (
              <MenuItem value={modalData.topic_id}>{modalData.topic_name || 'נושא נוכחי'}</MenuItem>
            )}
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
