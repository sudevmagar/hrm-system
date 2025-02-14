"use client";

import { useEffect, useState } from "react";

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        const response = await fetch("/api/leave-requests");
        const data = await response.json();
        if (response.ok) {
          setLeaveRequests(data.leaveRequests);
        } else {
          console.error("Failed to fetch leave requests:", data.error);
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (id) => {
    const response = await fetch(`/api/leave-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "APPROVED" }),
    });

    if (response.ok) {
      alert("Leave request approved!");
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "APPROVED" } : request
        )
      );
    } else {
      alert("Failed to approve leave request.");
    }
  };

  const handleReject = async (id) => {
    const response = await fetch(`/api/leave-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "REJECTED" }),
    });

    if (response.ok) {
      alert("Leave request rejected!");
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "REJECTED" } : request
        )
      );
    } else {
      alert("Failed to reject leave request.");
    }
  };

  return (
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Requests</h2>
      {loading ? (
        <p className="text-gray-600">Loading leave requests...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-900 rounded-lg overflow-hidden border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b border-gray-300 text-left">Employee</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Type</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Subject</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Start Date</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">End Date</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Status</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-100 transition">
                    <td className="py-3 px-4 border-b border-gray-300">{request.user.name}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{request.type}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{request.subject}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{new Date(request.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{new Date(request.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{request.status}</td>
                    <td className="py-3 px-4 border-b border-gray-300">
                      {request.status === "PENDING" && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    No leave requests found.
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
