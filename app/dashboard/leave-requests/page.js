"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/components/Loader"; 

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Loading for buttons

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

  const handleAction = async (id, status) => {
    setActionLoading(true);
    const response = await fetch(`/api/leave-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      alert(`Leave request ${status.toLowerCase()}!`);
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    } else {
      alert(`Failed to ${status.toLowerCase()} leave request.`);
    }
    setActionLoading(false);
  };

  return (
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Requests</h2>
      
      {loading ? (
        <Loader />
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
                    <td className="py-3 px-4 border-b border-gray-300">
                      {new Date(request.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-300">
                      {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-300">{request.status}</td>
                    <td className="py-3 px-4 border-b border-gray-300">
                      {request.status === "REVIEW" && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleAction(request.id, "APPROVED")}
                            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                              actionLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={actionLoading}
                          >
                            {actionLoading ? "Processing..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(request.id, "DECLINED")}
                            className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
                              actionLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={actionLoading}
                          >
                            {actionLoading ? "Processing..." : "Reject"}
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
