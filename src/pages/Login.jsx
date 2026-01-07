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

  function onKeyDown(e) {
    if (e.key === "Enter") login();
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col bg-white px-4 md:px-8 transition-all duration-400 overflow-x-hidden ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      {/* Header - LOGO on top */}
      <header className="w-full flex items-center justify-center py-4">
        <Edulink
          EDULINKClassName="!text-[56px] md:!text-[90px] !leading-none"
          className="!h-20 md:!h-32"
          spanClassName="!text-[#295f8b]"
        />
      </header>

      {/* Main: center card; card limited to viewport height so page won't scroll */}
      <main className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-10 mx-auto max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* FORM */}
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-[26px] md:text-[40px] text-right">
                כניסה למערכת
              </h1>

              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-right">
                  מייל
                </label>
                <div className="w-full rounded-[28px] border-4 border-black bg-variable-collection-color-4 px-3 md:px-4 py-2 md:py-3 flex items-center transition focus-within:ring-2 focus-within:ring-blue-100">
                  <input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full bg-transparent text-black placeholder-gray-500 focus:outline-none text-base md:text-lg"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && <p id="email-error" className="mt-2 text-right text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 font-medium text-right">
                  סיסמא
                </label>
                <div className="w-full rounded-[28px] border-4 border-black bg-variable-collection-color-4 px-3 md:px-4 py-2 md:py-3 flex items-center transition focus-within:ring-2 focus-within:ring-blue-100">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full bg-transparent text-black placeholder-gray-500 focus:outline-none text-base md:text-lg"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="mr-2 md:mr-3 text-sm text-gray-700"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? "הסתר" : "הצג"}
                  </button>
                </div>
                {errors.password && <p id="password-error" className="mt-2 text-right text-red-600 text-sm">{errors.password}</p>}
              </div>

              <div>
                <button
                  onClick={login}
                  className="w-full bg-[#295f8b] text-white font-bold text-[16px] md:text-[28px] py-2 md:py-3 rounded-[20px] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150"
                >
                  התחברות
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 md:w-5 md:h-5 accent-black" />
                  <span className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-sm md:text-base">זכור אותי</span>
                </label>
                <button onClick={() => navigate("/register")} className="underline text-[#295f8b] text-sm md:text-base">הרשמה</button>
              </div>
            </div>

            {/* BRAND / DECORATION */}
            <div className="flex flex-col items-center md:items-end justify-start gap-4 md:gap-6">
              <div className="w-full md:w-auto bg-variable-collection-color-2 rounded-[20px] h-16 md:h-36" />
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