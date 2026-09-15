export interface TopBranch {
  branchId: string;
  name: string;
  completedReservations: number;
}

export interface PackageStatusCount {
  status: string;
  count: number;
}

export interface AdminEstadisticas {
  kgRescuedTotal: number;
  topBranches: TopBranch[];
  packagesByStatus: PackageStatusCount[];
}
