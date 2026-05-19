"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import HTTP from "@/services/http-client";
import {
  Search,
  Plus,
  Settings,
  LogOut,
  MoreVertical,
  X,
  Bell,
  Users,
  ShieldCheck,
  Calculator,
  FileText,
  BarChart2,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  Pencil,
  ToggleRight,
  Home,
  SlidersHorizontal,
} from "lucide-react";

type ApiUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  roleName: string[];
  status: "ACTIVE" | "DISABLE";
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Disable";
};

type PaginationMeta = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type NewAdminForm = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  department: string;
};

type FilterType = "All" | "Active" | "Disable";

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.roleName?.[0] ?? "—",
    status: u.status === "ACTIVE" ? "Active" : "Disable",
  };
}

function toApiStatus(filter: FilterType): string | undefined {
  if (filter === "Active") return "ACTIVE";
  if (filter === "Disable") return "DISABLE";
  return undefined;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, size: 10, totalElements: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<NewAdminForm>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    department: "",
  });

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async (
    page: number,
    size: number,
    searchQuery: string,
    statusFilter: FilterType
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, size };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const apiStatus = toApiStatus(statusFilter);
      if (apiStatus) params.status = apiStatus;

      const { data: json } = await HTTP.get("/user", { params });
      const data = json.data;
      setMeta({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: Math.max(1, data.totalPages),
      });
      setUsers((data.content as ApiUser[]).map(mapApiUser));
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch users";
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
    fetchUsers(currentPage, rowsPerPage, search, filter);
  }, [currentPage, rowsPerPage, filter, fetchUsers, router]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, rowsPerPage, search, filter);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  const totalPages = Math.max(1, meta.totalPages);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await HTTP.post("/user", {
        firstName: form.firstName,
        lastName: form.lastName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        department: form.department,
      });
      setShowModal(false);
      setForm({ firstName: "", lastName: "", mobileNumber: "", email: "", department: "" });
      fetchUsers(currentPage, rowsPerPage, search, filter);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to create user";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setOpenActionId(null);
    try {
      await HTTP.put(`/user/${user.id}`, {
        status: user.status === "Active" ? "DISABLE" : "ACTIVE",
      });
      fetchUsers(currentPage, rowsPerPage, search, filter);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to update user";
      alert(message);
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
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-6 pt-4 pb-4 border-b border-gray-100">
          <img src="/logo.png" alt="eTranzact" className="h-20" />
        </div>

        <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4b5d79] hover:bg-blue-50 hover:text-blue-600 text-sm transition-colors"
          >
            <Home size={17} strokeWidth={1.6} />
            <span>Dashboard</span>
          </button>

          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 pt-5 pb-2">
            Your Business
          </p>

          <button
            onClick={() => router.push("/roles")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4b5d79] hover:bg-blue-50 hover:text-blue-600 text-sm transition-colors"
          >
            <ShieldCheck size={17} strokeWidth={1.6} />
            <span>Roles</span>
          </button>

          <button
            onClick={() => router.push("/vat-automation")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4b5d79] hover:bg-blue-50 hover:text-blue-600 text-sm transition-colors"
          >
            <Calculator size={17} strokeWidth={1.6} />
            <span>VAT Automation</span>
          </button>

          <button
            onClick={() => router.push("/invoicing")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[#4b5d79] hover:bg-blue-50 hover:text-blue-600 text-sm transition-colors"
          >
            <span className="flex items-center gap-3">
              <FileText size={17} strokeWidth={1.6} />
              E-Invoicing
            </span>
            <ChevronRight size={14} strokeWidth={1.6} />
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
          >
            <Users size={17} strokeWidth={1.6} />
            <span>User Management</span>
          </button>

          <button
            onClick={() => router.push("/report")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[#4b5d79] hover:bg-blue-50 hover:text-blue-600 text-sm transition-colors"
          >
            <span className="flex items-center gap-3">
              <BarChart2 size={17} strokeWidth={1.6} />
              Report
            </span>
            <ChevronRight size={14} strokeWidth={1.6} />
          </button>

          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 pt-5 pb-2">
            Others
          </p>

          <button
            onClick={() => router.push("/settings")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4b5d79] hover:bg-blue-50 hover:text-blue-600 text-sm transition-colors"
          >
            <Settings size={17} strokeWidth={1.6} />
            <span>Settings</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
        >
          <LogOut size={17} strokeWidth={1.6} />
          Logout
        </button>
        <div className="flex items-center gap-3 px-3 pb-4">
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
          >
            AS
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Andrew Smith</p>
            <p className="text-xs text-gray-400">Superadmin</p>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
            >
              User Management
            </h1>
            <p className="text-sm text-[#4b5d79] mt-1 font-medium">
              {meta.totalElements} Users onboarded on FIRS E-Invoicing
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2.5">
            <div className="relative">
              <Bell size={18} className="fill-blue-700 text-blue-700" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
            >
              <Plus size={14} />
              Create Admin
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 w-52 bg-gray-50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
                  <Search size={15} />
                </span>
              </div>
              <div className="flex items-center gap-5">
                {(["All", "Active", "Disable"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterChange(f)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      filter === f ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      f === "All" ? "bg-blue-500" : f === "Active" ? "bg-green-500" : "bg-red-500"
                    }`} />
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 text-sm font-bold text-gray-800 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={14} />
              Column
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchUsers(currentPage, rowsPerPage, search, filter)}
                className="text-red-700 underline text-xs"
              >
                Retry
              </button>
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left">
                <th className="px-6 py-3 font-bold text-gray-900 w-16">#</th>
                <th className="px-6 py-3 font-bold text-gray-900">User Information</th>
                <th className="px-6 py-3 font-bold text-gray-900">Role</th>
                <th className="px-6 py-3 font-bold text-gray-900">Status</th>
                <th className="px-6 py-3 font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found</td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {(currentPage - 1) * rowsPerPage + i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        user.status === "Active" ? "text-green-600" : "text-red-500"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          user.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() => setOpenActionId(openActionId === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openActionId === user.id && (
                        <div className="absolute right-10 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 py-1.5 overflow-hidden">
                          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Pencil size={13} className="text-blue-500" />
                            Edit User
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <ToggleRight size={13} className="text-gray-400" />
                            {user.status === "Active" ? "Disable User" : "Enable User"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
            <span>Total records: <span className="font-medium text-gray-700">{meta.totalElements}</span></span>
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <span>Page {meta.page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-400 disabled:opacity-40 hover:bg-gray-50">
                <ChevronsLeft size={15} />
              </button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-400 disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft size={15} />
              </button>
              <button
                className="px-3 py-1 text-white rounded-lg font-medium min-w-[32px]"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
              >
                {currentPage}
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-700 disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight size={15} />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-700 disabled:opacity-40 hover:bg-gray-50">
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">New Admin</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-7 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5 font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5 font-medium">Department</label>
                <div className="relative">
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-gray-50 appearance-none pr-10"
                  >
                    <option value="">Select</option>
                    <option value="engineering">Engineering</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                    <option value="hr">Human Resources</option>
                  </select>
                  <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-7 pb-6 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="flex-1 text-white py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openActionId !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenActionId(null)} />
      )}
    </div>
  );
}