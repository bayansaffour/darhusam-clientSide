

import React from "react";

const HallCard = ({ hall, bookedTimes, selectedDate, onSelect }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform hover:scale-[1.01]">
      <img
        src={hall.image}
        alt={hall.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#780C28] mb-2">{hall.name}</h2>
        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">السعة:</span> {hall.capacity} شخص
          </p>
          <p className="text-gray-700">
            <span className="font-medium">المواصفات:</span> {hall.specs}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-gray-800 mb-2">الأوقات المتاحة:</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            {selectedDate ? (
              <ul className="grid grid-cols-2 gap-2">
                {hall.availableTimes.map((time) => {
                  const isBooked = bookedTimes.includes(time);
                  return (
                    <li
                      key={time}
                      className={`flex items-center ${
                        isBooked
                          ? "text-gray-500"
                          : "text-[#6E8E59] font-medium"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          isBooked ? "bg-red-500" : "bg-[#6E8E59]"
                        }`}
                      ></span>
                      {time}
                      <span className="text-xs mr-1">
                        {isBooked ? "(محجوز)" : "(متاح)"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600">
                يرجى اختيار تاريخ لعرض الأوقات المتاحة
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full mt-6 bg-[#780C28] hover:bg-[#670a22] text-white py-3 px-4 rounded-md font-medium transition-colors"
        >
          احجز الآن
        </button>
      </div>
    </div>
  );
};

export default HallCard;