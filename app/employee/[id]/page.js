"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Loader from "@/app/components/Loader"; 

export default function EmployeeDetailsPage() {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    async function fetchEmployee() {
      try {
        const response = await fetch(`/api/employees/${id}`);
        const data = await response.json();
        if (response.ok) {
          setEmployee(data.employee);
        } else {
          console.error("Failed to fetch employee:", data.error);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    }

    async function fetchAttendance() {
      try {
        const response = await fetch(`/api/attendance/${id}`);
        const data = await response.json();
        if (response.ok) {
          setAttendance(data.attendance);
        } else {
          console.error("Failed to fetch attendance:", data.error);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    }

    async function fetchData() {
      setLoading(true);
      await fetchEmployee();
      await fetchAttendance();
      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const formatTime = (dateTime) => {
    if (!dateTime) return "N/A";
    
    const date = new Date(dateTime); // Convert to Date object
  
    // Convert from UTC to local time
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
    return localDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  

  const events = attendance.map((record) => ({
    title: `Clock-in: ${formatTime(record.checkIn)}\nClock-out: ${formatTime(record.checkOut) || "N/A"}`,
    start: new Date(record.checkIn),
    end: record.checkOut ? new Date(record.checkOut) : undefined,
  }));  

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Employee Attendance</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center mr-6">
            <FontAwesomeIcon icon={faUser} className="text-gray-700 text-3xl" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
            <p className="text-gray-600">{employee.email}</p>
            <p className="text-gray-600">{employee.department || "N/A"}</p>
            <p className="text-gray-600">{employee.role}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">Attendance Calendar</h3>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="600px"
          dayCellContent={(info) => (
            <div className="relative w-full h-full text-gray-800">{info.dayNumberText}</div>
          )}
          eventContent={(arg) => ({
            html: `<div class="whitespace-pre-wrap text-gray-900">${arg.event.title.replace(/\n/g, "<br>")}</div>`,
          })}
          
          className="bg-gray-100 p-4 rounded-lg"
        />
      </div>
    </div>
  );
}
