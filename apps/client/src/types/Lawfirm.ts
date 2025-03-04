export interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  contactEmail: string;
}

export interface LawFirm {
  id: string;
  name: string;
  established: number;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
  specializations: string[];
  lawyers: Lawyer[];
  partners: number;
  casesHandled: number;
  rating: number;
}
