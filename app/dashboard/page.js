"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("/api/employees");
        const data = await response.json();

        if (response.ok) {
          setEmployees(data.employees);
        } else {
          console.error("Failed to fetch employees:", data.error);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  return (
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Employee List</h2>
      {loading ? (
        <p className="text-gray-600">Loading employees...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-900 rounded-lg overflow-hidden border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b border-gray-300 text-left">Name</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Email</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Department</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => router.push(`/employee/${employee.id}`)}
                  >
                    <td className="py-3 px-4 border-b border-gray-300">{employee.name}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{employee.email}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{employee.department || "N/A"}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{employee.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-600">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
