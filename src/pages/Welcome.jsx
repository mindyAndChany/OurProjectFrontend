import React, { useEffect, useState } from "react";
import Crowdfunding from "../icons/crowdfunding.png";
import LicenseDraft from "../icons/license-draft.png";
import SchoolBell02 from "../icons/school-bell-02.png";
import SecurityCheck from "../icons/security-check.png";
import SquareLock01 from "../icons/square-lock-01.png";
import calendar02 from "../icons/calendar-02.png";
import Task01 from "../icons/task-01.png";
import User from "../icons/user.png";
import GurLogo from "../icons/לוגו שחור.png";
import { CalendarClock, ArrowLeft, Sparkles, Zap, Shield, TrendingUp, Phone, School } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Edulink } from "../components/Edulink";
import { motion } from "framer-motion";

export default function Frame() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(null);

  async function wakeUpServer() {
    const serverUrl = BACKEND_URL;
    try {
      console.log('מעיר את השרת...');
      const response = await fetch(`${serverUrl}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) console.log('השרת התעורר בהצלחה');
    } catch (error) {
      console.log('השרת עדיין מתעורר...', error.message);
    }
  }

  useEffect(() => {
    wakeUpServer();
    window.addEventListener('load', wakeUpServer);
    return () => window.removeEventListener('load', wakeUpServer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const mainFeatures = [
    { 
      id: 1, 
      title: "השאלת ציוד", 
      description: "מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.", 
      icon: User, 
      color: "from-[#0A3960] to-[#295f8b]",
      details: "ניהול מלא של השאלות ציוד: רישום השאלות, מעקב אחר מועדי החזרה, התראות אוטומטיות על איחורים, היסטוריית השאלות לכל תלמידה, וניהול מלאי ציוד זמין."
    },
    { 
      id: 2, 
      title: "מסד נתונים", 
      description: "פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.", 
      icon: Crowdfunding, 
      color: "from-[#584041] to-[#bda39b]",
      details: "מאגר מרכזי של כל פרטי התלמידות: נתונים אישיים, פרטי קשר, מידע אקדמי, תמונות, מסמכים, סינון מתקדם לפי כיתה/מסלול/שנה, יצוא לאקסל, וגיבוי אוטומטי."
    },
    { 
      id: 3, 
      title: "נוכחות חכמה", 
      description: "מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.", 
      icon: LicenseDraft, 
      color: "from-[#295f8b] to-[#3b78b2]",
      details: "מערכת נוכחות מתקדמת: רישום נוכחות מהיר, מעקב אחר היעדרויות, התראות להורים, דוחות נוכחות מפורטים, סטטיסטיקות חודשיות, וזיהוי מגמות של חוסרי נוכחות."
    },
    { 
      id: 4, 
      title: "הרשאות וגיבוי", 
      description: "הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.", 
      icon: SquareLock01, 
      color: "from-[#bda39b] to-[#584041]",
      details: "אבטחת מידע מלאה: הגדרת הרשאות לפי תפקידים, גיבוי אוטומטי יומי, שחזור מידע, הצפנת נתונים רגישים, מעקב אחר שינויים, ולוג פעולות למעקב ובקרה."
    },
    { 
      id: 5, 
      title: "לוח שנה משותף", 
      description: "כל הארועים, מבחנים והפסקות במבט אחד.", 
      icon: calendar02, 
      color: "from-[#0A3960] to-[#3b78b2]",
      details: "לוח שנה אינטגרטיבי: תכנון שנתי, רישום אירועים ומבחנים, תזכורות אוטומטיות, סנכרון עם לוח השנה האישי, תצוגה לפי כיתות/מסלולים, וייצוא ללוח שנה חיצוני."
    },
    { 
      id: 6, 
      title: "ניהול מערכת", 
      description: "ניהול חדרים, מורות, כיתות ושעות — הכל במקום אחד.", 
      icon: CalendarClock, 
      color: "from-[#3b78b2] to-[#295f8b]",
      details: "מערכת שעות מתקדמת: בניית מערכת שעות אוטומטית, ניהול חדרי לימוד, שיבוץ מורות, מעקב אחר שינויים, התראות על התנגשויות, ותצוגה נוחה למורות ותלמידות."
    },
  ];

  const additionalFeatures = [
    { id: 1, title: "גיבוי ופרטיות", description: "אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים", icon: SecurityCheck },
    { id: 2, title: "יצוא ודוחות", description: "דוחות מותאמים אישית\nיצוא לקבצי EXCEL/PDF", icon: Task01 },
    { id: 3, title: "התראות חכמות", description: "התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.", icon: SchoolBell02 },
  ];

  const stats = [
    { id: 1, label: "מודולים חכמים", value: "9+", icon: Sparkles },
    { id: 2, label: "מסכים מנוהלים", value: "20+", icon: Zap },
    { id: 3, label: "זמן הטמעה", value: "דקות", icon: TrendingUp },
    { id: 4, label: "שקט תפעולי", value: "100%", icon: Shield },
  ];

  return (
    <div className="w-full [direction:rtl] overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-orange-50/20 relative" style={{ fontFamily: '"Inter", "Heebo", system-ui, sans-serif' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-300/20 to-cyan-300/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200/20 to-amber-200/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative">
          {/* Header with Logo and Badge */}
          <motion.div 
            className="flex items-center justify-between mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <Edulink className="scale-90" />
              {/* <img src={GurLogo} alt="סמינר גור ירושלים" className="h-16 w-auto" /> */}
            </div>
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-orange-50 px-6 py-3 rounded-full border-2 border-white shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-[#0A3960] to-[#295f8b]"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-base font-black bg-gradient-to-r from-[#0A3960] to-[#295f8b] bg-clip-text text-transparent">
<img src={GurLogo} alt="סמינר גור ירושלים" className="h-16 w-auto" />                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-16 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-black leading-[1.15] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="block bg-gradient-to-l from-[#0A3960] via-[#295f8b] to-[#0A3960] bg-clip-text text-transparent">
                  להחליף את הגליונות
                </span>
                <span className="block bg-gradient-to-r from-[#295f8b] to-[#3b78b2] bg-clip-text text-transparent mt-2">
                  בקובץ מסודר
                </span>
                <span className="block bg-gradient-to-r from-[#584041] via-[#bda39b] to-[#584041] bg-clip-text text-transparent mt-2">
                  בטוח ומתאים
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות, מעקב נוכחות, מערכת שעות וחדרים, לוח שנה פנימי, הנפקת אישורים ותעודות וניהול השאלת ציוד.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#0A3960] to-[#295f8b] text-white rounded-full font-bold shadow-2xl overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: "0 30px 60px rgba(10, 57, 96, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    כניסה למערכת ←
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-l from-[#295f8b] to-[#3b78b2]"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>

                <motion.button
                  className="px-8 py-4 bg-white rounded-full font-bold border-2 border-gray-200 text-gray-700 shadow-lg hover:shadow-xl hover:border-[#295f8b] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  חקור את המערכת
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-5">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.id}
                      className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}
                    >
                      <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon className="w-16 h-16 text-[#0A3960]" />
                      </div>
                      <div className="relative">
                        <div className="text-5xl font-black bg-gradient-to-br from-[#0A3960] to-[#295f8b] bg-clip-text text-transparent mb-2">
                          {s.value}
                        </div>
                        <div className="text-xs font-bold text-gray-600">{s.label}</div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A3960] to-[#295f8b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </motion.div>
                  );
                })}
              </div>

              <motion.div 
                className="mt-6 bg-gradient-to-br from-blue-50 via-white to-orange-50 rounded-3xl p-6 shadow-xl border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <p className="text-center text-gray-700 font-semibold leading-relaxed text-sm">
                  שליטה מלאה, תזרים עבודה ברור, וחווית שימוש מהירה ונוחה לצוות ההנהלה.
                </p>
              </motion.div>

              {/* Decorative floating elements */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-[3rem] blur-2xl"
                animate={{ 
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>

        {/* MAIN FEATURES */}
        <section className="max-w-7xl mx-auto mt-24 px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black bg-gradient-to-r from-[#1c2b36] to-[#0A3960] bg-clip-text text-transparent mb-4">
              יכולות מתקדמות במקום אחד
            </h2>
            <p className="text-xl text-gray-700">כל מה שצריך לניהול מושלם של הסמינר</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((f, i) => (
              <motion.div
                key={f.id}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setExpandedFeature(expandedFeature === f.id ? null : f.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <motion.div 
                  className={`mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {typeof f.icon === "string" ? (
                    <img src={f.icon} alt="" className="w-12 h-12 object-contain brightness-0 invert" />
                  ) : (
                    (() => {
                      const Icon = f.icon;
                      return <Icon className="w-12 h-12 text-white" />;
                    })()
                  )}
                </motion.div>

                <h3 className="text-2xl font-bold text-[#1c2b36] mb-3 text-center">{f.title}</h3>
                <p className="text-base text-gray-700 text-center leading-relaxed">{f.description}</p>

                <motion.div
                  initial={false}
                  animate={{ height: expandedFeature === f.id ? "auto" : 0, opacity: expandedFeature === f.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">{f.details}</p>
                  </div>
                </motion.div>

                <div className="mt-4 text-center">
                  <span className="text-xs text-[#295f8b] font-semibold">
                    {expandedFeature === f.id ? "לחץ לסגירה ↑" : "לחץ לפרטים נוספים ↓"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#295f8b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ADDITIONAL FEATURES */}
        <section className="mt-32 py-24 bg-gradient-to-br from-blue-600 via-[#295f8b] to-[#0A3960] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative">
            <motion.div
              className="text-center text-white mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h2 className="text-5xl font-black mb-4">הכלים שעושים הבדל</h2>
              <p className="text-xl text-white/80">מערכת בנויה לשקט תפעולי ולשקיפות מלאה</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalFeatures.map((f, i) => (
                <motion.div
                  key={f.id}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#295f8b]/5 to-[#bda39b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <img src={f.icon} alt="" className="mx-auto w-16 h-16 mb-6" />
                  </motion.div>
                  
                  <h4 className="text-2xl font-bold text-[#1c2b36] mb-3">{f.title}</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="mt-32 pb-16 px-6">
          <motion.div
            className="max-w-5xl mx-auto relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-[#0A3960] via-[#295f8b] to-[#3b78b2] rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
              
              <motion.div className="relative">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  מוכנה להפחית ניירת ולהתארגן?
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10">
                  התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    onClick={() => navigate("/login")}
                    className="px-10 py-5 bg-white text-[#0A3960] rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    התחברות למערכת
                  </motion.button>

                  <motion.button
                    className="px-10 py-5 bg-[#bda39b] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    למד עוד
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* About */}
              <div>
                <Edulink className="scale-75 origin-right mb-4" />
                <p className="text-gray-600 leading-relaxed">
                  מערכת ניהול סמינר מתקדמת המרכזת את כל המידע במקום אחד - מאגר תלמידות, נוכחות, מערכת שעות ועוד.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold text-[#0A3960] mb-4">קישורים מהירים</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => navigate("/login")} className="text-gray-600 hover:text-[#295f8b] transition">
                      כניסה למערכת
                    </button>
                  </li>
                  <li>
                    <a href="#features" className="text-gray-600 hover:text-[#295f8b] transition">
                      תכונות
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="text-gray-600 hover:text-[#295f8b] transition">
                      אודות
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold text-[#0A3960] mb-4">יצירת קשר</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#295f8b]" />
                    <a href="tel:0548578868" className="hover:text-[#295f8b] transition">054-857-8868</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#295f8b]" />
                    <a href="tel:0556750905" className="hover:text-[#295f8b] transition">055-675-0905</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <School className="w-5 h-5 text-[#295f8b]" />
                    <span>סמינר גור ירושלים</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 pt-8 text-center">
              <p className="text-gray-600 text-sm">
                פותח ע"י <span className="font-semibold text-[#0A3960]">מ.רובינשטיין</span> ו<span className="font-semibold text-[#0A3960]">ח.פשנדזה</span> בחסות סמינר גור ירושלים
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © {new Date().getFullYear()} Edulink. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
