/**
 * National Legal & Investigation Document Repository (NLADR)
 * Department of Legal & Administrative Affairs - Government of India
 * Initial Mock Database
 */

const INITIAL_USERS = [
  {
    id: "USR-ADM-001",
    username: "admin.sharma",
    name: "Dr. Arvind Sharma, IAS",
    role: "Administrator",
    designation: "Principal Secretary & Chief Document Controller",
    department: "Department of Legal & Administrative Affairs",
    badgeNumber: "IAS-1998-DL-042",
    email: "arvind.sharma@nic.gov.in",
    phone: "+91 98101 23456",
    status: "Active",
    avatar: "AS",
    approvedAt: "2024-01-10T10:00:00Z"
  },
  {
    id: "USR-IO-001",
    username: "io.rathore",
    name: "Vikramaditya Rathore",
    role: "Investigator Officer",
    designation: "Superintendent of Police (Anti-Corruption & Cyber Special Branch)",
    department: "Special Investigation Division",
    badgeNumber: "IPS-2012-DL-8841",
    email: "vikram.rathore@delhipolice.gov.in",
    phone: "+91 98712 34567",
    status: "Active",
    avatar: "VR",
    approvedAt: "2024-01-15T11:30:00Z"
  },
  {
    id: "USR-LEG-001",
    username: "legal.mehta",
    name: "Adv. Ananya Mehta",
    role: "Legal Officer",
    designation: "Senior Public Prosecutor & Standing Government Counsel",
    department: "Directorate of Prosecution, Ministry of Law & Justice",
    badgeNumber: "D/1429/2010",
    email: "ananya.mehta@govcourt.nic.in",
    phone: "+91 98234 56789",
    status: "Active",
    avatar: "AM",
    approvedAt: "2024-02-01T09:00:00Z"
  },
  {
    id: "USR-REC-001",
    username: "record.verma",
    name: "Om Prakash Verma",
    role: "Record Officer",
    designation: "Chief Archivist & Digital Vault Custodian",
    department: "Central Legal Archive & Record Depository",
    badgeNumber: "REC-DEL-4412",
    email: "op.verma@nic.in",
    phone: "+91 94120 98765",
    status: "Active",
    avatar: "OV",
    approvedAt: "2024-02-10T14:20:00Z"
  },
  {
    id: "USR-CIT-001",
    username: "citizen.rajesh",
    name: "Rajesh Kumar Sharma",
    role: "Citizen",
    designation: "Citizen / Complainant",
    department: "Public Grievance & Complainant Division",
    aadhaarMasked: "XXXX-XXXX-8921",
    email: "rajesh.sharma.delhi@gmail.com",
    phone: "+91 98111 54321",
    status: "Active",
    avatar: "RS",
    approvedAt: "2024-03-01T16:00:00Z"
  }
];

const INITIAL_REGISTRATION_REQUESTS = [
  {
    id: "REQ-2026-089",
    name: "Dr. K. S. Ramanujan",
    email: "ramanujan.fsl@delhi.gov.in",
    phone: "+91 98661 22334",
    role: "Others",
    customRole: "Director - Forensic Science Laboratory (Digital Forensics Wing)",
    department: "Central Forensic Science Laboratory, CBI Campus",
    idProofType: "Govt Department Identity Card (MHA)",
    idProofNumber: "CFSL-DFW-2018-099",
    reason: "Require cryptographic verification privileges to submit Section 65B forensic hash certificates for active cyber litigation.",
    appliedAt: "2026-09-17T09:45:00Z",
    status: "Pending"
  },
  {
    id: "REQ-2026-090",
    name: "Inspector Neha Sundaram",
    email: "neha.sundaram@ips.gov.in",
    phone: "+91 99887 76655",
    role: "Investigator Officer",
    customRole: "",
    department: "Economic Offences Wing (EOW), Unit IV",
    idProofType: "State Police Service Card",
    idProofNumber: "EOW-DL-5120",
    reason: "Assigned as co-investigator on multi-crore public procurement forgery inquiry NLADR/2026/041.",
    appliedAt: "2026-09-18T08:15:00Z",
    status: "Pending"
  },
  {
    id: "REQ-2026-091",
    name: "Pooja V. Deshmukh",
    email: "pooja.deshmukh@rediffmail.com",
    phone: "+91 97654 32100",
    role: "Citizen",
    customRole: "",
    department: "Individual Complainant",
    idProofType: "Aadhaar e-KYC Verification",
    idProofNumber: "XXXX-XXXX-4519",
    reason: "To track status of Cyber Impersonation & Online Extortion FIR No. 219/2026 lodged at Connaught Place PS.",
    appliedAt: "2026-09-18T11:20:00Z",
    status: "Pending"
  }
];

const INITIAL_CASES = [
  {
    id: "CAS-2026-0101",
    caseNumber: "NLADR/2026/EOW-0101",
    firNumber: "FIR No. 412/2026, PS Barakhamba Road",
    title: "State of NCT Delhi vs. Apex Tech Synthetics (Public Procurement Fraud)",
    category: "Economic Offence & Financial Forgery",
    statuteSections: "Sec 318, 336, 340 of Bharatiya Nyaya Sanhita (BNS) & Sec 66D IT Act",
    complainant: "Rajesh Kumar Sharma",
    complainantId: "USR-CIT-001",
    complainantContact: "+91 98111 54321",
    assignedIO: "Vikramaditya Rathore",
    assignedIOId: "USR-IO-001",
    assignedLegalOfficer: "Adv. Ananya Mehta",
    assignedLegalOfficerId: "USR-LEG-001",
    recordOfficerId: "USR-REC-001",
    status: "Under Investigation", // Under Investigation, Charge-sheet Filed, In Trial, Solved/Disposed
    progressPercent: 65,
    filingDate: "2026-04-12",
    priority: "High",
    courtName: "Special CBI & EOW Sessions Court, Patiala House",
    presidingJudge: "Hon'ble Special Judge R. K. Goel",
    nextHearingDate: "2026-09-24",
    hearingStage: "Arguments on Bail & Admissibility of Forensic Digital Logs",
    archiveLocation: {
      vaultNumber: "Vault-03 (Classified)",
      rackNumber: "R-14",
      shelfNumber: "Shelf-B",
      classification: "Restricted Confidential"
    },
    teamMembers: [
      { name: "Vikramaditya Rathore", role: "Lead Investigator Officer (SP)", phone: "+91 98712 34567" },
      { name: "Insp. Devinder Chawla", role: "Sub-Inspector (Field Seizures)", phone: "+91 98111 22334" },
      { name: "Dr. K. S. Ramanujan", role: "Forensic Digital Analyst", phone: "+91 98661 22334" },
      { name: "Adv. Ananya Mehta", role: "Prosecuting Officer", phone: "+91 98234 56789" }
    ],
    findings: [
      {
        id: "FND-01",
        date: "2026-04-15",
        author: "Vikramaditya Rathore",
        title: "Preliminary Seizure of Servers & Audit Trails",
        description: "Executing search warrant at Nehru Place corporate office. 4 NVMe hard drives and cloud gateway logs seized under panchnama.",
        tag: "Field Seizure"
      },
      {
        id: "FND-02",
        date: "2026-06-02",
        author: "Dr. K. S. Ramanujan",
        title: "Forensic Hash Match Confirms Document Alteration",
        description: "Comparative cryptographic analysis of e-tender quotation PDF matches modified digital signatures using compromised cert #4491.",
        tag: "Forensic Lab"
      },
      {
        id: "FND-03",
        date: "2026-08-20",
        author: "Vikramaditya Rathore",
        title: "Bank Remittance Trace Completed",
        description: "Traced diversion of ₹4.82 Crores into three dummy shell corporations incorporated in Mauritius. Letters Rogatory initiated.",
        tag: "Financial Audit"
      }
    ],
    documents: [
      {
        id: "DOC-2026-001",
        name: "Certified Copy of Original FIR No. 412_2026.pdf",
        type: "FIR Dossier",
        uploadedBy: "Vikramaditya Rathore",
        uploadedDate: "2026-04-12",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        tamperVerified: true,
        fileSize: "2.4 MB",
        accessLevel: "Confidential"
      },
      {
        id: "DOC-2026-002",
        name: "Central Forensic Science Lab Report (Sec 65B Hash Cert).pdf",
        type: "Forensic Evidence",
        uploadedBy: "Dr. K. S. Ramanujan",
        uploadedDate: "2026-06-03",
        sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
        tamperVerified: true,
        fileSize: "14.8 MB",
        accessLevel: "Classified"
      },
      {
        id: "DOC-2026-003",
        name: "Draft Charge Sheet Under Sec 173 CrPC.pdf",
        type: "Charge Sheet",
        uploadedBy: "Adv. Ananya Mehta",
        uploadedDate: "2026-08-30",
        sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        tamperVerified: true,
        fileSize: "8.1 MB",
        accessLevel: "Restricted"
      }
    ],
    citizenGrievances: [
      {
        id: "GRV-01",
        date: "2026-07-10",
        subject: "Request for status update on recovering defrauded earnest money",
        status: "Actioned by IO",
        reply: "Property attachment notice issued to Registrar of Companies under Section 107 BNSS."
      }
    ]
  },
  {
    id: "CAS-2026-0102",
    caseNumber: "NLADR/2026/CYB-0204",
    firNumber: "FIR No. 188/2026, Special Cyber Cell Mandir Marg",
    title: "State vs. Syndicate of Fake Govt Land Registry Allotment Portals",
    category: "Cyber Crime & Sovereign Impersonation",
    statuteSections: "Sec 338, 318(4) BNS & Sec 66, 66C IT Act 2000",
    complainant: "Department of Revenue & Land Records (Ex-Officio)",
    complainantId: "GOV-REV-01",
    complainantContact: "+91 11 2309 4410",
    assignedIO: "Vikramaditya Rathore",
    assignedIOId: "USR-IO-001",
    assignedLegalOfficer: "Adv. Ananya Mehta",
    assignedLegalOfficerId: "USR-LEG-001",
    recordOfficerId: "USR-REC-001",
    status: "Charge-sheet Filed",
    progressPercent: 85,
    filingDate: "2026-02-18",
    priority: "Urgent",
    courtName: "Chief Metropolitan Magistrate Court, Rouse Avenue",
    presidingJudge: "Hon'ble CMM Smt. Manjula Joshi",
    nextHearingDate: "2026-09-28",
    hearingStage: "Scrutiny of Documents & Framing of Charges",
    archiveLocation: {
      vaultNumber: "Vault-01 (Digital Archive)",
      rackNumber: "R-08",
      shelfNumber: "Shelf-D",
      classification: "Secret"
    },
    teamMembers: [
      { name: "Vikramaditya Rathore", role: "Lead Investigator Officer (SP)", phone: "+91 98712 34567" },
      { name: "Insp. Tarun Nanda", role: "Cyber Forensics & IP Tracer", phone: "+91 98119 44556" },
      { name: "Adv. Ananya Mehta", role: "Prosecuting Officer", phone: "+91 98234 56789" }
    ],
    findings: [
      {
        id: "FND-10",
        date: "2026-03-01",
        author: "Vikramaditya Rathore",
        title: "IP Origin & Domain Seizure",
        description: "Phishing portal hosted on offshore bulletproof servers seized with assistance of CERT-In & Interpol Notice.",
        tag: "Cyber Forensics"
      },
      {
        id: "FND-11",
        date: "2026-05-14",
        author: "Adv. Ananya Mehta",
        title: "Formal Charge-sheet Finalized",
        description: "900-page comprehensive charge-sheet filed before the Learned CMM with Section 65B certified evidence binder.",
        tag: "Charge-sheet"
      }
    ],
    documents: [
      {
        id: "DOC-2026-010",
        name: "CERT-In Threat Intelligence & IP Attribution Dossier.pdf",
        type: "Cyber Forensics",
        uploadedBy: "Vikramaditya Rathore",
        uploadedDate: "2026-03-05",
        sha256: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
        tamperVerified: true,
        fileSize: "18.2 MB",
        accessLevel: "Secret"
      },
      {
        id: "DOC-2026-011",
        name: "Final Police Report (Charge Sheet) Sec 193 BNSS.pdf",
        type: "Charge Sheet",
        uploadedBy: "Adv. Ananya Mehta",
        uploadedDate: "2026-05-15",
        sha256: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        tamperVerified: true,
        fileSize: "22.7 MB",
        accessLevel: "Restricted"
      }
    ],
    citizenGrievances: []
  },
  {
    id: "CAS-2026-0103",
    caseNumber: "NLADR/2026/LGL-0309",
    firNumber: "Criminal Case No. 892/2025, Tis Hazari Courts",
    title: "National Infrastructure Project Corrupt Cartelization Inquiry",
    category: "Anti-Corruption & Prevention of Bribery",
    statuteSections: "Sec 7, 13 Prevention of Corruption Act 1988 & Sec 61(2) BNS",
    complainant: "Central Vigilance Commission (Reference # CVC/2025/998)",
    complainantId: "GOV-CVC-01",
    complainantContact: "+91 11 2465 1000",
    assignedIO: "Vikramaditya Rathore",
    assignedIOId: "USR-IO-001",
    assignedLegalOfficer: "Adv. Ananya Mehta",
    assignedLegalOfficerId: "USR-LEG-001",
    recordOfficerId: "USR-REC-001",
    status: "In Trial",
    progressPercent: 92,
    filingDate: "2025-11-10",
    priority: "Urgent",
    courtName: "Special Judge PC Act, Tis Hazari Court Complex",
    presidingJudge: "Hon'ble Special Judge K. L. Manhas",
    nextHearingDate: "2026-09-22",
    hearingStage: "Prosecution Evidence (PW-3 Cross Examination)",
    archiveLocation: {
      vaultNumber: "Vault-02 (Secure Hard Evidence)",
      rackNumber: "R-02",
      shelfNumber: "Shelf-A",
      classification: "Secret"
    },
    teamMembers: [
      { name: "Vikramaditya Rathore", role: "Lead Investigator Officer (SP)", phone: "+91 98712 34567" },
      { name: "Adv. Ananya Mehta", role: "Special Public Prosecutor", phone: "+91 98234 56789" },
      { name: "Om Prakash Verma", role: "Physical Custody Guardian", phone: "+91 94120 98765" }
    ],
    findings: [
      {
        id: "FND-20",
        date: "2026-01-18",
        author: "Adv. Ananya Mehta",
        title: "Prosecution Witness PW-1 & PW-2 Deposition Concluded",
        description: "Official handwriting expert affirmed that clandestine ledger signatures belong to Accused No. 1.",
        tag: "Court Witness"
      }
    ],
    documents: [
      {
        id: "DOC-2026-020",
        name: "Forensic Document Examination Laboratory Report.pdf",
        type: "Forensic Evidence",
        uploadedBy: "Vikramaditya Rathore",
        uploadedDate: "2025-12-14",
        sha256: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
        tamperVerified: true,
        fileSize: "6.9 MB",
        accessLevel: "Secret"
      }
    ],
    citizenGrievances: []
  },
  {
    id: "CAS-2026-0104",
    caseNumber: "NLADR/2026/GEN-0440",
    firNumber: "FIR No. 89/2026, PS Connaught Place",
    title: "Investigation into Cross-Border Trade License Misuse & Duty Evasion",
    category: "Customs, Revenue & Document Forgery",
    statuteSections: "Sec 132 Customs Act & Sec 336(3) BNS",
    complainant: "Directorate of Revenue Intelligence (DRI)",
    complainantId: "GOV-DRI-01",
    complainantContact: "+91 11 2337 9901",
    assignedIO: "Unassigned",
    assignedIOId: null,
    assignedLegalOfficer: "Adv. Ananya Mehta",
    assignedLegalOfficerId: "USR-LEG-001",
    recordOfficerId: "USR-REC-001",
    status: "Under Investigation",
    progressPercent: 30,
    filingDate: "2026-09-02",
    priority: "Normal",
    courtName: "ACMM Special Economic Offences Court",
    presidingJudge: "Hon'ble ACMM S. P. Srivastava",
    nextHearingDate: "2026-10-15",
    hearingStage: "Preliminary Cognizance & Verification of Records",
    archiveLocation: {
      vaultNumber: "Vault-04",
      rackNumber: "R-05",
      shelfNumber: "Shelf-C",
      classification: "Restricted"
    },
    teamMembers: [],
    findings: [],
    documents: [
      {
        id: "DOC-2026-030",
        name: "Seizure Memo of Fictitious Bills of Lading.pdf",
        type: "Seizure Memo",
        uploadedBy: "Om Prakash Verma",
        uploadedDate: "2026-09-03",
        sha256: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
        tamperVerified: true,
        fileSize: "3.1 MB",
        accessLevel: "Restricted"
      }
    ],
    citizenGrievances: []
  },
  {
    id: "CAS-2026-0105",
    caseNumber: "NLADR/2025/DIS-0991",
    firNumber: "FIR No. 551/2025, PS Hauz Khas",
    title: "State vs. Global Media Piracy & Copyright Infringement Ring",
    category: "Intellectual Property & Cyber Piracy",
    statuteSections: "Sec 63, 65 Copyright Act 1957 & Sec 66 IT Act",
    complainant: "Indian Motion Picture & Broadcasters Guild",
    complainantId: "ORG-BCG-01",
    complainantContact: "+91 22 2682 9900",
    assignedIO: "Vikramaditya Rathore",
    assignedIOId: "USR-IO-001",
    assignedLegalOfficer: "Adv. Ananya Mehta",
    assignedLegalOfficerId: "USR-LEG-001",
    recordOfficerId: "USR-REC-001",
    status: "Solved/Disposed",
    progressPercent: 100,
    filingDate: "2025-06-14",
    disposedDate: "2026-08-11",
    disposalOutcome: "Conviction Secured: 3 Accused Sentenced to 3 Years Rigorous Imprisonment & ₹50 Lakh Fine Deposited.",
    priority: "Normal",
    courtName: "District & Sessions Court, Saket Complex",
    presidingJudge: "Hon'ble ASJ M. K. Aggarwal",
    nextHearingDate: "Disposed",
    hearingStage: "Case Concluded / Sentenced",
    archiveLocation: {
      vaultNumber: "Vault-05 (Permanent Archival)",
      rackNumber: "R-19",
      shelfNumber: "Shelf-F",
      classification: "Public Judicial Record"
    },
    teamMembers: [
      { name: "Vikramaditya Rathore", role: "Lead Investigator Officer (SP)", phone: "+91 98712 34567" },
      { name: "Adv. Ananya Mehta", role: "Prosecuting Officer", phone: "+91 98234 56789" }
    ],
    findings: [
      {
        id: "FND-30",
        date: "2026-08-11",
        author: "Adv. Ananya Mehta",
        title: "Final Conviction Order Delivered",
        description: "The Learned Sessions Court upheld all prosecution charges; certified judgement copy archived in permanent digital vault.",
        tag: "Judgement"
      }
    ],
    documents: [
      {
        id: "DOC-2026-040",
        name: "Final Certified Judgement and Order of Conviction.pdf",
        type: "Judgement / Order",
        uploadedBy: "Adv. Ananya Mehta",
        uploadedDate: "2026-08-12",
        sha256: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
        tamperVerified: true,
        fileSize: "5.7 MB",
        accessLevel: "Public Record"
      }
    ],
    citizenGrievances: []
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-9921",
    timestamp: "2026-09-18T12:05:22Z",
    actor: "Adv. Ananya Mehta",
    actorRole: "Legal Officer",
    action: "Hearing Outcome Updated",
    target: "CAS-2026-0103 ( Tis Hazari Special Court )",
    ipAddress: "10.14.22.81 (Gov-Intranet)",
    hashVerification: "PASSED (SHA-256 Valid)"
  },
  {
    id: "LOG-9920",
    timestamp: "2026-09-18T10:44:11Z",
    actor: "Vikramaditya Rathore",
    actorRole: "Investigator Officer",
    action: "Investigation Diary Entry Added",
    target: "CAS-2026-0101 (Seizure Memo Annexure-IV)",
    ipAddress: "10.14.22.39 (Cyber Cell)",
    hashVerification: "PASSED (SHA-256 Valid)"
  },
  {
    id: "LOG-9919",
    timestamp: "2026-09-18T09:12:03Z",
    actor: "Dr. Arvind Sharma, IAS",
    actorRole: "Administrator",
    action: "Access Role Approved",
    target: "Inspector Rameshwar Dutt (EOW)",
    ipAddress: "10.14.1.2 (Secretariat)",
    hashVerification: "PASSED (SHA-256 Valid)"
  },
  {
    id: "LOG-9918",
    timestamp: "2026-09-17T17:30:45Z",
    actor: "Om Prakash Verma",
    actorRole: "Record Officer",
    action: "Physical Chain of Custody Handover",
    target: "Exhibit Ex-101/A transferred to CFSL Ballistics",
    ipAddress: "10.14.8.100 (Central Vault)",
    hashVerification: "PASSED (SHA-256 Valid)"
  }
];
