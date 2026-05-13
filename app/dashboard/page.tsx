"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type ApiInvoice = {
  id: number;
  irn: string;
  invoiceType: string;
  paymentStatus: string;
  isSigned: boolean;
  signedAt: string | null;
  issueDate: string | null;
  createdAt: string | null;
  signedResponse: string | null;
  merchantName: string | null;
  reference: string | null;
  dueDate: string | null;
  businessId: string;
  clientId: string;
};

type Invoice = {
  irn: string;
  payment: string;
  type: string;
  sign: string;
  date: string;
  time: string;
  status: "Paid" | "Pending" | "Rejected";
};

type PaginationMeta = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type Card = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

const statusStyles: Record<Invoice["status"], string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-orange-100 text-orange-500",
  Rejected: "bg-red-100 text-red-500",
};

/** Derive a display status from the API invoice fields */
function deriveStatus(inv: ApiInvoice): Invoice["status"] {
  if (inv.signedResponse) {
    try {
      const parsed = JSON.parse(inv.signedResponse);
      if (parsed?.success === false) return "Rejected";
    } catch {
      // ignore parse errors
    }
  }
  if (inv.isSigned) return "Paid";
  return "Pending";
}

function formatDate(dateStr: string | null): { date: string; time: string } {
  if (!dateStr) return { date: "—", time: "" };
  const d = new Date(dateStr);
  return {
    date: d.toISOString().split("T")[0],
    time: d.toTimeString().split(" ")[0],
  };
}

function mapApiInvoice(inv: ApiInvoice): Invoice {
  const { date, time } = formatDate(inv.issueDate || inv.createdAt || inv.signedAt);
  return {
    irn: inv.irn,
    payment: inv.paymentStatus
      ? inv.paymentStatus.charAt(0) + inv.paymentStatus.slice(1).toLowerCase()
      : "—",
    type: inv.invoiceType ?? "—",
    sign: inv.isSigned ? "True" : "False",
    date,
    time,
    status: deriveStatus(inv),
  };
}

function CardIcon({ path }: { path: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, size: 10, totalElements: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Summary stats derived from current page; for totals use meta.totalElements
  const signed = invoices.filter((i) => i.sign === "True").length;
  const failed = invoices.filter((i) => i.status === "Rejected").length;
  const successRate =
    invoices.length > 0 ? Math.round((signed / invoices.length) * 100) : 0;

  const cards: Card[] = [
    {
      label: "Total Invoice Submitted",
      value: meta.totalElements,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: "Successfully Signed",
      value: signed,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2"/>
          <path d="M8 10h8"/><path d="M8 14h4"/>
          <path d="M14 14l2 2 4-4"/>
        </svg>
      ),
    },
    {
      label: "Failed",
      value: failed,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
          <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      ),
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
        </svg>
      ),
    },
  ];

  const fetchInvoices = useCallback(async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/v1/invoice?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      const data = json.data;
      setMeta({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
      setInvoices((data.content as ApiInvoice[]).map(mapApiInvoice));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchInvoices(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, fetchInvoices, router]);

  const filtered = invoices.filter(
    (inv) =>
      inv.irn.toLowerCase().includes(search.toLowerCase()) ||
      inv.type.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/v1/invoice/download/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoices.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
              <div className="flex items-center gap-2 text-sm mb-4">
                {card.icon}
                <span className="text-gray-900">{card.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block w-12 h-8 bg-gray-200 animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
                Filter
              </button>
              <button
                onClick={() => fetchInvoices(currentPage, rowsPerPage)}
                title="Refresh"
                className="border border-gray-200 p-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </button>
              <button
                onClick={handleDownload}
                title="Download invoices"
                className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchInvoices(currentPage, rowsPerPage)}
                className="text-red-700 underline text-xs"
              >
                Retry
              </button>
            </div>
          )}

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
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="py-4">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No invoices found
                  </td>
                </tr>
              ) : (
                filtered.map((inv, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 text-gray-900 font-mono text-xs">{inv.irn}</td>
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
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 text-sm text-gray-300">
            <span className="text-gray-500">
              Total records: <span className="font-medium text-gray-700">{meta.totalElements}</span>
            </span>
            <div className="flex items-center gap-2 text-gray-900">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <span className="text-gray-900">
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1 border border-gray-200 rounded text-gray-400 disabled:opacity-40"
              >«</button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 border border-gray-200 rounded text-gray-400 disabled:opacity-40"
              >‹</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                {currentPage}
              </button>
              <button
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                className="p-1 border border-gray-200 rounded text-gray-800 disabled:opacity-40"
              >›</button>
              <button
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage(meta.totalPages)}
                className="p-1 border border-gray-200 rounded text-gray-800 disabled:opacity-40"
              >»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}