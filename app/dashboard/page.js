'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import prisma from '@/lib/prisma';

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch employees when the component mounts
    async function fetchEmployees() {
      const response = await fetch('/api/employees');
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees);
      } else {
        console.error('Failed to fetch employees:', data.error);
      }
    }

    fetchEmployees();
  }, []);

  const handleLogout = () => {
    // Clear user session (if any) and redirect to login
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Department</th>
              <th className="py-2 px-4 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/dashboard/employee/${employee.id}`)}
              >
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">{employee.department || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{employee.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}