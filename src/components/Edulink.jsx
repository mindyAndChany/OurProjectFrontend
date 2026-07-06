import React from "react";

export const Edulink = ({ className = "", spanClassName = "" }) => {
  return (
    <div className={`flex items-center group ${className}`} dir="ltr">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        
        <p
          className="
            relative
            font-bold text-5xl
            leading-none
            whitespace-nowrap
            drop-shadow-2xl
            transform group-hover:scale-105
            transition-transform duration-300
          "
          style={{ fontFamily: "'Orbitron', 'Space Grotesk', sans-serif" }}
        >
          <span className="
            bg-gradient-to-r from-gray-800 via-gray-900 to-black
            bg-clip-text text-transparent
            animate-gradient-x
            tracking-wider
            inline-block
            transform group-hover:rotate-2
            transition-transform duration-300
          ">
            EDU
          </span>
          <span className={`
            bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500
            bg-clip-text text-transparent
            animate-gradient-x
            tracking-widest
            inline-block
            transform group-hover:-rotate-2
            transition-transform duration-300
            ${spanClassName}
          `}>
            LINK
          </span>
        </p>

        {/* Decorative underline */}
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-500"></div>
      </div>
    </div>
  );
};
