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
  topBranches: TopBranch[];
  packagesByStatus: PackageStatusCount[];
}
