"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import {
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  SparklesIcon,
} from "../components/icons";
import { coursesApi, Course, API_BASE_URL } from "../lib/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<{ id?: string; name: string; description: string }>({
    id: "",
    name: "",
    description: "",
  });

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      console.log("%c[COURSES] Memulai fetch daftar mata pelajaran...", "color: #2BA8A2; font-weight: bold;");
      const data = await coursesApi.getAll();
      setCourses(data);
      console.log(`%c[COURSES] Berhasil mengambil ${data.length} mata pelajaran.`, "color: #27AE60; font-weight: bold;");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data mata pelajaran";
      setApiError(msg);
      console.error("%c[COURSES ERROR] Gagal mengambil mata pelajaran:", "color: #E74C3C; font-weight: bold;", {
        endpoint: `${API_BASE_URL}/courses`,
        error: err,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setFormData({ id: "", name: "", description: "" });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      id: course?.id !== undefined ? String(course.id) : "",
      name: course?.name || (course as unknown as { title?: string })?.title || "",
      description: course?.description || "",
    });
    setIsModalOpen(true);
  };

  // Submit form (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = (formData?.name || "").trim();
    const cleanDescription = (formData?.description || "").trim();

    if (!cleanName) return;

    setIsSubmitting(true);
    try {
      if (editingCourse) {
        // PATCH
        console.log(`%c[COURSES] Mengupdate course ID: ${editingCourse.id}`, "color: #FFD23F; font-weight: bold;");
        await coursesApi.update(editingCourse.id, {
          name: cleanName,
          description: cleanDescription,
        });
      } else {
        // POST
        console.log("%c[COURSES] Membuat course baru", "color: #2BA8A2; font-weight: bold;");
        const payload: { name: string; description: string; id?: number } = {
          name: cleanName,
          description: cleanDescription,
        };
        if (formData.id && !isNaN(Number(formData.id))) {
          payload.id = Number(formData.id);
        }
        await coursesApi.create(payload);
      }

      setIsModalOpen(false);
      await fetchCourses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan mata pelajaran";
      console.error("%c[COURSES FORM ERROR] Gagal submit course:", "color: #E74C3C; font-weight: bold;", {
        formData,
        editingId: editingCourse?.id,
        error: err,
      });
      alert(`Gagal menyimpan: ${msg}\nSilakan periksa detail error di Developer Console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus mata pelajaran ID ${id}?`)) return;

    setDeletingId(id);
    try {
      console.log(`%c[COURSES] Menghapus course ID: ${id}`, "color: #EF6C4A; font-weight: bold;");
      await coursesApi.delete(id);
      await fetchCourses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus mata pelajaran";
      console.error("%c[COURSES DELETE ERROR] Gagal delete course:", "color: #E74C3C; font-weight: bold;", {
        courseId: id,
        error: err,
      });
      alert(`Gagal menghapus: ${msg}\nSilakan periksa Developer Console.`);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter courses by search
  const filteredCourses = (Array.isArray(courses) ? courses : []).filter((c) => {
    if (!c) return false;
    const q = (searchQuery || "").toLowerCase();
    const nameStr = (c.name || (c as unknown as { title?: string }).title || "").toLowerCase();
    const descStr = (c.description || "").toLowerCase();
    return !q || nameStr.includes(q) || descStr.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#EFF8F7] flex flex-col selection:bg-[#FFD23F] selection:text-[#1E8C86]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header Title with Flip7 theme */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-[#2BA8A2]/30 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#1E8C86] font-black text-xs uppercase border border-[#FFE47A]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#FFD23F]" />
              Manajemen Kurikulum
            </div>
            <h1 className="text-3xl font-black text-[#1E8C86] tracking-tight">
              Mata Pelajaran
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-600">
              Kelola data mata pelajaran atau mata kuliah serta materi dan tugas yang terkait.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCourses}
              disabled={loading}
              className="btn-bounce inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white text-[#1E8C86] border border-[#2BA8A2]/30 hover:bg-[#E8F6F5] shadow-sm disabled:opacity-50"
              title="Refresh Data dari Server"
            >
              <RefreshCwIcon className={`w-4 h-4 ${loading ? "animate-spin text-[#2BA8A2]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="btn-bounce inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black bg-gradient-to-r from-[#FFD23F] to-[#FFE47A] text-[#1E8C86] border-2 border-[#E6B800] shadow-accent-glow"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          </div>
        </div>

        {/* API Error Alert Notification */}
        {apiError && (
          <div className="rounded-2xl p-4 bg-[#EF6C4A]/10 border-2 border-[#EF6C4A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-coral-glow">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-[#EF6C4A] text-white shrink-0">
                <AlertTriangleIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#D45233] uppercase tracking-wide">
                  Gagal Terhubung ke Backend API ({API_BASE_URL})
                </p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">
                  {apiError}. Pastikan server backend Anda aktif di <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-xs">{API_BASE_URL}</code>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-gray-500">Buka Console (F12) untuk log lengkap</span>
              <button
                onClick={fetchCourses}
                className="px-3 py-1.5 rounded-full bg-[#EF6C4A] text-white text-xs font-bold hover:bg-[#D45233] transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Controls: Search and Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mata pelajaran atau deskripsi..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#2BA8A2]/25 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2BA8A2]/40 shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#1E8C86]">
            <span className="bg-[#E8F6F5] px-3.5 py-1.5 rounded-full border border-[#2BA8A2]/20">
              Menampilkan {filteredCourses.length} dari {courses.length} mata pelajaran
            </span>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border-l-[7px] border-l-[#2BA8A2]/40 shadow-card-flip animate-pulse space-y-4"
              >
                <div className="h-6 w-3/4 bg-gray-200 rounded-full" />
                <div className="h-4 w-full bg-gray-100 rounded-full" />
                <div className="h-4 w-2/3 bg-gray-100 rounded-full" />
                <div className="h-10 w-full bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#2BA8A2]/30 max-w-lg mx-auto shadow-card-flip space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F6F5] text-[#2BA8A2] mx-auto flex items-center justify-center text-3xl">
              📚
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#1E8C86]">
                {searchQuery ? "Tidak ditemukan hasil yang cocok" : "Belum Ada Mata Pelajaran"}
              </h3>
              <p className="text-xs font-semibold text-gray-500">
                {searchQuery
                  ? `Tidak ada mata pelajaran yang cocok dengan "${searchQuery}". Coba kata kunci lain.`
                  : "Mulai tambahkan mata pelajaran baru untuk mengelola kurikulum dan materi."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="btn-bounce inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black bg-[#2BA8A2] text-white shadow-teal-glow"
              >
                <PlusIcon className="w-4 h-4" />
                Tambah Sekarang
              </button>
            )}
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              // Accent border color variation for playful Retro feel
              const accents = ["border-l-[#2BA8A2]", "border-l-[#EF6C4A]", "border-l-[#FFD23F]", "border-l-[#5DADE2]"];
              const borderStyle = accents[idx % accents.length];

              return (
                <div
                  key={course.id}
                  className={`card-tactile bg-white rounded-3xl p-6 shadow-card-flip border-y border-r border-[#E8F6F5] border-l-[7px] ${borderStyle} flex flex-col justify-between group hover:shadow-teal-glow transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#1E8C86] border border-[#FFE47A]">
                        ID #{course.id}
                      </span>

                      <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(course)}
                          className="p-1.5 rounded-xl text-gray-500 hover:text-[#2BA8A2] hover:bg-[#E8F6F5] transition-colors"
                          title="Ubah Mata Pelajaran"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          disabled={deletingId === course.id}
                          className="p-1.5 rounded-xl text-gray-500 hover:text-[#EF6C4A] hover:bg-[#EF6C4A]/10 transition-colors disabled:opacity-50"
                          title="Hapus Mata Pelajaran"
                        >
                          <TrashIcon className={`w-4 h-4 ${deletingId === course.id ? "animate-spin" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-[#172B2A] line-clamp-1 group-hover:text-[#2BA8A2] transition-colors">
                      {course.name}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed min-h-[3rem]">
                      {course.description || "Tidak ada deskripsi mata pelajaran."}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100">
                    <Link
                      href={`/courses/${course.id}`}
                      className="btn-bounce inline-flex items-center justify-between w-full px-4 py-2.5 rounded-full text-xs font-black bg-[#EFF8F7] hover:bg-[#2BA8A2] text-[#1E8C86] hover:text-white border border-[#2BA8A2]/20 transition-all group/btn"
                    >
                      <span>Detail & Materi</span>
                      <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Form (Add / Edit Course) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-[#2BA8A2]/20 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2BA8A2]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#2BA8A2] flex items-center justify-center text-white font-black text-sm">
                  {editingCourse ? "✏️" : "✨"}
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#1E8C86]">
                    {editingCourse ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    {editingCourse ? `Perbarui info ID #${editingCourse.id}` : "Isi form di bawah untuk mendaftarkan mata pelajaran baru"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingCourse && (
                <div>
                  <label className="block text-xs font-extrabold text-[#1E8C86] uppercase mb-1">
                    ID (Opsional jika auto-generate)
                  </label>
                  <input
                    type="number"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Contoh: 1, 2, dst."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2BA8A2]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#1E8C86] uppercase mb-1">
                  Nama Mata Pelajaran <span className="text-[#EF6C4A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Matematika Diskrit"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2BA8A2]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1E8C86] uppercase mb-1">
                  Deskripsi Mata Pelajaran
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan cakupan topik atau silabus mata pelajaran ini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2BA8A2] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-bounce inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black bg-gradient-to-r from-[#FFD23F] to-[#FFE47A] text-[#1E8C86] border-2 border-[#E6B800] shadow-accent-glow disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCwIcon className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <span>{editingCourse ? "Perbarui" : "Simpan Data"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
