import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CalendarDays } from "lucide-react";
import axios from "axios";

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<any>([]);
  const [newEvent, setNewEvent] = useState("");
  const [libur, setLibur] = useState<any>([]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleDateClick = (date: any) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const addEvent = () => {
    if (newEvent.trim()) {
      setEvents([...events, { date: selectedDate, text: newEvent }]);
      setNewEvent("");
      setShowModal(false);
    }
  };

  async function getHariLibur() {
    const libur = await axios.get("https://api-harilibur.vercel.app/api");
    return libur;
  }
  function formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
console.log(formatDate(daysInMonth[0]))
  useEffect(() => {
    getHariLibur().then((res) => {
      setLibur(res.data);
    });
  }, []);
  const MONTH =
    currentDate.getMonth().toString().length < 2
      ? "0" + (currentDate.getMonth() + 1).toString()
      : (currentDate.getMonth() + 1).toString();

  return (
    <div className="max-w-4xl mx-auto min-h-screen mt-12 p-4">
      <h1 className="text-center text-3xl font-bold mb-3 flex items-center justify-center gap-2">
        <CalendarDays></CalendarDays>
        <span>Kalender Kerja</span>
      </h1>
      {/* Header */}
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-semibold p-3 rounded-xl">
          {format(currentDate, "MMMM yyyy")}
        </h1>
        <div className="flex">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="w-4 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-lg">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-gray-500 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((date: any) => {
          return (
            <div
              key={date}
              onClick={() => handleDateClick(date)}
              className={`p-2 relative border rounded-lg cursor-pointer hover:bg-gray-100
                ${isSameMonth(date, currentDate) ? "bg-white" : "bg-gray-100"}
                ${
                  selectedDate && isSameDay(date, selectedDate)
                    ? "bg-blue-50 border-blue-300"
                    : ""
                }`}
            >
              {libur.map((event:any)=>(
                event.holiday_date==formatDate(date) &&
              <div className="absolute right-2 w-full text-right mb-1 flex justify-end">
                <span
                  className={`text-lg bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center
                  `}
                >
                  {date.getDate()}
                </span>
              </div>))}
              <div className="text-right mb-1 flex justify-end">
                <span
                  className={`text-lg ${
                    isSameDay(date, new Date())
                      ? "text-lg bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                      : "text-lg bg-black text-white rounded-full w-7 h-7 flex items-center justify-center"
                  }
                  `}
                >
                  {date.getDate()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <p className="w-3 h-3 rounded-full bg-red-500"></p>{" "}
          <p className="font-bold">LIBUR :</p>
        </div>
        {libur.reverse().map((event: any, index: number) => (
          <div key={index}>
            {event.holiday_date.substring(7, 5) === MONTH && (
              <div className="flex gap-2">
                <p>
                  {event.holiday_date.substring(8, 10)}{" "}
                  {format(currentDate, "MMM")}
                </p>{" "}
                :<p>{event.holiday_name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add Event */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Add Event - {format(selectedDate, "MMM dd, yyyy")}
            </h2>
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter event description"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kalender;
