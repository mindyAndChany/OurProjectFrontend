import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';


import { Edulink } from "../components/Edulink";
import "../tailwind.css";
import { logInThunk } from "../redux/slices/USER/logInThunk";

export const Screen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load 'remember', email, and password from localStorage if exists
    const rememberValue = localStorage.getItem("rememberMe");
    if (rememberValue !== null) {
      setRemember(rememberValue === "true");
      if (rememberValue === "true") {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
      }
    }
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  function validate() {
    const e = {};
    if (!email) e.email = "מייל דרוש";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "פורמט מייל לא תקין";
    if (!password) e.password = "סיסמא דרושה";
    else if (password.length < 6) e.password = "הסיסמא קצרה מדי";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function login() {
    if (!validate()) return;
    console.log("login", { email, password, remember });
    dispatch(logInThunk({ email, password }));
    navigate("/home");
  }

  // Update localStorage when 'remember', email, or password changes
  useEffect(() => {
    localStorage.setItem("rememberMe", remember);
    if (remember) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  }, [remember, email, password]);

  function onKeyDown(e) {
    if (e.key === "Enter") login();
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col bg-white px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 transition-all duration-400 overflow-x-hidden ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      {/* Header - LOGO on top */}
      <header className="w-full flex items-center justify-center py-3 xs:py-4 sm:py-5">
        <Edulink
          EDULINKClassName="!text-[42px] xs:!text-[56px] sm:!text-[70px] md:!text-[90px] !leading-none"
          className="!h-16 xs:!h-20 sm:!h-24 md:!h-32"
          spanClassName="!text-[#295f8b]"
        />
      </header>

      {/* Main: center card; card limited to viewport height so page won't scroll */}
      <main className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-md sm:shadow-lg p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 mx-auto max-h-[calc(100vh-120px)] xs:max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8 items-start">
            {/* FORM */}
            <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6">
              <h1 className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl text-right">
                כניסה למערכת
              </h1>

              <div>
                <label htmlFor="email" className="block mb-1.5 xs:mb-2 font-medium text-right text-sm xs:text-base">
                  מייל
                </label>
                <div className="w-full rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border-3 xs:border-4 border-black bg-variable-collection-color-4 px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 flex items-center transition focus-within:ring-2 focus-within:ring-blue-100 touch-target">
                  <input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm xs:text-base sm:text-lg"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && <p id="email-error" className="mt-1.5 xs:mt-2 text-right text-red-600 text-xs xs:text-sm">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-1.5 xs:mb-2 font-medium text-right text-sm xs:text-base">
                  סיסמא
                </label>
                <div className="w-full rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border-3 xs:border-4 border-black bg-variable-collection-color-4 px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 flex items-center transition focus-within:ring-2 focus-within:ring-blue-100 touch-target">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm xs:text-base sm:text-lg"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="mr-2 xs:mr-2.5 sm:mr-3 text-xs xs:text-sm text-gray-700 touch-target"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? "הסתר" : "הצג"}
                  </button>
                </div>
                {errors.password && <p id="password-error" className="mt-1.5 xs:mt-2 text-right text-red-600 text-xs xs:text-sm">{errors.password}</p>}
              </div>

              <div>
                <button
                  onClick={login}
                  className="w-full bg-[#295f8b] text-white font-bold text-base xs:text-lg sm:text-xl md:text-2xl lg:text-[28px] py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-[16px] xs:rounded-[18px] sm:rounded-[20px] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150 touch-target shadow-md hover:shadow-lg"
                >
                  התחברות
                </button>
              </div>

              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-0">
                <label className="flex items-center gap-2 xs:gap-3 touch-target">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 accent-black" />
                  <span className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-xs xs:text-sm sm:text-base">זכור אותי</span>
                </label>
                <button onClick={() => navigate("/register")} className="underline text-[#295f8b] text-xs xs:text-sm sm:text-base touch-target hover:text-[#1e4a6b] transition-colors">הרשמה</button>
              </div>
            </div>

            {/* BRAND / DECORATION */}
            <div className="flex flex-col items-center md:items-end justify-start gap-3 xs:gap-4 sm:gap-5 md:gap-6">
              <div className="w-full md:w-auto bg-variable-collection-color-2 rounded-[16px] xs:rounded-[18px] sm:rounded-[20px] h-12 xs:h-16 sm:h-24 md:h-36" />
            </div>
          </div>
        </div>
      </main>

      {/* Optional small footer spacing to guarantee no overlap with system UI */}
      <div className="py-4" />
    </div>
  );
};

export default Screen;