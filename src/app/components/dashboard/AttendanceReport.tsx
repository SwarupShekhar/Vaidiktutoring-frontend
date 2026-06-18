"use client";

import React from "react";
import { AlertCircle, Download } from "lucide-react";
import {
  useAttendanceReport,
  type AttendanceSession,
  type AttendanceStatus,
} from "@/app/Hooks/useAttendanceReport";

interface AttendanceReportProps {
  studentId?: string | null;
}

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-green-50 border-green-100 text-green-700",
  late: "bg-amber-50 border-amber-100 text-amber-700",
  absent: "bg-red-50 border-red-100 text-red-700",
};

const STATUS_DOT: Record<AttendanceStatus, string> = {
  present: "bg-green-500",
  late: "bg-amber-500",
  absent: "bg-red-500",
};

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatMinutes(mins: number | null): string {
  if (mins == null) return "—";
  return `${mins} min`;
}

/** Escape a value for safe inclusion in a CSV cell. */
function csvCell(value: string | number | null): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function buildCsv(studentName: string, sessions: AttendanceSession[]): string {
  const header = [
    "Title",
    "Scheduled Start",
    "Status",
    "Joined At",
    "Left At",
    "Minutes Attended",
  ];
  const rows = sessions.map((s) => [
    csvCell(s.title),
    csvCell(s.scheduledStart),
    csvCell(STATUS_LABEL[s.status]),
    csvCell(s.joinedAt),
    csvCell(s.leftAt),
    csvCell(s.minutesAttended),
  ].join(","));
  return [header.map(csvCell).join(","), ...rows].join("\r\n");
}

function downloadCsv(studentName: string, sessions: AttendanceSession[]) {
  const csv = buildCsv(studentName, sessions);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = studentName.replace(/[^a-z0-9]+/gi, "_").toLowerCase() || "student";
  link.href = url;
  link.download = `attendance_${safeName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AttendanceReport({ studentId }: AttendanceReportProps) {
  const { report, loading, error } = useAttendanceReport(studentId);

  if (!studentId) {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-xs text-blue-600 font-medium uppercase tracking-widest">
          Select a student to view their attendance report.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4 space-y-3 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle size={18} className="text-red-500 shrink-0" />
        <p className="text-xs text-red-700 font-medium">
          We couldn&apos;t load the attendance report. Please try again later.
        </p>
      </div>
    );
  }

  if (!report) return null;

  const { summary, sessions, studentName } = report;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Attendance Report
        </h3>
        <button
          type="button"
          onClick={() => downloadCsv(studentName, sessions)}
          disabled={sessions.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-black hover:border-gray-300 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Summary row */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-tight">
            Attendance Rate
          </span>
          <span className="text-lg font-black text-blue-900">
            {summary.attendanceRate}%
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/70 rounded-xl p-2.5 text-center">
            <div className="text-base font-black text-green-600">{summary.attended}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              Attended
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-2.5 text-center">
            <div className="text-base font-black text-amber-600">{summary.late}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              Late
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-2.5 text-center">
            <div className="text-base font-black text-red-600">{summary.absent}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              Absent
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-2.5 text-center">
            <div className="text-base font-black text-blue-700">{summary.totalMinutes}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              Total Minutes
            </div>
          </div>
        </div>
        <p className="text-[10px] text-blue-600 font-medium mt-3 uppercase tracking-widest">
          {summary.totalSessions} session{summary.totalSessions === 1 ? "" : "s"} total
        </p>
      </div>

      {/* Sessions table */}
      {sessions.length === 0 ? (
        <p className="text-xs italic text-text-secondary opacity-50 text-center py-4">
          No attendance records yet
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["Session", "Date", "Status", "Join", "Leave", "Minutes"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-[9px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.sessionId}
                  className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-3 py-2.5 text-xs font-bold text-gray-900">{s.title}</td>
                  <td className="px-3 py-2.5 text-[11px] text-gray-600 whitespace-nowrap">
                    {formatDate(s.scheduledStart)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold uppercase ${STATUS_STYLES[s.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s.status]}`} />
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-gray-600 whitespace-nowrap">
                    {formatTime(s.joinedAt)}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-gray-600 whitespace-nowrap">
                    {formatTime(s.leftAt)}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-medium text-gray-700 whitespace-nowrap">
                    {formatMinutes(s.minutesAttended)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
