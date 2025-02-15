"use client";

import { useState, useEffect } from "react";

export default function ManageEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    if (response.ok) {
      setEmployees(data.employees);
    }
  };

  // Handle form submission (add or update employee)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = { name, email, department, role };

    const url = editEmployeeId
      ? `/api/employees/${editEmployeeId}`
      : "/api/employees";

    const method = editEmployeeId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (response.ok) {
      alert(
        editEmployeeId
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );
      setName("");
      setEmail("");
      setDepartment("");
      setRole("EMPLOYEE");
      setEditEmployeeId(null);
      setShowForm(false);
      fetchEmployees();
    } else {
      alert("Failed to save employee.");
    }
  };

  // Handle editing an employee
  const handleEdit = (employee) => {
    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department || "");
    setRole(employee.role);
    setEditEmployeeId(employee.id);
    setShowForm(true);
  };

  // Handle deleting an employee
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("Employee deleted successfully!");
        fetchEmployees(); // Refresh the employee list
      } else {
        const errorData = await response.json();
        alert(`Failed to delete employee: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please check the console for details.");
    }
  };

  // Handle "Add Employee" button click
  const handleAddEmployeeClick = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setRole("EMPLOYEE");
    setEditEmployeeId(null);
    setShowForm(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Employees</h1>

      {/* Employee List Table */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Employee List</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white text-gray-900 rounded-lg overflow-hidden border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b border-gray-300 text-left">Name</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Department</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Role</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-100 transition">
                <td className="py-3 px-4 border-b border-gray-300">{employee.name}</td>
                <td className="py-3 px-4 border-b border-gray-300">{employee.email}</td>
                <td className="py-3 px-4 border-b border-gray-300">
                  {employee.department || "N/A"}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">{employee.role}</td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Button */}
      <button
        onClick={handleAddEmployeeClick}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 mb-8"
      >
        Add Employee
      </button>

      {/* Employee Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded bg-white text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-white text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border rounded bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded bg-white text-gray-900"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {editEmployeeId ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      )}
    </div>
  );
}