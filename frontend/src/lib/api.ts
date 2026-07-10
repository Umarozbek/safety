import type {
  City,
  CityOverview,
  Customer,
  JobAssignment,
  Order,
  OrderStatus,
  Site,
  Team,
  Worker,
  WorkerRole,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type UserRole = "BOSS" | "ADMIN" | "WORKER";

export interface AuthenticatedUser {
  id: number;
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ---------- Auth ----------

export function login(username: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchMe() {
  return request<AuthenticatedUser>("/auth/me");
}

// ---------- Cities ----------

export function fetchCities() {
  return request<City[]>("/cities");
}

export function fetchCityOverview() {
  return request<CityOverview[]>("/cities/overview");
}

export function createCity(data: { name: string; status?: string }) {
  return request<City>("/cities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------- Customers ----------

export function fetchCustomers() {
  return request<Customer[]>("/customers");
}

export function createCustomer(data: {
  companyName: string;
  contactPhone: string;
  contactPerson?: string;
}) {
  return request<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCustomer(
  id: number,
  data: Partial<{
    companyName: string;
    contactPhone: string;
    contactPerson: string;
  }>,
) {
  return request<Customer>(`/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id: number) {
  return request<void>(`/customers/${id}`, { method: "DELETE" });
}

// ---------- Sites ----------

export function fetchSites() {
  return request<Site[]>("/sites");
}

export function updateSite(
  id: number,
  data: Partial<{
    cityId: number;
    address: string;
    mapLink: string;
    sizeSqm: number;
    accessNotes: string;
  }>,
) {
  return request<Site>(`/sites/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ---------- Orders ----------

export function fetchOrders(filters?: {
  status?: OrderStatus;
  cityId?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.cityId) params.set("cityId", String(filters.cityId));
  const qs = params.toString();
  return request<Order[]>(`/orders${qs ? `?${qs}` : ""}`);
}

export function createOrder(data: {
  customerId: number;
  requestedDate: string;
  site: {
    cityId: number;
    address: string;
    mapLink?: string;
    sizeSqm: number;
    accessNotes?: string;
  };
}) {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return request<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteOrder(id: number) {
  return request<void>(`/orders/${id}`, { method: "DELETE" });
}

// ---------- Teams ----------

export function fetchTeams() {
  return request<Team[]>("/teams");
}

export function createTeam(data: { name: string; cityId: number }) {
  return request<Team>("/teams", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTeam(id: number) {
  return request<void>(`/teams/${id}`, { method: "DELETE" });
}

// ---------- Workers ----------

export function fetchWorkers() {
  return request<Worker[]>("/workers");
}

export function createWorker(data: {
  name: string;
  phone: string;
  teamId: number;
  role: WorkerRole;
  userAccountId?: number;
}) {
  return request<Worker>("/workers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteWorker(id: number) {
  return request<void>(`/workers/${id}`, { method: "DELETE" });
}

// ---------- Job Assignments ----------

export function fetchJobAssignments() {
  return request<JobAssignment[]>("/job-assignments");
}

export function fetchMyJobs() {
  return request<JobAssignment[]>("/job-assignments/mine");
}

export function createJobAssignment(data: {
  orderId: number;
  teamId: number;
  assignedDate: string;
}) {
  return request<JobAssignment>("/job-assignments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function finishJobAssignment(id: number, completionPhotoUrl?: string) {
  return request<JobAssignment>(`/job-assignments/${id}/finish`, {
    method: "PATCH",
    body: JSON.stringify({ completionPhotoUrl }),
  });
}
