export type CityStatus = "ACTIVE_INSTALLED" | "PLANNED";
export type OrderStatus =
  | "RECEIVED"
  | "IN_PRODUCTION"
  | "DELIVERED"
  | "INSTALLED"
  | "COMPLETED";
export type WorkerRole = "PRODUCTION" | "INSTALLATION";
export type JobAssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "FINISHED";

export interface City {
  id: number;
  name: string;
  status: CityStatus;
}

export interface CityOverview extends City {
  completedSqm: number;
  pendingSqm: number;
  siteCount: number;
}

export interface Customer {
  id: number;
  companyName: string;
  contactPhone: string;
  contactPerson: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Site {
  id: number;
  cityId: number;
  address: string;
  mapLink: string | null;
  sizeSqm: string;
  accessNotes: string | null;
  city: City;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  siteId: number;
  requestedDate: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  site: Site;
  jobAssignments: JobAssignment[];
}

export interface Team {
  id: number;
  name: string;
  cityId: number;
  city: City;
  workers: Worker[];
}

export interface Worker {
  id: number;
  name: string;
  phone: string;
  teamId: number;
  role: WorkerRole;
  userAccountId: number | null;
  team?: Team;
}

export interface JobAssignment {
  id: number;
  orderId: number;
  teamId: number;
  assignedDate: string;
  status: JobAssignmentStatus;
  completionPhotoUrl: string | null;
  finishedAt: string | null;
  team: Team;
  order?: Order;
}
