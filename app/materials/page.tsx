"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import {
  FileTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  SparklesIcon,
  BookOpenIcon,
} from "../components/icons";
import { assignmentsApi, coursesApi, Assignment, Course, API_BASE_URL, statusEnum } from "../lib/api";

export default function AssignmentPage() {
  const [assignemts, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingAssignments, setEditingAssignments] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    dueDate: string;
    status: statusEnum;
    course_id?: string;
  }>({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    status: statusEnum.PENDING,
    course_id: "",
  });

  // Delete status tracking
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch materials & courses
  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      console.log("%c[Assignments] Memulai fetch daftar assignments...", "color: #5DADE2; font-weight: bold;");

      // Load courses in parallel to map course titles
      const [assignmentRes, coursesRes] = await Promise.allSettled([
        assignmentsApi.getAll(),
        coursesApi.getAll(),
      ]);

      if (assignmentRes.status === "fulfilled") {
        setAssignments(assignmentRes.value);
        console.log(`%c[MATERIALS] Berhasil mengambil ${assignmentRes.value.length} materi.`, "color: #27AE60; font-weight: bold;");
      } else {
        throw assignmentRes.reason;
      }

      if (coursesRes.status === "fulfilled") {
        setCourses(coursesRes.value);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat materi";
      setApiError(msg);
      console.error("%c[MATERIALS ERROR] Gagal mengambil materi pembelajaran:", "color: #E74C3C; font-weight: bold;", {
        endpoint: `${API_BASE_URL}/materials (or /courses)`,
        error: err,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open modal Create
  const handleOpenCreateModal = () => {
    setEditingAssignments(null);
    setFormData({ id: "", title: "", description: "", dueDate: "", status: statusEnum.PENDING, course_id: "" });
    setIsModalOpen(true);
  };

  // Open modal Edit
  const handleOpenEditModal = (item: Assignment) => {
    setEditingAssignments(item);
    setFormData({
      id: item?.id !== undefined ? String(item.id) : "",
      title: item?.title || "",
      description: item?.description || "",
      dueDate: item?.dueDate || "",
      status: item?.status,
      course_id: item?.course_id ? String(item.course_id) : (item?.course_id ? String(item.course_id) : ""),
    });
    setIsModalOpen(true);
  };

  // Submit Create / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = (formData?.title || "").trim();
    const cleanDescription = (formData?.description || "").trim();
    const cleanDueDate = (formData?.dueDate || "").trim();

    if (!cleanTitle) return;

    setIsSubmitting(true);
    try {
      if (editingAssignments) {
        console.log(`%c[MATERIALS] Mengupdate materi ID: ${editingAssignments.id}`, "color: #FFD23F; font-weight: bold;");
        const payload: { title: string; description: string; dueDate: string; status: statusEnum; course_id?: number; } = {
          title: cleanTitle,
          description: cleanDescription,
          dueDate: cleanDueDate,
          status: formData.status,

        };
        if (formData.course_id && !isNaN(Number(formData.course_id))) {
          payload.course_id = Number(formData.course_id);
        }
        await assignmentsApi.update(editingAssignments.id, payload);
      } else {
        console.log("%c[MATERIALS] Membuat materi pembelajaran baru", "color: #5DADE2; font-weight: bold;");
        const payload: { title: string; description: string; dueDate: string; status: statusEnum; course_id?: number; id?: number } = {
          title: cleanTitle,
          description: cleanDescription,
          dueDate: cleanDueDate,
          status: formData.status,
        };
        if (formData.id && !isNaN(Number(formData.id))) {
          payload.id = Number(formData.id);
        }
        if (formData.course_id && !isNaN(Number(formData.course_id))) {
          payload.course_id = Number(formData.course_id);
        }
        await assignmentsApi.create(payload);
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan materi pembelajaran";
      console.error("%c[MATERIALS FORM ERROR] Gagal submit materi:", "color: #E74C3C; font-weight: bold;", {
        formData,
        editingId: editingAssignments?.id,
        error: err,
      });
      alert(`Gagal menyimpan: ${msg}\nSilakan periksa detail error di Developer Console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm(`Hapus materi pembelajaran ID #${id}?`)) return;

    setDeletingId(id);
    try {
      console.log(`%c[MATERIALS] Menghapus materi ID: ${id}`, "color: #EF6C4A; font-weight: bold;");
      await assignmentsApi.delete(id);
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus materi";
      console.error("%c[MATERIALS DELETE ERROR] Gagal delete materi:", "color: #E74C3C; font-weight: bold;", {
        materialId: id,
        error: err,
      });
      alert(`Gagal menghapus materi: ${msg}\nCek Developer Console.`);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter materials by search & course
  const filteredMaterials = (Array.isArray(assignemts) ? assignemts : []).filter((m) => {
    if (!m) return false;
    const q = (searchQuery || "").toLowerCase();
    const nameStr = (m.title || (m as unknown as { title?: string }).title || "").toLowerCase();
    // const descStr = (m.content || "").toLowerCase();

    const matchQuery = !q || nameStr.includes(q);

    const rawCourseId = m.course_id;
    const matchCourse =
      selectedCourseFilter === "ALL" ||
      (rawCourseId !== undefined && String(rawCourseId) === selectedCourseFilter);

    return matchQuery && matchCourse;
  });

  return (
    <div className="min-h-screen bg-[#EFF8F7] flex flex-col selection:bg-[#FFD23F] selection:text-[#1E8C86]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header Title with Flip7 theme */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-[#5DADE2]/40 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#1E8C86] font-black text-xs uppercase border border-[#FFE47A]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#5DADE2]" />
              Modul Pembelajaran
            </div>
            <h1 className="text-3xl font-black text-[#172B2A] tracking-tight">
              Materi Belajar
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-600">
              Kelola bahan ajar, modul materi, dan referensi bacaan untuk peserta didik.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-bounce inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white text-[#1E8C86] border border-[#2BA8A2]/30 hover:bg-[#E8F6F5] shadow-sm disabled:opacity-50"
              title="Refresh Data dari Server"
            >
              <RefreshCwIcon className={`w-4 h-4 ${loading ? "animate-spin text-[#5DADE2]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="btn-bounce inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black bg-gradient-to-r from-[#5DADE2] to-[#3CC4BD] text-white shadow-sky-glow"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Tambah Materi</span>
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
                  Gagal Memuat Materi dari Backend ({API_BASE_URL})
                </p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">
                  {apiError}. Pastikan endpoint <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-xs">/materials</code> atau <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-xs">/courses</code> dapat diakses.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-gray-500">Cek Console (F12) untuk detail</span>
              <button
                onClick={fetchData}
                className="px-3 py-1.5 rounded-full bg-[#EF6C4A] text-white text-xs font-bold hover:bg-[#D45233] transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Controls: Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi berdasarkan judul atau isi..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#5DADE2]/30 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5DADE2]/40 shadow-sm transition-all"
              />
            </div>

            {courses.length > 0 && (
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-4 py-2.5 rounded-full bg-white border border-[#5DADE2]/30 text-xs font-bold text-[#1E8C86] focus:outline-none focus:ring-2 focus:ring-[#5DADE2]/40 shadow-sm"
              >
                <option value="ALL">Semua Pelajaran</option>
                {courses.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#2980B9]">
            <span className="bg-[#5DADE2]/15 px-3.5 py-1.5 rounded-full border border-[#5DADE2]/20">
              Menampilkan {filteredMaterials.length} dari {assignemts.length} materi
            </span>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border-l-[7px] border-l-[#5DADE2]/40 shadow-card-flip animate-pulse space-y-4"
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
        {!loading && filteredMaterials.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#5DADE2]/40 max-w-lg mx-auto shadow-card-flip space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#5DADE2]/15 text-[#5DADE2] mx-auto flex items-center justify-center text-3xl">
              📄
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#2980B9]">
                {searchQuery ? "Tidak ditemukan materi yang cocok" : "Belum Ada Materi Pembelajaran"}
              </h3>
              <p className="text-xs font-semibold text-gray-500">
                {searchQuery
                  ? `Tidak ada materi dengan kata kunci "${searchQuery}".`
                  : "Mulai tambahkan materi atau modul ajar untuk mata pelajaran."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="btn-bounce inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black bg-[#5DADE2] text-white shadow-sky-glow"
              >
                <PlusIcon className="w-4 h-4" />
                Tambah Materi Sekarang
              </button>
            )}
          </div>
        )}

        {/* Materials Grid */}
        {!loading && filteredMaterials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((item, idx) => {
              const borderAccents = ["border-l-[#5DADE2]", "border-l-[#2BA8A2]", "border-l-[#FFD23F]", "border-l-[#EF6C4A]"];
              const borderStyle = borderAccents[idx % borderAccents.length];

              const courseObj = courses.find((c) => c.id === (item.course_id));

              return (
                <div
                  key={item.id}
                  className={`card-tactile bg-white rounded-3xl p-6 shadow-card-flip border-y border-r border-[#E8F6F5] border-l-[7px] ${borderStyle} flex flex-col justify-between group hover:shadow-sky-glow transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#1E8C86] border border-[#FFE47A]">
                          ID #{item.id}
                        </span>
                        {courseObj && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F6F5] text-[#2BA8A2] border border-[#2BA8A2]/20">
                            {courseObj.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-xl text-gray-500 hover:text-[#5DADE2] hover:bg-[#5DADE2]/10 transition-colors"
                          title="Ubah Materi"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 rounded-xl text-gray-500 hover:text-[#EF6C4A] hover:bg-[#EF6C4A]/10 transition-colors disabled:opacity-50"
                          title="Hapus Materi"
                        >
                          <TrashIcon className={`w-4 h-4 ${deletingId === item.id ? "animate-spin" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-[#172B2A] line-clamp-2 group-hover:text-[#2980B9] transition-colors">
                      {item.title || (item as unknown as { title?: string }).title || "Tanpa Judul"}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-4 leading-relaxed min-h-[3.5rem]">
                      {item.description || "Tidak ada deskripsi materi."}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1.5 text-[#5DADE2]">
                      <FileTextIcon className="w-3.5 h-3.5" />
                      Bahan Pembelajaran
                    </span>

                    {item.course_id && (
                      <Link
                        href={`/courses/${item.course_id}`}
                        className="text-[#2BA8A2] hover:underline"
                      >
                        Lihat Pelajaran &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Form (Add / Edit Material) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-[#5DADE2]/30 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#5DADE2]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#5DADE2] flex items-center justify-center text-white font-black text-sm">
                  {editingAssignments ? "✏️" : "📄"}
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2980B9]">
                    {editingAssignments ? "Ubah Materi" : "Tambah Materi Pembelajaran"}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    {editingAssignments ? `Perbarui materi ID #${editingAssignments.id}` : "Isi form di bawah untuk membuat modul materi baru"}
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
              {!editingAssignments && (
                <div>
                  <label className="block text-xs font-extrabold text-[#2980B9] uppercase mb-1">
                    ID Materi (Opsional)
                  </label>
                  <input
                    type="number"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Contoh: 1, 2, dst."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5DADE2]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#2980B9] uppercase mb-1">
                  Mata Pelajaran Terkait (Opsional)
                </label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5DADE2]"
                >
                  <option value="">-- Pilih Mata Pelajaran (Opsional) --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name} (ID: {c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2980B9] uppercase mb-1">
                  Judul Materi <span className="text-[#EF6C4A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pengenalan Himpunan & Diagram Venn"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5DADE2]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2980B9] uppercase mb-1">
                  Deskripsi / Isi Materi
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan ringkasan materi, tautan bacaan atau modul pelajaran..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8E7] border border-[#FFE47A] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5DADE2] resize-none"
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
                  className="btn-bounce inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black bg-gradient-to-r from-[#5DADE2] to-[#3CC4BD] text-white shadow-sky-glow disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCwIcon className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <span>{editingAssignments ? "Perbarui Materi" : "Simpan Materi"}</span>
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
