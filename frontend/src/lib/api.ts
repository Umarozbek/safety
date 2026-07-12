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
import * as mock from "./mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

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

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200));
}

let nextId = 1000;

// ---------- Auth ----------

export function login(username: string, password: string) {
  if (DEMO_MODE) return delay(mock.demoLogin(username, password));
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchMe() {
  if (DEMO_MODE) return delay(mock.demoMe());
  return request<AuthenticatedUser>("/auth/me");
}

// ---------- Cities ----------

export function fetchCities() {
  if (DEMO_MODE) return delay(mock.mockCities);
  return request<City[]>("/cities");
}

export function fetchCityOverview() {
  if (DEMO_MODE) return delay(mock.mockCityOverview);
  return request<CityOverview[]>("/cities/overview");
}

export function createCity(data: { name: string; status?: string }) {
  if (DEMO_MODE) {
    const city: City = {
      id: nextId++,
      name: data.name,
      status: (data.status as City["status"]) ?? "PLANNED",
    };
    mock.mockCities.push(city);
    return delay(city);
  }
  return request<City>("/cities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------- Customers ----------

export function fetchCustomers() {
  if (DEMO_MODE) return delay(mock.mockCustomers);
  return request<Customer[]>("/customers");
}

export function createCustomer(data: {
  companyName: string;
  contactPhone: string;
  contactPerson?: string;
}) {
  if (DEMO_MODE) {
    const customer: Customer = {
      id: nextId++,
      companyName: data.companyName,
      contactPhone: data.contactPhone,
      contactPerson: data.contactPerson ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mock.mockCustomers.push(customer);
    return delay(customer);
  }
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
  if (DEMO_MODE) {
    const customer = mock.mockCustomers.find((c) => c.id === id);
    if (!customer) throw new ApiError(404, "Not found");
    Object.assign(customer, data, { updatedAt: new Date().toISOString() });
    return delay(customer);
  }
  return request<Customer>(`/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id: number) {
  if (DEMO_MODE) {
    const idx = mock.mockCustomers.findIndex((c) => c.id === id);
    if (idx !== -1) mock.mockCustomers.splice(idx, 1);
    return delay(undefined);
  }
  return request<void>(`/customers/${id}`, { method: "DELETE" });
}

// ---------- Sites ----------

export function fetchSites() {
  if (DEMO_MODE) return delay(mock.mockOrders.map((o) => o.site));
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
  if (DEMO_MODE) {
    const site = mock.mockOrders.map((o) => o.site).find((s) => s.id === id);
    if (!site) throw new ApiError(404, "Not found");
    Object.assign(site, data, {
      sizeSqm: data.sizeSqm != null ? String(data.sizeSqm) : site.sizeSqm,
    });
    return delay(site);
  }
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
  if (DEMO_MODE) {
    const filtered = mock.mockOrders.filter(
      (o) =>
        (!filters?.status || o.status === filters.status) &&
        (!filters?.cityId || o.site.cityId === filters.cityId),
    );
    return delay(filtered);
  }
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
  if (DEMO_MODE) {
    const customer = mock.mockCustomers.find((c) => c.id === data.customerId);
    const city = mock.mockCities.find((c) => c.id === data.site.cityId);
    if (!customer || !city) throw new ApiError(400, "Invalid reference");
    const order: Order = {
      id: nextId++,
      orderNumber: `ORD-DEMO-${nextId}`,
      customerId: data.customerId,
      siteId: nextId++,
      requestedDate: data.requestedDate,
      status: "RECEIVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer,
      site: {
        id: nextId,
        cityId: data.site.cityId,
        address: data.site.address,
        mapLink: data.site.mapLink ?? null,
        sizeSqm: String(data.site.sizeSqm),
        accessNotes: data.site.accessNotes ?? null,
        city,
      },
      jobAssignments: [],
    };
    mock.mockOrders.push(order);
    return delay(order);
  }
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  if (DEMO_MODE) {
    const order = mock.mockOrders.find((o) => o.id === id);
    if (!order) throw new ApiError(404, "Not found");
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return delay(order);
  }
  return request<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteOrder(id: number) {
  if (DEMO_MODE) {
    const idx = mock.mockOrders.findIndex((o) => o.id === id);
    if (idx !== -1) mock.mockOrders.splice(idx, 1);
    return delay(undefined);
  }
  return request<void>(`/orders/${id}`, { method: "DELETE" });
}

// ---------- Teams ----------

export function fetchTeams() {
  if (DEMO_MODE) return delay(mock.mockTeams);
  return request<Team[]>("/teams");
}

export function createTeam(data: { name: string; cityId: number }) {
  if (DEMO_MODE) {
    const city = mock.mockCities.find((c) => c.id === data.cityId);
    if (!city) throw new ApiError(400, "Invalid city");
    const team: Team = {
      id: nextId++,
      name: data.name,
      cityId: data.cityId,
      city,
      workers: [],
    };
    mock.mockTeams.push(team);
    return delay(team);
  }
  return request<Team>("/teams", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTeam(id: number) {
  if (DEMO_MODE) {
    const idx = mock.mockTeams.findIndex((t) => t.id === id);
    if (idx !== -1) mock.mockTeams.splice(idx, 1);
    return delay(undefined);
  }
  return request<void>(`/teams/${id}`, { method: "DELETE" });
}

// ---------- Workers ----------

export function fetchWorkers() {
  if (DEMO_MODE) return delay(mock.mockWorkers);
  return request<Worker[]>("/workers");
}

export function createWorker(data: {
  name: string;
  phone: string;
  teamId: number;
  role: WorkerRole;
  userAccountId?: number;
}) {
  if (DEMO_MODE) {
    const team = mock.mockTeams.find((t) => t.id === data.teamId);
    if (!team) throw new ApiError(400, "Invalid team");
    const worker: Worker = {
      id: nextId++,
      name: data.name,
      phone: data.phone,
      teamId: data.teamId,
      role: data.role,
      userAccountId: data.userAccountId ?? null,
      team,
    };
    mock.mockWorkers.push(worker);
    team.workers.push(worker);
    return delay(worker);
  }
  return request<Worker>("/workers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteWorker(id: number) {
  if (DEMO_MODE) {
    const idx = mock.mockWorkers.findIndex((w) => w.id === id);
    if (idx !== -1) mock.mockWorkers.splice(idx, 1);
    return delay(undefined);
  }
  return request<void>(`/workers/${id}`, { method: "DELETE" });
}

// ---------- Job Assignments ----------

export function fetchJobAssignments() {
  if (DEMO_MODE) return delay(mock.mockJobAssignments);
  return request<JobAssignment[]>("/job-assignments");
}

export function fetchMyJobs() {
  if (DEMO_MODE) return delay(mock.mockMyJobs);
  return request<JobAssignment[]>("/job-assignments/mine");
}

export function createJobAssignment(data: {
  orderId: number;
  teamId: number;
  assignedDate: string;
}) {
  if (DEMO_MODE) {
    const order = mock.mockOrders.find((o) => o.id === data.orderId);
    const team = mock.mockTeams.find((t) => t.id === data.teamId);
    if (!order || !team) throw new ApiError(400, "Invalid reference");
    const assignment: JobAssignment = {
      id: nextId++,
      orderId: data.orderId,
      teamId: data.teamId,
      assignedDate: data.assignedDate,
      status: "ASSIGNED",
      completionPhotoUrl: null,
      finishedAt: null,
      team,
      order,
    };
    mock.mockJobAssignments.push(assignment);
    order.jobAssignments.push(assignment);
    return delay(assignment);
  }
  return request<JobAssignment>("/job-assignments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function finishJobAssignment(id: number, completionPhotoUrl?: string) {
  if (DEMO_MODE) {
    const assignment = mock.mockJobAssignments.find((j) => j.id === id);
    if (!assignment) throw new ApiError(404, "Not found");
    assignment.status = "FINISHED";
    assignment.completionPhotoUrl = completionPhotoUrl ?? null;
    assignment.finishedAt = new Date().toISOString();
    return delay(assignment);
  }
  return request<JobAssignment>(`/job-assignments/${id}/finish`, {
    method: "PATCH",
    body: JSON.stringify({ completionPhotoUrl }),
  });
}
