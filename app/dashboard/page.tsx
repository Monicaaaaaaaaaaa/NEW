"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import HTTP from "@/services/http-client";
import Button from "@/components/ui/button";
import {
  Users,
  FileCheck,
  ArrowUpDown,
  Trophy,
  Search,
  ListFilter,
  Download,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  RefreshCw,
} from "@/icons";

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

function deriveStatus(inv: ApiInvoice): Invoice["status"] {
  if (inv.signedResponse) {
    try {
      const parsed = JSON.parse(inv.signedResponse);
      if (parsed?.success === false) return "Rejected";
    } catch {}
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
  const { date, time } = formatDate(
    inv.issueDate || inv.createdAt || inv.signedAt,
  );
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

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signed = invoices.filter((i) => i.sign === "True").length;
  const failed = invoices.filter((i) => i.status === "Rejected").length;
  const successRate =
    invoices.length > 0 ? Math.round((signed / invoices.length) * 100) : 0;

  const cards: Card[] = [
    {
      label: "Total Invoice Submitted",
      value: meta.totalElements,
      icon: <Users size={20} className="text-blue-500" />,
    },
    {
      label: "Successfully Signed",
      value: signed,
      icon: <FileCheck size={20} className="text-blue-500" />,
    },
    {
      label: "Failed",
      value: failed,
      icon: <ArrowUpDown size={20} className="text-blue-500" />,
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: <Trophy size={20} className="text-blue-500" />,
    },
  ];

  const fetchInvoices = useCallback(async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data: json } = await HTTP.get("/invoice", {
        params: { page, size },
      });
      const data = json.data;
      setMeta({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
      setInvoices((data.content as ApiInvoice[]).map(mapApiInvoice));
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch invoices";
      setError(message);
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
      inv.status.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDownload = async () => {
    try {
      const response = await HTTP.get("/invoice/download/invoice", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoices.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await HTTP.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-200 border-b border-gray-200 px-8 py-2 flex items-center justify-between">
        <img src="/logo.png" alt="eTranzact" className="h-16" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
              BP
            </div>
            <span className="text-sm font-medium text-gray-900">
              Bright Paul
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="px-18 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              NRS Invoice Dashboard
            </h1>
            <p className="text-sm text-gray-900 mt-1">
              Manage your NRS e-invoicing compliance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              title="Users"
              icon={Users}
              variant="outline-primary"
              rounded="lg"
              onClick={() => router.push("/users")}
            />
            <Button
              title="Create Invoice"
              icon={Plus}
              variant="danger"
              type="button"
              onClick={() => {}}
              rounded="lg"
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-md"
            >
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

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
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
                <ListFilter size={14} />
                Filter
              </button>
              <button
                onClick={() => fetchInvoices(currentPage, rowsPerPage)}
                title="Refresh"
                className="border border-gray-200 p-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={handleDownload}
                title="Download invoices"
                className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700"
              >
                <Download size={14} />
              </button>
            </div>
          </div>

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
                  <tr
                    key={i}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 text-gray-900 font-mono text-xs">
                      {inv.irn}
                    </td>
                    <td className="py-4 text-gray-900">{inv.payment}</td>
                    <td className="py-4 text-gray-900">{inv.type}</td>
                    <td className="py-4 text-gray-900">{inv.sign}</td>
                    <td className="py-4 text-gray-900">
                      <span>{inv.date}</span>
                      <br />
                      <span className="text-gray-500 text-xs">{inv.time}</span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-6 text-sm">
            <span className="text-gray-500">
              Total records:{" "}
              <span className="font-medium text-gray-700">
                {meta.totalElements}
              </span>
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
              >
                <ChevronLeft size={10} />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 border border-gray-200 rounded text-gray-400 disabled:opacity-40"
              >
                <ChevronsLeft size={10} />
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                {currentPage}
              </button>
              <button
                disabled={currentPage === meta.totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(meta.totalPages, p + 1))
                }
                className="p-1 border border-gray-200 rounded text-gray-800 disabled:opacity-40"
              >
                <ChevronsRight size={10} />
              </button>
              <button
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage(meta.totalPages)}
                className="p-1 border border-gray-200 rounded text-gray-800 disabled:opacity-40"
              >
                <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
