import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f7f4f1] via-[#f0f6ff] to-[#fef7f2] [direction:rtl] flex items-center justify-center pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 xs:pb-16 sm:pb-20">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 xs:top-16 sm:top-20 left-5 xs:left-10 sm:left-20 w-32 xs:w-48 sm:w-64 md:w-72 h-32 xs:h-48 sm:h-64 md:h-72 bg-[#bda39b]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 xs:top-32 sm:top-40 right-5 xs:right-10 sm:right-20 w-32 xs:w-48 sm:w-64 md:w-72 h-32 xs:h-48 sm:h-64 md:h-72 bg-[#295f8b]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-32 xs:w-48 sm:w-64 md:w-72 h-32 xs:h-48 sm:h-64 md:h-72 bg-[#584041]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 text-center relative z-10"
      >
        {/* Lock Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-5 xs:mb-6 sm:mb-7 md:mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#295f8b] to-[#4a8fc4] blur-xl xs:blur-2xl opacity-30 rounded-full"></div>
            <Lock className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-[#295f8b] relative" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 xs:mb-5 sm:mb-6 bg-gradient-to-r from-[#295f8b] via-[#3b78b2] to-[#4a8fc4] bg-clip-text text-transparent leading-tight">
          אין לך גישה
        </h1>

        {/* Description */}
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-700 mb-3 xs:mb-4 leading-relaxed px-2">
          נראה שאתה מנסה לגשת לדף שאתה לא מורשה לצפות בו.
        </p>

        <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-8 xs:mb-10 sm:mb-12 leading-relaxed px-2">
          אם אתה חושב שזו טעות, אנא צור קשר עם מנהל המערכת כדי לקבל את ההרשאות הדרושות.
        </p>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/60 backdrop-blur-md rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 mb-8 xs:mb-10 sm:mb-12 border border-white/30 shadow-lg"
        >
          <p className="text-sm xs:text-base sm:text-lg text-gray-700 mb-3 xs:mb-4">
            <span className="font-bold text-[#295f8b]">צור קשר עם מנהל המערכת:</span>
          </p>
          <div className="space-y-1.5 xs:space-y-2">
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 break-all">
              📧 <span className="font-medium">דוא"ל:</span> b0527160234@gmail.com 
            </p>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600">
              📞 <span className="font-medium">טלפון:</span> 0527160234
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 bg-gradient-to-r from-[#295f8b] to-[#3b78b2] text-white rounded-lg xs:rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm xs:text-base sm:text-lg touch-target"
          >
            חזרה לדף הבית
          </motion.button>

          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 bg-white text-[#295f8b] border-2 border-[#295f8b] rounded-lg xs:rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all text-sm xs:text-base sm:text-lg touch-target"
          >
            דף התחברות
          </motion.button>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 xs:mt-10 sm:mt-12 text-gray-400"
        >
          <p className="text-xs xs:text-sm">
            קוד שגיאה: <span className="font-mono">403 FORBIDDEN</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
