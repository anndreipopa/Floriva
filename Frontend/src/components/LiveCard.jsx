import React from "react";

export default function LiveCard({ title, value, unit, icon: Icon }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between w-full hover:shadow-lg transition-shadow duration-200">
      <div>
        <h3 className="text-gray-600 text-sm uppercase font-semibold tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold text-[#0f3d33] mt-2">
          {value}
          <span className="text-lg font-medium text-gray-500 ml-1">{unit}</span>
        </p>
      </div>

      <div className="bg-[#eaf5f1] p-3 rounded-xl">
        <Icon className="text-[#0f3d33]" size={28} />
      </div>
    </div>
  );
}
