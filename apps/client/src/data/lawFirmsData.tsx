import { LawFirm } from "../types/Lawfirm";
export const lawFirmsData: LawFirm[] = [
  {
    id: "mf001",
    name: "Marai Legal Solutions",
    established: 2005,
    address: "123 Corporate Plaza, Downtown",
    contactNumber: "+1 (555) 123-4567",
    email: "info@marailegal.com",
    website: "www.marailegal.com",
    specializations: ["Corporate Law", "Intellectual Property", "Litigation"],
    lawyers: [
      {
        id: "l001",
        name: "Sarah Thompson",
        specialization: "Corporate Law",
        experience: 12,
        contactEmail: "sarah.thompson@marailegal.com",
      },
      {
        id: "l002",
        name: "Michael Rodriguez",
        specialization: "IP Law",
        experience: 9,
        contactEmail: "michael.rodriguez@marailegal.com",
      },
    ],
    partners: 4,
    casesHandled: 750,
    rating: 4.7,
  },
];
