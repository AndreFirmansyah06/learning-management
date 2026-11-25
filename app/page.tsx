import React from "react";
import Link from "next/link";
import { Navbar } from "./components/Navbar";
import {
  BookOpenIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlusIcon,
} from "./components/icons";

export default function DashboardPage() {
  // Mock summary data based on API collection & requirements
  const stats = [
    {
      id: "courses",
      label: "Mata Pelajaran",
      value: "6",
      desc: "Aktif semester ini",
      borderAccent: "border-l-[#2BA8A2]",
      badgeBg: "bg-[#E8F6F5]",
      badgeText: "text-[#1E8C86]",
      icon: <BookOpenIcon className="w-6 h-6 text-[#2BA8A2]" />,
      actionText: "Kelola Pelajaran",
      actionHref: "/courses",
      accentGlow: "hover:shadow-teal-glow",
    },
    {
      id: "materials",
      label: "Materi Pembelajaran",
      value: "24",
      desc: "Modul, bacaan & slide",
      borderAccent: "border-l-[#5DADE2]",
      badgeBg: "bg-[#5DADE2]/15",
      badgeText: "text-[#2980B9]",
      icon: <FileTextIcon className="w-6 h-6 text-[#5DADE2]" />,
      actionText: "Lihat Semua Materi",
      actionHref: "/materials",
      accentGlow: "hover:shadow-sky-glow",
    },
    {
      id: "assignments",
      label: "Tugas & Evaluasi",
      value: "9",
      desc: "3 mendekati tenggat",
      borderAccent: "border-l-[#EF6C4A]",
      badgeBg: "bg-[#EF6C4A]/15",
      badgeText: "text-[#D45233]",
      icon: <CheckCircleIcon className="w-6 h-6 text-[#EF6C4A]" />,
      actionText: "Cek Daftar Tugas",
      actionHref: "/assignments",
      accentGlow: "hover:shadow-coral-glow",
    },
  ];

  const recentCourses = [
    {
      id: 1,
      name: "Matematika Diskrit",
      description: "Logika matematika, teori himpunan, dan relasi fungsi.",
      materialsCount: 7,
      assignmentsCount: 3,
      tag: "Wajib",
      accentColor: "#2BA8A2",
    },
    {
      id: 2,
      name: "Algoritma & Struktur Data",
      description: "Array, linked list, tree, graph, serta optimasi kompleksitas.",
      materialsCount: 10,
      assignmentsCount: 4,
      tag: "Inti",
      accentColor: "#EF6C4A",
    },
    {
      id: 3,
      name: "Pemrograman Web Lanjut",
      description: "Arsitektur frontend modern, RESTful API, dan state management.",
      materialsCount: 7,
      assignmentsCount: 2,
      tag: "Pilihan",
      accentColor: "#FFD23F",
    },
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: "Implementasi Tree Traversal",
      courseName: "Algoritma & Struktur Data",
      dueDate: "28 Nov 2026, 23:59 WIB",
      status: "PENDING",
      priority: "Tinggi",
    },
    {
      id: 2,
      title: "Latihan Aljabar Boolean",
      courseName: "Matematika Diskrit",
      dueDate: "30 Nov 2026, 17:00 WIB",
      status: "IN_PROGRESS",
      priority: "Sedang",
    },
    {
      id: 3,
      title: "Rancangan Antarmuka LMS",
      courseName: "Pemrograman Web Lanjut",
      dueDate: "02 Des 2026, 23:59 WIB",
      status: "COMPLETED",
      priority: "Selesai",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EFF8F7] flex flex-col selection:bg-[#FFD23F] selection:text-[#1E8C86]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* Playful Hero Banner with Flip7 aesthetics */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2BA8A2] via-[#249690] to-[#1E8C86] text-white p-6 sm:p-10 shadow-teal-glow">
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-32 -mb-12 w-48 h-48 rounded-full bg-[#FFD23F]/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              {/* Ribbon pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] text-[#1E8C86] font-black text-xs tracking-wider uppercase border border-[#FFE47A] shadow-sm">
                <SparklesIcon className="w-4 h-4 text-[#FFD23F] fill-[#FFD23F]" />
                Ringkasan Pembelajaran Aktif
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Selamat Datang di <span className="text-[#FFD23F] underline decoration-[#EF6C4A] decoration-wavy decoration-2">LearnHub</span>
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Pantau progres mata pelajaran, materi belajar, dan selesaikan tugas tepat waktu
                dengan tampilan interaktif dan menyenangkan.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/courses"
                className="btn-bounce inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm bg-gradient-to-r from-[#FFD23F] to-[#FFE47A] text-[#1E8C86] border-2 border-[#E6B800] shadow-accent-glow"
              >
                <PlusIcon className="w-5 h-5 text-[#1E8C86]" />
                Tambah Mata Pelajaran
              </Link>
              <Link
                href="/assignments"
                className="btn-bounce inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-white/15 hover:bg-white/25 text-[#FFF8E7] border border-white/30 backdrop-blur-sm"
              >
                Cek Tugas
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section Titles with playful dashed border */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#2BA8A2]/30 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label="chart">📊</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E8C86] tracking-tight">
              Statistik Utama
            </h2>
          </div>
          <span className="text-xs font-bold text-[#2BA8A2] bg-[#E8F6F5] px-3 py-1 rounded-full border border-[#2BA8A2]/20">
            Realtime Summary
          </span>
        </div>

        {/* Stats Summary Cards (Flip7 Left-Accent Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div
              key={item.id}
              className={`card-tactile bg-white rounded-3xl p-6 shadow-card-flip border-y border-r border-[#E8F6F5] border-l-[7px] ${item.borderAccent} ${item.accentGlow} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${item.badgeBg} border border-black/5`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${item.badgeBg} ${item.badgeText}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#172B2A]">
                    {item.value}
                  </span>
                  <span className="text-sm font-bold text-gray-500">item</span>
                </div>

                <p className="text-xs font-semibold text-gray-500 mb-6">
                  {item.desc}
                </p>
              </div>

              <Link
                href={item.actionHref}
                className="btn-bounce inline-flex items-center justify-between w-full px-4 py-2.5 rounded-full text-xs font-extrabold bg-[#EFF8F7] hover:bg-[#2BA8A2] text-[#1E8C86] hover:text-white border border-[#2BA8A2]/20 transition-colors group"
              >
                <span>{item.actionText}</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </section>

        {/* Two-column layout for Recent Courses & Upcoming Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Courses preview section (7 cols) */}
          <section className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2BA8A2]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="books">📚</span>
                <h3 className="text-xl font-black text-[#1E8C86]">
                  Mata Pelajaran Terkini
                </h3>
              </div>
              <Link
                href="/courses"
                className="text-xs font-extrabold text-[#2BA8A2] hover:text-[#1E8C86] underline decoration-2 underline-offset-4"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="card-tactile bg-white rounded-2xl p-5 shadow-card-flip border-l-4 hover:shadow-teal-glow transition-all"
                  style={{ borderLeftColor: c.accentColor }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF8E7] text-[#1E8C86] border border-[#FFE47A]">
                          {c.tag}
                        </span>
                        <h4 className="font-extrabold text-base text-[#172B2A]">
                          {c.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    </div>

                    <Link
                      href={`/courses/${c.id}`}
                      className="btn-bounce shrink-0 p-2.5 rounded-xl bg-[#EFF8F7] hover:bg-[#2BA8A2] text-[#1E8C86] hover:text-white border border-[#2BA8A2]/20 transition-colors"
                      title="Lihat Detail Pembelajaran"
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1.5 text-[#1E8C86]">
                      <FileTextIcon className="w-3.5 h-3.5 text-[#2BA8A2]" />
                      {c.materialsCount} Materi
                    </span>
                    <span className="flex items-center gap-1.5 text-[#EF6C4A]">
                      <ClockIcon className="w-3.5 h-3.5 text-[#EF6C4A]" />
                      {c.assignmentsCount} Tugas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Assignments / Tasks preview section (5 cols) */}
          <section className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#EF6C4A]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="pencil">📝</span>
                <h3 className="text-xl font-black text-[#D45233]">
                  Tugas & Batas Waktu
                </h3>
              </div>
              <Link
                href="/assignments"
                className="text-xs font-extrabold text-[#EF6C4A] hover:text-[#D45233] underline decoration-2 underline-offset-4"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="space-y-3.5">
              {upcomingAssignments.map((task) => {
                const isPending = task.status === "PENDING";
                const isInProgress = task.status === "IN_PROGRESS";
                const isCompleted = task.status === "COMPLETED";

                return (
                  <div
                    key={task.id}
                    className="card-tactile bg-white rounded-2xl p-4 shadow-card-flip border-l-4 border-l-[#EF6C4A] hover:shadow-coral-glow transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-[#1E8C86] bg-[#E8F6F5] px-2.5 py-0.5 rounded-full">
                        {task.courseName}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? "bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/30"
                            : isInProgress
                            ? "bg-[#FFD23F]/25 text-[#B78103] border-[#FFD23F]"
                            : "bg-[#EF6C4A]/10 text-[#EF6C4A] border-[#EF6C4A]/30"
                        }`}
                      >
                        {isCompleted
                          ? "Selesai"
                          : isInProgress
                          ? "Sedang Dikerjakan"
                          : "Belum Dikerjakan"}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#172B2A] mb-2">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-gray-500 font-semibold">
                        <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                        {task.dueDate}
                      </span>
                      <span className="text-[11px] font-bold text-[#EF6C4A]">
                        Prioritas: {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick banner card */}
            <div className="bg-[#FFF8E7] border-2 border-[#FFE47A] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FFD23F] flex items-center justify-center shrink-0 text-[#1E8C86] font-black text-lg">
                💡
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-[#1E8C86]">Tips Belajar Hari Ini</p>
                <p className="text-gray-600 font-medium">
                  Selesaikan tugas bertenggat terdekat dahulu untuk menjaga performa belajar tetap prima!
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer playful */}
      <footer className="border-t border-[#2BA8A2]/20 py-6 mt-12 bg-white/50 text-center text-xs font-semibold text-[#1E8C86]/70">
        <p>LearnHub &bull; Sistem Pembelajaran Interaktif berbasis Flip7 Design System</p>
      </footer>
    </div>
  );
}
