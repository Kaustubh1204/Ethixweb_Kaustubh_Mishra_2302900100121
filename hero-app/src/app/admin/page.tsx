"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface Lead {
  id: string;
  name: string;
  email: string;
  project_subject: string;
  projectSubject?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  created_at: string;
  updated_at: string;
}

interface Metrics {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  closed: number;
}

// Strictly Black & White (Monochrome & Grayscale) Badges
const STATUS_BADGES: Record<string, { bg: string; text: string; dot: string }> = {
  new: { bg: "bg-black text-white border-black", text: "text-white", dot: "bg-white" },
  contacted: { bg: "bg-neutral-800 text-white border-neutral-800", text: "text-white", dot: "bg-neutral-300" },
  qualified: { bg: "bg-neutral-200 text-black border-neutral-300", text: "text-black", dot: "bg-black" },
  closed: { bg: "bg-neutral-100 text-neutral-600 border-neutral-200", text: "text-neutral-600", dot: "bg-neutral-400" },
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Leads & Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, new: 0, contacted: 0, qualified: 0, closed: 0 });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"Day" | "Week" | "Month" | "Year">("Month");
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  // Selected lead for detail drawer
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const savedToken = localStorage.getItem("ethixweb_admin_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const fetchLeads = useCallback(
    async (authToken: string, filter: string = statusFilter) => {
      setLeadsLoading(true);
      setLeadsError(null);
      try {
        const query = filter !== "all" ? `?status=${filter}` : "";
        const res = await fetch(`${apiUrl}/api/admin/leads${query}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("ethixweb_admin_token");
          setToken(null);
          setLeadsError("Session expired. Please log in again.");
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setLeadsError(data?.error?.message || "Failed to load enquiries.");
          return;
        }

        setLeads(data.data.leads || []);
        if (data.data.metrics) {
          setMetrics(data.data.metrics);
        }
      } catch (err) {
        setLeadsError("Network error while loading leads. Please check backend.");
      } finally {
        setLeadsLoading(false);
      }
    },
    [apiUrl, statusFilter]
  );

  useEffect(() => {
    if (token) {
      fetchLeads(token, statusFilter);
    }
  }, [token, statusFilter, fetchLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data?.error?.message || "Invalid credentials.");
        setAuthLoading(false);
        return;
      }

      const receivedToken = data.data.token;
      setToken(receivedToken);
      localStorage.setItem("ethixweb_admin_token", receivedToken);
      setPasswordInput("");
    } catch (err) {
      setAuthError("Failed to reach server. Please ensure backend is running.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${apiUrl}/api/admin/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("ethixweb_admin_token");
      setToken(null);
      setSelectedLead(null);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    if (!token) return;
    setActionLoading(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`${apiUrl}/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionFeedback({
          type: "error",
          text: data?.error?.message || "Failed to update status.",
        });
        return;
      }

      setActionFeedback({
        type: "success",
        text: `Lead marked as ${newStatus}.`,
      });
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as any });
      }
      fetchLeads(token, statusFilter);
    } catch (err) {
      setActionFeedback({ type: "error", text: "Network error updating status." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!token) return;
    setActionLoading(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`${apiUrl}/api/admin/leads/${leadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setActionFeedback({
          type: "error",
          text: data?.error?.message || "Failed to delete lead.",
        });
        return;
      }

      setShowDeleteConfirm(false);
      setSelectedLead(null);
      fetchLeads(token, statusFilter);
    } catch (err) {
      setActionFeedback({ type: "error", text: "Network error deleting lead." });
    } finally {
      setActionLoading(false);
    }
  };

  // Local search filter
  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const subject = lead.project_subject || lead.projectSubject || "";
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      subject.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-black font-sans selection:bg-black selection:text-white pt-24 pb-16 px-3 sm:px-6 lg:px-10">
      {/* 1. Login State */}
      {!token ? (
        <div className="max-w-md mx-auto mt-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-[32px] bg-white border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-mono text-[11px] font-semibold uppercase tracking-wider mb-3">
                EthixWeb Operations
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-black">
                Admin Portal
              </h1>
              <p className="text-sm text-neutral-500 mt-2">
                Sign in to manage enquiries and agency operations
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 rounded-2xl bg-neutral-100 border border-neutral-300 text-black text-xs font-mono font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors text-black"
                  placeholder="admin@ethixweb.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors text-black"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-2xl bg-black text-white font-medium text-xs uppercase tracking-wider hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {authLoading ? "Authenticating..." : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-400 font-mono">
              Protected by JWT & Server-Side Security
            </div>
          </motion.div>
        </div>
      ) : (
        /* 2. Main Minimal Clay/Pill Dashboard Shell (Strict Black & White) */
        <div className="max-w-[1520px] mx-auto flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 bg-white rounded-[32px] p-6 border border-neutral-200 shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="space-y-8">
              {/* Brand Logo */}
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  E
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-black leading-tight">
                    Ethix<span className="font-light">Web</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Operations
                  </div>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1.5 text-sm font-medium">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-black text-white shadow-sm font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </button>

                <button
                  onClick={() => setStatusFilter("new")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    statusFilter === "new"
                      ? "bg-black text-white shadow-sm font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Leads
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusFilter === "new" ? "bg-white text-black font-bold" : "bg-neutral-200 text-black font-bold"}`}>
                    {metrics.new}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("contacted")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    statusFilter === "contacted"
                      ? "bg-black text-white shadow-sm font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contacted
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusFilter === "contacted" ? "bg-white text-black font-bold" : "bg-neutral-100 text-neutral-700"}`}>
                    {metrics.contacted}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("qualified")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    statusFilter === "qualified"
                      ? "bg-black text-white shadow-sm font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Qualified
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusFilter === "qualified" ? "bg-white text-black font-bold" : "bg-neutral-200 text-black font-bold"}`}>
                    {metrics.qualified}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("closed")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    statusFilter === "closed"
                      ? "bg-black text-white shadow-sm font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Closed
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusFilter === "closed" ? "bg-white text-black font-bold" : "bg-neutral-100 text-neutral-700"}`}>
                    {metrics.closed}
                  </span>
                </button>
              </nav>

              {/* Dark Box */}
              <div className="rounded-[28px] p-5 bg-black text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm font-semibold tracking-tight">Active Pipeline</div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Live Neon PostgreSQL server-side connection active.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-mono text-white font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Online
                    </span>
                    <button
                      onClick={() => fetchLeads(token, statusFilter)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-mono transition-colors cursor-pointer"
                    >
                      Sync
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-100 space-y-2 text-sm font-medium">
              <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            {/* Top Bar (Title + Search + Time Tabs + Date Filter + Avatar) */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-black">
                  Dashboard
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Real-time agency enquiries and pipeline analytics
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar with pill style */}
                <div className="relative min-w-[220px] sm:w-64">
                  <svg
                    className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-full pl-10 pr-8 py-2.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-black text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Day / Week / Month / Year Pills */}
                <div className="bg-white border border-neutral-300 rounded-full p-1 flex items-center shadow-sm">
                  {(["Day", "Week", "Month", "Year"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTimeRange(tab)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        timeRange === tab
                          ? "bg-black text-white font-semibold shadow-xs"
                          : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Date Range Badge */}
                <div className="hidden xl:flex items-center gap-2 bg-white border border-neutral-300 rounded-full px-4 py-2 text-xs text-neutral-700 shadow-sm font-mono">
                  <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Live Pipeline
                </div>

                {/* Notification Bell */}
                <button
                  onClick={() => fetchLeads(token, statusFilter)}
                  title="Refresh Enquiries"
                  className="w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-black transition-colors shadow-sm cursor-pointer"
                >
                  <svg className={`w-4 h-4 ${leadsLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Avatar Badge */}
                <div className="w-10 h-10 rounded-full bg-black border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold uppercase">
                  AD
                </div>
              </div>
            </header>

            {/* 4 Metric Cards Row (Monochrome Black & White) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card 1: Total Enquiries (Black Hero Card) */}
              <div className="rounded-[28px] p-6 bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex flex-col justify-between">
                <div>
                  <span className="text-xs text-neutral-400 font-medium">Total Enquiries</span>
                  <div className="text-3xl font-bold tracking-tight text-white mt-3">
                    {metrics.total}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>100% database recorded</span>
                </div>
              </div>

              {/* Card 2: New Enquiries */}
              <div className="rounded-[28px] p-6 bg-white border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-medium">New Enquiries</span>
                  <div className="text-3xl font-bold tracking-tight text-black mt-3">
                    {metrics.new}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span>Awaiting First Contact</span>
                </div>
              </div>

              {/* Card 3: Contacted Enquiries */}
              <div className="rounded-[28px] p-6 bg-white border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-medium">Contacted</span>
                  <div className="text-3xl font-bold tracking-tight text-black mt-3">
                    {metrics.contacted}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span>In Dialogue / Follow Up</span>
                </div>
              </div>

              {/* Card 4: Qualified Leads */}
              <div className="rounded-[28px] p-6 bg-white border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-medium">Qualified Leads</span>
                  <div className="text-3xl font-bold tracking-tight text-black mt-3">
                    {metrics.qualified}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span>High Intent Clients</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Bar Chart & Mini Calendar/Growth Card (Monochrome Grayscale) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Pipeline Breakdown Bar Chart Card */}
              <div className="lg:col-span-8 bg-white rounded-[32px] p-6 sm:p-8 border border-neutral-200 shadow-[0_10px_35px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                  <div>
                    <h2 className="text-base font-semibold text-black">
                      Pipeline Volume & Activity
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Visual comparison across lead qualification stages
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                    ↗
                  </div>
                </div>

                {/* Rounded Bar Chart in Grayscale Shades */}
                <div className="pt-8 pb-4">
                  <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6">
                    {/* New */}
                    <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                      <div
                        className="w-full max-w-[64px] bg-black rounded-2xl transition-all duration-500 relative group"
                        style={{
                          height: `${Math.max(15, (metrics.new / Math.max(metrics.total, 1)) * 100)}%`,
                        }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {metrics.new}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-700">New</span>
                    </div>

                    {/* Contacted */}
                    <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                      <div
                        className="w-full max-w-[64px] bg-neutral-600 rounded-2xl transition-all duration-500 relative group"
                        style={{
                          height: `${Math.max(15, (metrics.contacted / Math.max(metrics.total, 1)) * 100)}%`,
                        }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {metrics.contacted}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-700">Contacted</span>
                    </div>

                    {/* Qualified */}
                    <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                      <div
                        className="w-full max-w-[64px] bg-neutral-400 rounded-2xl transition-all duration-500 relative group"
                        style={{
                          height: `${Math.max(15, (metrics.qualified / Math.max(metrics.total, 1)) * 100)}%`,
                        }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {metrics.qualified}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-700">Qualified</span>
                    </div>

                    {/* Closed */}
                    <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                      <div
                        className="w-full max-w-[64px] bg-neutral-200 rounded-2xl transition-all duration-500 relative group"
                        style={{
                          height: `${Math.max(15, (metrics.closed / Math.max(metrics.total, 1)) * 100)}%`,
                        }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {metrics.closed}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-700">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Calendar Strip & Conversion Card */}
              <div className="lg:col-span-4 bg-white rounded-[32px] p-6 sm:p-8 border border-neutral-200 shadow-[0_10px_35px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                    <span className="text-xs font-bold text-black">October 2026</span>
                    <div className="flex items-center gap-1 text-neutral-400 text-xs">
                      <span className="cursor-pointer hover:text-black">‹</span>
                      <span className="cursor-pointer hover:text-black">›</span>
                    </div>
                  </div>

                  {/* Day Pills Strip (B&W Style with active black pill) */}
                  <div className="grid grid-cols-5 gap-2 pt-4 text-center">
                    <div>
                      <span className="text-[11px] text-neutral-400">Tue</span>
                      <div className="mt-2 text-xs font-semibold text-neutral-700 py-2">13</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-neutral-400">Wed</span>
                      <div className="mt-2 text-xs font-semibold text-neutral-700 py-2">14</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-black font-bold">Thu</span>
                      <div className="mt-2 text-xs font-bold bg-black text-white rounded-2xl py-2.5 shadow-md">
                        15
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-neutral-400">Fri</span>
                      <div className="mt-2 text-xs font-semibold text-neutral-700 py-2">16</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-neutral-400">Sat</span>
                      <div className="mt-2 text-xs font-semibold text-neutral-700 py-2">17</div>
                    </div>
                  </div>
                </div>

                {/* Conversion Widget with Circular Ring */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-black">Enquiry Conversion</div>
                    <div className="text-[11px] text-neutral-600 font-medium mt-0.5 flex items-center gap-1">
                      <span>↗</span>
                      <span>
                        {metrics.total > 0
                          ? Math.round((metrics.qualified / metrics.total) * 100)
                          : 0}
                        % qualification rate
                      </span>
                    </div>
                  </div>

                  {/* Circle Indicator */}
                  <div className="w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center font-bold text-xs text-black shadow-xs">
                    {metrics.total > 0
                      ? `${Math.round((metrics.qualified / metrics.total) * 100)}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Enquiries Table (Styled like Course Purchases) */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-neutral-200 shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
              {/* Header row with Title + Refresh + Arrow */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Customer Enquiries
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Live client contact submissions stored in PostgreSQL
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchLeads(token, statusFilter)}
                    disabled={leadsLoading}
                    className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                    title="Refresh data"
                  >
                    <svg
                      className={`w-4 h-4 ${leadsLoading ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm">
                    ↗
                  </div>
                </div>
              </div>

              {/* Table Data */}
              {leadsError ? (
                <div className="py-12 text-center">
                  <div className="text-black font-mono text-xs">{leadsError}</div>
                  <button
                    onClick={() => fetchLeads(token, statusFilter)}
                    className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-xs font-mono"
                  >
                    Retry
                  </button>
                </div>
              ) : leadsLoading ? (
                <div className="py-16 text-center text-neutral-400 font-mono text-xs flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Syncing live records...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 text-xs font-mono">
                  {searchQuery
                    ? "No enquiries match your search query."
                    : "No enquiries found in this category."}
                </div>
              ) : (
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 font-medium">
                        <th className="py-4 px-4 font-normal">Client Name</th>
                        <th className="py-4 px-4 font-normal">Contact Email</th>
                        <th className="py-4 px-4 font-normal">Project Subject</th>
                        <th className="py-4 px-4 font-normal">Date</th>
                        <th className="py-4 px-4 font-normal">Status</th>
                        <th className="py-4 px-4 font-normal text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 text-neutral-800 font-medium">
                      {filteredLeads.map((lead) => {
                        const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.new;
                        const subject = lead.project_subject || lead.projectSubject;
                        const dateFormatted = new Date(lead.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        );

                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-neutral-50 transition-colors"
                          >
                            {/* Client Name with icon/avatar */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-black text-xs">
                                  {lead.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-black">
                                  {lead.name}
                                </span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-4 px-4 text-neutral-500 font-mono">
                              {lead.email}
                            </td>

                            {/* Project Subject */}
                            <td className="py-4 px-4 text-neutral-800 max-w-xs truncate">
                              {subject}
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 text-neutral-400 font-mono">
                              {dateFormatted}
                            </td>

                            {/* Status Pill Badge (Monochrome) */}
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                <span className="capitalize">{lead.status}</span>
                              </span>
                            </td>

                            {/* View Action Pill */}
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setActionFeedback(null);
                                  setShowDeleteConfirm(false);
                                }}
                                className="px-3.5 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* 3. Detail Drawer / Modal in Strict Black & White */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-[36px] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    {selectedLead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black leading-tight">
                      {selectedLead.name}
                    </h2>
                    <span className="text-xs font-mono text-neutral-400">
                      ID: {selectedLead.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Action alert message */}
              {actionFeedback && (
                <div
                  className={`mt-4 p-3 rounded-2xl text-xs font-mono ${
                    actionFeedback.type === "success"
                      ? "bg-black text-white"
                      : "bg-neutral-100 border border-neutral-300 text-black"
                  }`}
                >
                  {actionFeedback.text}
                </div>
              )}

              {/* Body */}
              <div className="space-y-5 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block mb-1">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-sm font-semibold text-black hover:underline flex items-center gap-1.5"
                    >
                      {selectedLead.email} ↗
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block mb-1">
                      Submitted Date
                    </span>
                    <span className="text-sm text-neutral-700 font-mono">
                      {new Date(selectedLead.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block mb-1">
                    Project Subject
                  </span>
                  <div className="text-sm font-semibold text-black">
                    {selectedLead.project_subject || selectedLead.projectSubject}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block mb-2">
                    Client Message
                  </span>
                  <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </div>
                </div>

                {/* Workflow Status Controls */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-black block">
                      Update Lead Stage
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Sync state directly with Neon PostgreSQL
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["new", "contacted", "qualified", "closed"] as const).map((stage) => (
                      <button
                        key={stage}
                        disabled={actionLoading || selectedLead.status === stage}
                        onClick={() => handleUpdateStatus(selectedLead.id, stage)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedLead.status === stage
                            ? "bg-black text-white shadow-sm"
                            : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delete / Actions Footer */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-xs font-medium text-neutral-600 hover:text-black cursor-pointer underline"
                    >
                      Delete Enquiry
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-black font-medium">Confirm delete?</span>
                      <button
                        onClick={() => handleDeleteLead(selectedLead.id)}
                        disabled={actionLoading}
                        className="px-3.5 py-1 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        {actionLoading ? "Deleting..." : "Yes, Delete"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3.5 py-1 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
