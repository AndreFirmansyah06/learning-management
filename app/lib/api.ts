// API configuration and service helper based on learning-management-collection

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Course {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Material {
  id: number;
  title: string;
  content: string;
  course_id?: number;
  createdAt?: string;
  updatedAt?: string;
}
export enum statusEnum {
  PENDING, IN_PROGRESS, COMPLETED
}
export interface Assignment {
  id: number;
  title: string;
  description: string;
  course_id: number;
  dueDate: string;
  status: statusEnum;
}

// Logging wrapper to help debugging errors clearly in the console
export const logApiError = (context: string, error: unknown, details?: Record<string, unknown>) => {
  console.group(`🚨 [API ERROR] ${context}`);
  console.error("Timestamp:", new Date().toISOString());
  if (details) {
    console.error("Context Details:", details);
  }
  if (error instanceof Error) {
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
  } else {
    console.error("Raw Error:", error);
  }
  console.groupEnd();
};

export const logApiSuccess = (context: string, data: unknown) => {
  console.log(`✅ [API SUCCESS] ${context}:`, data);
};

// Courses API
export const coursesApi = {
  // GET ALL /courses
  async getAll(): Promise<Course[]> {
    const url = `${API_BASE_URL}/courses`;
    try {
      console.log(`📡 [API FETCH] GET ${url}`);
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} (${res.statusText}): ${errorText}`);
      }

      const data = await res.json();
      logApiSuccess("coursesApi.getAll", data);
      return Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      logApiError("coursesApi.getAll", err, { url });
      throw err;
    }
  },

  // GET ONE /courses/:id
  async getOne(id: number | string): Promise<Course> {
    const url = `${API_BASE_URL}/courses/${id}`;
    try {
      console.log(`📡 [API FETCH] GET ${url}`);
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} (${res.statusText}): ${errorText}`);
      }

      const data = await res.json();
      logApiSuccess(`coursesApi.getOne(${id})`, data);
      return data.data || data;
    } catch (err) {
      logApiError(`coursesApi.getOne(${id})`, err, { url, id });
      throw err;
    }
  },

  // POST /courses
  async create(payload: { name: string; description: string; id?: number }): Promise<Course> {
    const url = `${API_BASE_URL}/courses`;
    try {
      console.log(`📡 [API FETCH] POST ${url}`, payload);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} (${res.statusText}): ${errorText}`);
      }

      const data = await res.json();
      logApiSuccess("coursesApi.create", data);
      return data.data || data;
    } catch (err) {
      logApiError("coursesApi.create", err, { url, payload });
      throw err;
    }
  },

  // PATCH /courses/:id
  async update(id: number | string, payload: { name: string; description: string }): Promise<Course> {
    const url = `${API_BASE_URL}/courses/${id}`;
    try {
      console.log(`📡 [API FETCH] PATCH ${url}`, payload);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} (${res.statusText}): ${errorText}`);
      }

      const data = await res.json();
      logApiSuccess(`coursesApi.update(${id})`, data);
      return data.data || data;
    } catch (err) {
      logApiError(`coursesApi.update(${id})`, err, { url, id, payload });
      throw err;
    }
  },

  // DELETE /courses/:id
  async delete(id: number | string): Promise<{ success: boolean }> {
    const url = `${API_BASE_URL}/courses/${id}`;
    try {
      console.log(`📡 [API FETCH] DELETE ${url}`);
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} (${res.statusText}): ${errorText}`);
      }

      logApiSuccess(`coursesApi.delete(${id})`, { id });
      return { success: true };
    } catch (err) {
      logApiError(`coursesApi.delete(${id})`, err, { url, id });
      throw err;
    }
  },
};

// Materials API based on learning-management-collection
// Note: In the collection, the URLs under Materials folder target {{localhost}}/courses,
// but some backends use {{localhost}}/materials. We provide seamless fetching with fallback.
async function fetchWithFallback(
  path1: string,
  path2: string,
  options: RequestInit,
  contextName: string
) {
  const url1 = `${API_BASE_URL}${path1}`;
  try {
    console.log(`📡 [API FETCH] ${options.method || "GET"} ${url1}`);
    const res = await fetch(url1, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...options,
    });
    if (res.ok) {
      const data = await res.json();
      logApiSuccess(contextName, data);
      return data;
    }
    // If 404, fallback to path2
    // if (res.status === 404 && path2) {
    //   console.warn(`⚠️ [API FALLBACK] ${url1} returned 404, trying fallback ${API_BASE_URL}${path2}`);
    //   const url2 = `${API_BASE_URL}${path2}`;
    //   const res2 = await fetch(url2, {
    //     headers: { "Content-Type": "application/json" },
    //     cache: "no-store",
    //     ...options,
    //   });
    //   if (res2.ok) {
    //     const data2 = await res2.json();
    //     logApiSuccess(`${contextName} (fallback)`, data2);
    //     return data2;
    //   }
    //   const errText2 = await res2.text();
    //   throw new Error(`HTTP ${res2.status} (${res2.statusText}): ${errText2}`);
    // }
    const errText = await res.text();
    throw new Error(`HTTP ${res.status} (${res.statusText}): ${errText}`);
  } catch (err) {
    logApiError(contextName, err, { path1, path2, method: options.method });
    throw err;
  }
}

export const materialsApi = {
  // GET ALL Materials
  async getAll(): Promise<Material[]> {
    try {
      const data = await fetchWithFallback(
        "/materials",
        "/courses",
        { method: "GET" },
        "materialsApi.getAll"
      );
      return Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      logApiError("materialsApi.getAll", err);
      throw err;
    }
  },

  // GET ONE Material
  async getOne(id: number | string): Promise<Material> {
    try {
      const data = await fetchWithFallback(
        `/materials/${id}`,
        `/courses/${id}`,
        { method: "GET" },
        `materialsApi.getOne(${id})`
      );
      return data.data || data;
    } catch (err) {
      logApiError(`materialsApi.getOne(${id})`, err);
      throw err;
    }
  },

  // POST Material
  async create(payload: { title: string; content: string; course_id?: number; id?: number }): Promise<Material> {
    try {
      const data = await fetchWithFallback(
        "/materials",
        "/courses",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        "materialsApi.create"
      );
      return data.data || data;
    } catch (err) {
      logApiError("materialsApi.create", err, { payload });
      throw err;
    }
  },

  // PATCH Material
  async update(
    id: number | string,
    payload: { title: string; content: string; course_id?: number }
  ): Promise<Material> {
    try {
      const data = await fetchWithFallback(
        `/materials/${id}`,
        `/courses/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        `materialsApi.update(${id})`
      );
      return data.data || data;
    } catch (err) {
      logApiError(`materialsApi.update(${id})`, err, { id, payload });
      throw err;
    }
  },

  // DELETE Material
  async delete(id: number | string): Promise<{ success: boolean }> {
    try {
      await fetchWithFallback(
        `/materials/${id}`,
        `/courses/${id}`,
        { method: "DELETE" },
        `materialsApi.delete(${id})`
      );
      logApiSuccess(`materialsApi.delete(${id})`, { id });
      return { success: true };
    } catch (err) {
      logApiError(`materialsApi.delete(${id})`, err, { id });
      throw err;
    }
  },
};


export const assignmentsApi = {
  // GET ALL Materials
  async getAll(): Promise<Assignment[]> {
    try {
      const data = await fetchWithFallback(
        "/assignment",
        "/courses",
        { method: "GET" },
        "assignmentsApi.getAll"
      );
      return Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      logApiError("assignmentsApi.getAll", err);
      throw err;
    }
  },

  // GET ONE Material
  async getOne(id: number | string): Promise<Material> {
    try {
      const data = await fetchWithFallback(
        `/assignment/${id}`,
        `/courses/${id}`,
        { method: "GET" },
        `assignmentsApi.getOne(${id})`
      );
      return data.data || data;
    } catch (err) {
      logApiError(`assignmentsApi.getOne(${id})`, err);
      throw err;
    }
  },

  // POST Material
  async create(payload: { title: string; description: string; dueDate: string; status: statusEnum; course_id?: number; id?: number }): Promise<Material> {
    try {
      const data = await fetchWithFallback(
        "/assignment",
        "/courses",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        "assignmentsApi.create"
      );
      return data.data || data;
    } catch (err) {
      logApiError("assignmentsApi.create", err, { payload });
      throw err;
    }
  },

  // // PATCH Material
  async update(
    id: number | string,
    payload: { title: string; description: string; dueDate: string; status: statusEnum; course_id?: number; }
  ): Promise<Material> {
    try {
      const data = await fetchWithFallback(
        `/assignment/${id}`,
        `/courses/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        `assignmentsApi.update(${id})`
      );
      return data.data || data;
    } catch (err) {
      logApiError(`assignmentsApi.update(${id})`, err, { id, payload });
      throw err;
    }
  },

  // // DELETE Material
  async delete(id: number | string): Promise<{ success: boolean }> {
    try {
      await fetchWithFallback(
        `/assignment/${id}`,
        `/courses/${id}`,
        { method: "DELETE" },
        `.delete(${id})`
      );
      logApiSuccess(`assignmentsApi.delete(${id})`, { id });
      return { success: true };
    } catch (err) {
      logApiError(`assignmentsApi.delete(${id})`, err, { id });
      throw err;
    }
  },
};
