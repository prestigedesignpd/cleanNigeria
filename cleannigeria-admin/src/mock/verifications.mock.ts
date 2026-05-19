export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  url: string; // Simulated URL
}

export interface VerificationRequest {
  id: string;
  applicantName: string;
  entityType: 'Estate' | 'Business' | 'Collector';
  contactEmail: string;
  contactPhone: string;
  submissionDate: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
  documents: VerificationDocument[];
  reviewerId?: string;
  notes?: string;
}

export const mockVerifications: VerificationRequest[] = [
  {
    id: "VRQ-8901",
    applicantName: "Victoria Island Residences",
    entityType: "Estate",
    contactEmail: "admin@viresidences.com",
    contactPhone: "+234 800 123 4567",
    submissionDate: "2026-05-14T08:30:00Z",
    status: "Pending",
    documents: [
      {
        id: "DOC-101",
        name: "Estate_Registration_Certificate.pdf",
        type: "PDF Document",
        size: "2.4 MB",
        status: "Pending",
        url: "#"
      },
      {
        id: "DOC-102",
        name: "Utility_Bill_Proof_Of_Address.jpg",
        type: "Image",
        size: "1.1 MB",
        status: "Pending",
        url: "#"
      }
    ]
  },
  {
    id: "VRQ-8902",
    applicantName: "Dangote Logistics Hub",
    entityType: "Business",
    contactEmail: "facilities@dangotelogistics.com",
    contactPhone: "+234 812 987 6543",
    submissionDate: "2026-05-13T14:15:00Z",
    status: "In Review",
    reviewerId: "ADM-002",
    documents: [
      {
        id: "DOC-201",
        name: "CAC_Incorporation_Document.pdf",
        type: "PDF Document",
        size: "4.5 MB",
        status: "Verified",
        url: "#"
      },
      {
        id: "DOC-202",
        name: "Tax_Clearance_Certificate.pdf",
        type: "PDF Document",
        size: "1.8 MB",
        status: "Pending",
        url: "#"
      }
    ]
  },
  {
    id: "VRQ-8903",
    applicantName: "Green Earth Recyclers",
    entityType: "Collector",
    contactEmail: "hello@greenearth.ng",
    contactPhone: "+234 703 444 5555",
    submissionDate: "2026-05-12T09:45:00Z",
    status: "Pending",
    documents: [
      {
        id: "DOC-301",
        name: "LAWMA_Operating_License.pdf",
        type: "PDF Document",
        size: "3.2 MB",
        status: "Pending",
        url: "#"
      },
      {
        id: "DOC-302",
        name: "Vehicle_Fleet_Insurance.pdf",
        type: "PDF Document",
        size: "5.1 MB",
        status: "Pending",
        url: "#"
      }
    ]
  }
];
