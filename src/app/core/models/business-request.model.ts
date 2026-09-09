export enum BusinessRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface BusinessRequest {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  businessLicenseUrl: string;
  photoUrl?: string;
  status: BusinessRequestStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRequestForm {
  businessName: string;
  address: string;
  businessLicense: File;
  photo?: File;
}
