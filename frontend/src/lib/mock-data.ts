import type {
  City,
  CityOverview,
  Customer,
  JobAssignment,
  Order,
  Site,
  Team,
  Worker,
} from "./types";
import type { AuthenticatedUser, UserRole } from "./api";

export const DEMO_USERS: Record<
  string,
  { password: string; user: AuthenticatedUser }
> = {
  boss: { password: "1234", user: { id: 1, username: "boss", role: "BOSS" } },
  admin: {
    password: "1234",
    user: { id: 2, username: "admin", role: "ADMIN" },
  },
  worker: {
    password: "1234",
    user: { id: 3, username: "worker", role: "WORKER" },
  },
};

export const mockCities: City[] = [
  { id: 1, name: "서울", status: "ACTIVE_INSTALLED" },
  { id: 2, name: "부산", status: "ACTIVE_INSTALLED" },
  { id: 3, name: "대구", status: "PLANNED" },
];

export const mockCityOverview: CityOverview[] = [
  { id: 1, name: "서울", status: "ACTIVE_INSTALLED", completedSqm: 4200, pendingSqm: 1800, siteCount: 12 },
  { id: 2, name: "부산", status: "ACTIVE_INSTALLED", completedSqm: 2600, pendingSqm: 900, siteCount: 7 },
  { id: 3, name: "대구", status: "PLANNED", completedSqm: 0, pendingSqm: 1200, siteCount: 3 },
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    companyName: "한빛건설",
    contactPhone: "010-1234-5678",
    contactPerson: "김민수",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: 2,
    companyName: "대성종합건설",
    contactPhone: "010-9876-5432",
    contactPerson: "이지훈",
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-02-15T00:00:00.000Z",
  },
];

const mockSites: Site[] = [
  {
    id: 1,
    cityId: 1,
    address: "서울특별시 강남구 테헤란로 123",
    mapLink: null,
    sizeSqm: "320.5",
    accessNotes: "지하주차장 이용",
    city: mockCities[0],
  },
  {
    id: 2,
    cityId: 2,
    address: "부산광역시 해운대구 센텀로 45",
    mapLink: null,
    sizeSqm: "180.0",
    accessNotes: null,
    city: mockCities[1],
  },
];

export const mockTeams: Team[] = [
  { id: 1, name: "설치 1팀", cityId: 1, city: mockCities[0], workers: [] },
  { id: 2, name: "설치 2팀", cityId: 2, city: mockCities[1], workers: [] },
];

export const mockWorkers: Worker[] = [
  { id: 1, name: "박정호", phone: "010-1111-2222", teamId: 1, role: "INSTALLATION", userAccountId: 3, team: mockTeams[0] },
  { id: 2, name: "최영수", phone: "010-3333-4444", teamId: 1, role: "PRODUCTION", userAccountId: null, team: mockTeams[0] },
  { id: 3, name: "정다은", phone: "010-5555-6666", teamId: 2, role: "INSTALLATION", userAccountId: null, team: mockTeams[1] },
];

mockTeams[0].workers = mockWorkers.filter((w) => w.teamId === 1);
mockTeams[1].workers = mockWorkers.filter((w) => w.teamId === 2);

export const mockJobAssignments: JobAssignment[] = [
  {
    id: 1,
    orderId: 1,
    teamId: 1,
    assignedDate: "2026-07-10T00:00:00.000Z",
    status: "ASSIGNED",
    completionPhotoUrl: null,
    finishedAt: null,
    team: mockTeams[0],
  },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2026-0001",
    customerId: 1,
    siteId: 1,
    requestedDate: "2026-07-15T00:00:00.000Z",
    status: "IN_PRODUCTION",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    customer: mockCustomers[0],
    site: mockSites[0],
    jobAssignments: mockJobAssignments,
  },
  {
    id: 2,
    orderNumber: "ORD-2026-0002",
    customerId: 2,
    siteId: 2,
    requestedDate: "2026-07-20T00:00:00.000Z",
    status: "RECEIVED",
    createdAt: "2026-07-05T00:00:00.000Z",
    updatedAt: "2026-07-05T00:00:00.000Z",
    customer: mockCustomers[1],
    site: mockSites[1],
    jobAssignments: [],
  },
];

mockJobAssignments[0].order = mockOrders[0];

export const mockMyJobs: JobAssignment[] = [mockJobAssignments[0]];

export function demoLogin(username: string, password: string) {
  const entry = DEMO_USERS[username];
  if (!entry || entry.password !== password) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
  return { accessToken: `demo-token-${entry.user.role}`, user: entry.user };
}

export function demoMe(): AuthenticatedUser {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const role = token?.replace("demo-token-", "") as UserRole | undefined;
  const found = Object.values(DEMO_USERS).find((u) => u.user.role === role);
  if (!found) throw new Error("세션이 만료되었습니다.");
  return found.user;
}
