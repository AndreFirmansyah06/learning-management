"use client";

import React, { useState, useEffect, useCallback, use, Suspense } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import {
  PlusIcon,
  AlertTriangleIcon,
} from "../../components/icons";
import { coursesApi, Course, API_BASE_URL } from "../../lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

function CourseDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch course details
  const fetchCourseDetail = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      console.log(`%c[COURSE DETAIL] Mengambil detail untuk ID: ${courseId}`, "color: #2BA8A2; font-weight: bold;");
      const data = await coursesApi.getOne(courseId);
      setCourse(data);
      console.log("%c[COURSE DETAIL] Berhasil memuat detail course:", "color: #27AE60; font-weight: bold;", data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat detail mata pelajaran";
      setApiError(msg);
      console.error("%c[COURSE DETAIL ERROR] Gagal fetch detail:", "color: #E74C3C; font-weight: bold;", {
        courseId,
        endpoint: `${API_BASE_URL}/courses/${courseId}`,
        error: err,
      });
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-gray-500">
        <Link href="/courses" className="text-[#2BA8A2] hover:underline">
          &larr; Kembali ke Daftar Mata Pelajaran
        </Link>
        <span>/</span>
        <span className="text-[#1E8C86]">Detail Mata Pelajaran #{courseId}</span>
      </nav>

      {/* API Error Notification */}
      {apiError && (
        <div className="rounded-2xl p-4 bg-[#EF6C4A]/10 border-2 border-[#EF6C4A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-coral-glow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EF6C4A] text-white shrink-0">
              <AlertTriangleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-[#D45233] uppercase tracking-wide">
                Gagal Memuat Detail dari Backend ({API_BASE_URL})
              </p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">
                {apiError}. Silakan periksa Developer Console (F12) untuk detail error.
              </p>
            </div>
          </div>
          <button
            onClick={fetchCourseDetail}
            className="btn-bounce px-4 py-1.5 rounded-full bg-[#EF6C4A] text-white text-xs font-bold hover:bg-[#D45233] shrink-0"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-3xl p-8 border-l-[8px] border-l-[#2BA8A2] shadow-card-flip animate-pulse space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded-full" />
          <div className="h-8 w-2/3 bg-gray-200 rounded-full" />
          <div className="h-4 w-full bg-gray-100 rounded-full" />
        </div>
      )}

      {/* Header Hero Card for Course */}
      {!loading && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-l-[8px] border-l-[#2BA8A2] shadow-card-flip border-y border-r border-[#E8F6F5]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#1E8C86] font-black text-xs uppercase border border-[#FFE47A]">
                ID #{course?.id || courseId}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A]">
                {course?.name || "Mata Pelajaran Tidak Ditemukan"}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 max-w-3xl leading-relaxed">
                {course?.description || "Tidak ada deskripsi rinci untuk mata pelajaran ini."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/courses"
                className="btn-bounce px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#EFF8F7] text-[#1E8C86] border border-[#2BA8A2]/20 hover:bg-[#2BA8A2] hover:text-white transition-colors"
              >
                Kelola di Daftar
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Course Associated Sections: Materi & Tugas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Related Materials Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#5DADE2]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="doc">📄</span>
              <h2 className="text-lg font-black text-[#2980B9]">
                Materi Pembelajaran Terkait
              </h2>
            </div>
            <span className="text-xs font-bold text-[#5DADE2] bg-[#5DADE2]/10 px-3 py-1 rounded-full">
              Materi Terhubung
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-card-flip border-l-[6px] border-l-[#5DADE2] space-y-3">
            <p className="text-xs text-gray-600 font-medium">
              Materi untuk mata pelajaran <strong>{course?.name || `#${courseId}`}</strong> dapat dilihat dan dikelola melalui halaman modul materi.
            </p>
            <Link
              href="/materials"
              className="btn-bounce inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#5DADE2] text-white shadow-sky-glow"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Buka & Tambah Materi
            </Link>
          </div>
        </section>

        {/* Related Assignments Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#EF6C4A]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="pencil">📝</span>
              <h2 className="text-lg font-black text-[#D45233]">
                Tugas & Evaluasi Terkait
              </h2>
            </div>
            <span className="text-xs font-bold text-[#EF6C4A] bg-[#EF6C4A]/10 px-3 py-1 rounded-full">
              Tugas Terhubung
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-card-flip border-l-[6px] border-l-[#EF6C4A] space-y-3">
            <p className="text-xs text-gray-600 font-medium">
              Kelola penugasan, batas waktu pengumpulan (*due date*), serta status pengerjaan untuk mata pelajaran ini.
            </p>
            <Link
              href="/assignments"
              className="btn-bounce inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#EF6C4A] text-white shadow-coral-glow"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Buka & Tambah Tugas
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function CourseDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-[#EFF8F7] flex flex-col selection:bg-[#FFD23F] selection:text-[#1E8C86]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-8 border-l-[8px] border-l-[#2BA8A2] shadow-card-flip animate-pulse space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 rounded-full" />
              <div className="h-8 w-2/3 bg-gray-200 rounded-full" />
            </div>
          }
        >
          <CourseDetailContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
