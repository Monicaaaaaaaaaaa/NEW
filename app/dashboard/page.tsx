"use client";
import { useState } from "react";

const invoices = [
  { irn: "28934728349284EU", payment: "Paid", type: "Bulk", sign: "True", date: "2025-11-04", time: "08:24:45", status: "Paid" },
  { irn: "28934728349284EU", payment: "Paid", type: "Bulk", sign: "False", date: "2025-11-04", time: "08:24:45", status: "Paid" },
  { irn: "28934728349284EU", payment: "Paid", type: "Bulk", sign: "False", date: "2025-11-04", time: "08:24:45", status: "Pending" },
  { irn: "28934728349284EU", payment: "Paid", type: "Single", sign: "True", date: "2025-11-04", time: "08:24:45", status: "Pending" },
  { irn: "28934728349284EU", payment: "Paid", type: "Single", sign: "True", date: "2025-11-04", time: "08:24:45", status: "Paid" },
  { irn: "28934728349284EU", payment: "Paid", type: "Bulk", sign: "True", date: "2025-11-04", time: "08:24:45", status: "Paid" },
  { irn: "28934728349284EU", payment: "Paid", type: "Single", sign: "True", date: "2025-11-04", time: "08:24:45", status: "Rejected" },
];

const statusStyles = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-orange-100 text-orange-500",
  Rejected: "bg-red-100 text-red-500",
};

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filtered = invoices.filter(
    (inv) =>
      inv.irn.toLowerCase().includes(search.toLowerCase()) ||
      inv.type.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-200 border-b border-gray-200 px-8 py-2 flex items-center justify-between">
        <img src="/logo.png" alt="eTranzact" className="h-16" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
              BP
            </div>
            <span className="text-sm font-medium text-gray-900">Bright Paul</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="px-18 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">NRS Invoice Dashboard</h1>
            <p className="text-sm text-gray-900 mt-1">Manage your NRS e-invoicing compliance</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
            <span className="text-lg leading-none">+</span> Create Invoice
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Invoice Submitted", value: "140", icon: "" },
            { label: "Successfully Signed", value: "120", icon: "" },
            { label: "Failed", value: "20", icon: "" },
            { label: "Success Rate", value: "78%", icon: "" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
              <div className="flex items-center gap-2 text-blue-500 text-sm mb-4">
                <span>{card.icon}</span>
                <span className="text-gray-900">{card.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by IRN, Invoice Type, Status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-800 px-4 py-1 rounded-lg text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
                Filter
              </button>
              <button className="border border-gray-200 p-2 rounded-lg text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </button>
              <button className="bg-blue-600 p-2 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">IRN</th>
                <th className="pb-3 font-medium">Payment Status</th>
                <th className="pb-3 font-medium">Invoice Type</th>
                <th className="pb-3 font-medium">Sign Status</th>
                <th className="pb-3 font-medium">Date Issued</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
                </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 text-gray-900">{inv.irn}</td>
                  <td className="py-4 text-gray-900">{inv.payment}</td>
                  <td className="py-4 text-gray-900">{inv.type}</td>
                  <td className="py-4 text-gray-900">{inv.sign}</td>
                  <td className="py-4 text-gray-900">
                    <span>{inv.date}</span>
                    <br />
                    <span className="text-gray-500 text-xs">{inv.time}</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-gray-400 hover:text-gray-600 text-lg">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-6 text-sm text-gray-300">
            <span>Total records: 39</span>
            <div className="flex items-center gap-2 text-gray-900">
              <span>Rows per page</span>
              <select className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <span className="text-gray-900">Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <button className="p-1 border border-gray-200 rounded text-gray-400">«</button>
              <button className="p-1 border border-gray-200 rounded text-gray-400">‹</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="p-1 border border-gray-200 rounded text-gray-800">›</button>
              <button className="p-1 border border-gray-200 rounded text-gray-800">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}