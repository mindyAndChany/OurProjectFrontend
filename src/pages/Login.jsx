// import React from "react";
import { useNavigate } from "react-router-dom";
import { Edulink } from "../components/Edulink";
import '../tailwind.css';

export const Screen = () => {

    const navigate = useNavigate();

  function login() {
    console.log("navigate");
    
     navigate('/home');
  }
  return (
    <div className="bg-white overflow-hidden w-full min-w-[1920px] min-h-[1071px] relative">
      <div className="top-[290px] left-[814px] w-[292px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-[40px] text-left whitespace-nowrap absolute tracking-[0] leading-[normal] [direction:rtl]">
        כניסה למערכת
      </div>

      <div className="absolute top-[356px] left-[741px] w-[436px] h-[71px] bg-variable-collection-color-4 rounded-[35.5px] border-[5px] border-solid border-black" />

      <div className="absolute top-[465px] left-[741px] w-[436px] h-[71px] bg-variable-collection-color-4 rounded-[35.5px] border-[5px] border-solid border-black" />

      <div className="absolute top-[570px] left-[741px] w-[436px] h-[71px] bg-variable-collection-color-2 rounded-[35.5px]" />

      <div className="top-[378px] left-[1080px] w-[84px] [font-family:'Anomalia_ML_Medium_AAA-Medium',Helvetica] font-medium text-black text-xl absolute tracking-[0] leading-[normal] [direction:rtl]">
        מייל:
      </div>

      <div className="top-[490px] left-[1053px] w-[111px] [font-family:'Anomalia_ML_Medium_AAA-Medium',Helvetica] font-medium text-black text-xl absolute tracking-[0] leading-[normal] [direction:rtl]">
        סיסמא:
      </div>

      <button className="top-[584px] left-[759px] w-[405px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-white text-[32px] text-center absolute tracking-[0] leading-[normal] [direction:rtl]" onClick={login}>
        התחברות
      </button>

      <div className="top-[650px] left-[993px] w-[157px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-base absolute tracking-[0] leading-[normal] [direction:rtl]">
        זכור אותי
      </div>

      <p className="top-[689px] left-[752px] w-[312px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-base absolute tracking-[0] leading-[normal] [direction:rtl]">
        אם טרם נרשמתם , תועברו לתהליך רישום
      </p>

      <div className="absolute top-[650px] left-[1157px] w-5 h-5 bg-[#d9d9d9] border border-solid border-black" />

      <div className="absolute top-[689px] left-[747px] w-[22px] h-[22px] flex bg-black rounded-[11px]">
        <img
          className="mt-[3.6px] w-[15px] h-[14.73px] ml-[7px]"
          alt="Arrow"
        //   src={arrow1}
        />
      </div>

      <Edulink
        EDULINKClassName="!text-[90px] !w-[499.73px]"
        className="!h-32 !absolute !left-[1455px] !w-[500px] !top-[26px]"
        spanClassName="!text-[#295f8b]"
      />
    </div>
  );
};
export default Screen;