'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function EmployeeDetailsPage() {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    // Fetch employee details
    async function fetchEmployee() {
      const response = await fetch(`/api/employees/${id}`);
      const data = await response.json();
      if (response.ok) {
        setEmployee(data.employee);
      } else {
        console.error('Failed to fetch employee:', data.error);
      }
    }

    // Fetch attendance data
    async function fetchAttendance() {
      const response = await fetch(`/api/attendance/${id}`);
      const data = await response.json();
      if (response.ok) {
        setAttendance(data.attendance);
      } else {
        console.error('Failed to fetch attendance:', data.error);
      }
    }

    fetchEmployee();
    fetchAttendance();
  }, [id]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const events = attendance.map((record) => ({
    title: `Check-in: ${moment(record.checkIn).format('HH:mm')}`,
    start: new Date(record.checkIn),
    end: record.checkOut ? new Date(record.checkOut) : new Date(record.checkIn),
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img
            src={employee.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h2 className="text-xl font-semibold">{employee.name}</h2>
            <p className="text-gray-600">{employee.email}</p>
            <p className="text-gray-600">{employee.department || 'N/A'}</p>
            <p className="text-gray-600">{employee.role}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-4">Attendance Calendar</h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
}