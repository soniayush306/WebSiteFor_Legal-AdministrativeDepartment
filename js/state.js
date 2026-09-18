/**
 * National Legal & Investigation Document Repository (NLADR)
 * State Management & Reactive Store with LocalStorage Persistence
 */

class AppState {
  constructor() {
    this.STORAGE_KEY = "NLADR_STATE_V1";
    this.subscribers = [];
    this.init();
  }

  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.users = parsed.users || INITIAL_USERS;
        this.requests = parsed.requests || INITIAL_REGISTRATION_REQUESTS;
        this.cases = parsed.cases || INITIAL_CASES;
        this.auditLogs = parsed.auditLogs || INITIAL_AUDIT_LOGS;
        this.currentUser = parsed.currentUser || INITIAL_USERS[0]; // Default to Admin for easy initial inspection
      } catch (e) {
        console.error("Error loading state from localStorage, resetting:", e);
        this.resetDefaults();
      }
    } else {
      this.resetDefaults();
    }
  }

  resetDefaults() {
    this.users = [...INITIAL_USERS];
    this.requests = [...INITIAL_REGISTRATION_REQUESTS];
    this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.currentUser = this.users[0]; // Admin
    this.save();
  }

  save() {
    const payload = {
      users: this.users,
      requests: this.requests,
      cases: this.cases,
      auditLogs: this.auditLogs,
      currentUser: this.currentUser
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(fn => fn(this));
  }

  // --- Auth & User Actions ---

  setCurrentUser(user) {
    this.currentUser = user;
    this.logAudit({
      actor: user.name,
      actorRole: user.role + (user.customRole ? ` (${user.customRole})` : ""),
      action: "User Session Authenticated",
      target: "National Portal Login Console",
      ipAddress: "10.14.0." + Math.floor(Math.random() * 200 + 1)
    });
    this.save();
  }

  logout() {
    const prev = this.currentUser?.name || "Anonymous";
    this.logAudit({
      actor: prev,
      actorRole: this.currentUser?.role || "Citizen",
      action: "User Session Logged Out",
      target: "National Portal Session Terminated",
      ipAddress: "10.14.0.12"
    });
    this.currentUser = null;
    this.save();
  }

  submitRegistrationRequest(requestData) {
    const newReq = {
      id: "REQ-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900),
      ...requestData,
      appliedAt: new Date().toISOString(),
      status: "Pending"
    };
    this.requests.unshift(newReq);
    this.logAudit({
      actor: requestData.name,
      actorRole: requestData.role + (requestData.customRole ? ` (${requestData.customRole})` : ""),
      action: "New Registration Request Submitted",
      target: `Registration Dossier #${newReq.id}`,
      ipAddress: "10.14.99." + Math.floor(Math.random() * 200 + 1)
    });
    this.save();
    return newReq;
  }

  approveRegistration(requestId, clearanceNotes = "") {
    const reqIndex = this.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return false;

    const req = this.requests[reqIndex];
    req.status = "Approved";
    req.clearanceNotes = clearanceNotes;
    req.decidedAt = new Date().toISOString();

    // Create active user
    const newUser = {
      id: "USR-" + (req.role === "Others" ? "OTH" : req.role.substring(0, 3).toUpperCase()) + "-" + Math.floor(100 + Math.random() * 900),
      username: req.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "."),
      name: req.name,
      role: req.role,
      customRole: req.customRole || "",
      designation: req.customRole || (req.role === "Citizen" ? "Citizen Complainant" : `${req.role} Grade-I`),
      department: req.department || "Government of India",
      badgeNumber: req.idProofNumber || `REG-${Date.now().toString().slice(-4)}`,
      email: req.email,
      phone: req.phone,
      status: "Active",
      avatar: req.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      approvedAt: new Date().toISOString()
    };

    this.users.push(newUser);

    this.logAudit({
      actor: this.currentUser?.name || "Administrator",
      actorRole: "Administrator",
      action: "Registration Request Approved",
      target: `${req.name} (${req.role}${req.customRole ? ` - ${req.customRole}` : ""})`,
      ipAddress: "10.14.1.2"
    });

    this.save();
    return newUser;
  }

  rejectRegistration(requestId, rejectionReason = "") {
    const reqIndex = this.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return false;

    const req = this.requests[reqIndex];
    req.status = "Rejected";
    req.rejectionReason = rejectionReason || "Department credentials could not be verified against Ministry registry.";
    req.decidedAt = new Date().toISOString();

    this.logAudit({
      actor: this.currentUser?.name || "Administrator",
      actorRole: "Administrator",
      action: "Registration Request Rejected",
      target: `${req.name} (Reason: ${req.rejectionReason})`,
      ipAddress: "10.14.1.2"
    });

    this.save();
    return true;
  }

  // --- Case Management Actions ---

  assignCase(caseId, { assignedIOId, assignedLegalOfficerId, priority, notes }) {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (!caseItem) return false;

    const ioUser = this.users.find(u => u.id === assignedIOId);
    const legalUser = this.users.find(u => u.id === assignedLegalOfficerId);

    if (ioUser) {
      caseItem.assignedIO = ioUser.name;
      caseItem.assignedIOId = ioUser.id;
      
      // Update team member list if not already present
      if (!caseItem.teamMembers.some(m => m.name === ioUser.name)) {
        caseItem.teamMembers.unshift({
          name: ioUser.name,
          role: "Lead Investigator Officer",
          phone: ioUser.phone
        });
      }
    }

    if (legalUser) {
      caseItem.assignedLegalOfficer = legalUser.name;
      caseItem.assignedLegalOfficerId = legalUser.id;

      if (!caseItem.teamMembers.some(m => m.name === legalUser.name)) {
        caseItem.teamMembers.push({
          name: legalUser.name,
          role: "Prosecuting Officer",
          phone: legalUser.phone
        });
      }
    }

    if (priority) {
      caseItem.priority = priority;
    }

    if (notes) {
      caseItem.findings.unshift({
        id: "FND-" + Date.now().toString().slice(-4),
        date: new Date().toISOString().split("T")[0],
        author: this.currentUser?.name || "Administrator",
        title: "Official Administrative Directive on Case Reallocation",
        description: notes,
        tag: "Administrative Directive"
      });
    }

    this.logAudit({
      actor: this.currentUser?.name || "Administrator",
      actorRole: "Administrator",
      action: "Case Allocation Updated",
      target: `${caseItem.caseNumber} (IO: ${caseItem.assignedIO}, Legal: ${caseItem.assignedLegalOfficer})`,
      ipAddress: "10.14.1.2"
    });

    this.save();
    return true;
  }

  updateCaseStatus(caseId, newStatus, progressPercent = null) {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (!caseItem) return false;

    caseItem.status = newStatus;
    if (progressPercent !== null) {
      caseItem.progressPercent = progressPercent;
    } else {
      if (newStatus === "Under Investigation") caseItem.progressPercent = 45;
      if (newStatus === "Charge-sheet Filed") caseItem.progressPercent = 75;
      if (newStatus === "In Trial") caseItem.progressPercent = 90;
      if (newStatus === "Solved/Disposed") caseItem.progressPercent = 100;
    }

    this.logAudit({
      actor: this.currentUser?.name || "Authorized Officer",
      actorRole: this.currentUser?.role || "Officer",
      action: `Case Status Changed to "${newStatus}"`,
      target: caseItem.caseNumber,
      ipAddress: "10.14.22.1"
    });

    this.save();
    return true;
  }

  addInvestigationFinding(caseId, { title, description, tag }) {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (!caseItem) return false;

    const newFinding = {
      id: "FND-" + Date.now().toString().slice(-4),
      date: new Date().toISOString().split("T")[0],
      author: this.currentUser?.name || "Investigator Officer",
      title,
      description,
      tag: tag || "Investigative Finding"
    };

    caseItem.findings.unshift(newFinding);

    this.logAudit({
      actor: this.currentUser?.name || "Investigator Officer",
      actorRole: "Investigator Officer",
      action: "Case Diary Finding Recorded",
      target: `${caseItem.caseNumber} - ${title}`,
      ipAddress: "10.14.22.39"
    });

    this.save();
    return newFinding;
  }

  addDocument(caseId, { name, type, fileSize, accessLevel, sha256 = null }) {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (!caseItem) return false;

    // Generate pseudo-cryptographic SHA-256 hash if not provided
    const hash = sha256 || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const newDoc = {
      id: "DOC-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900),
      name,
      type: type || "Legal Exhibit",
      uploadedBy: this.currentUser?.name || "Authorized Personnel",
      uploadedDate: new Date().toISOString().split("T")[0],
      sha256: hash,
      tamperVerified: true,
      fileSize: fileSize || "3.8 MB",
      accessLevel: accessLevel || "Confidential"
    };

    caseItem.documents.unshift(newDoc);

    this.logAudit({
      actor: this.currentUser?.name || "Officer",
      actorRole: this.currentUser?.role || "Officer",
      action: `Cryptographic Evidence Uploaded (${newDoc.type})`,
      target: `${caseItem.caseNumber} / ${newDoc.name} [SHA: ${hash.substring(0, 8)}...]`,
      ipAddress: "10.14.22.40"
    });

    this.save();
    return newDoc;
  }

  updateHearingSchedule(caseId, { nextHearingDate, hearingStage, presidingJudge, courtName, outcomeNotes }) {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (!caseItem) return false;

    if (nextHearingDate) caseItem.nextHearingDate = nextHearingDate;
    if (hearingStage) caseItem.hearingStage = hearingStage;
    if (presidingJudge) caseItem.presidingJudge = presidingJudge;
    if (courtName) caseItem.courtName = courtName;

    if (outcomeNotes) {
      caseItem.findings.unshift({
        id: "FND-CRT-" + Date.now().toString().slice(-4),
        date: new Date().toISOString().split("T")[0],
        author: this.currentUser?.name || "Legal Officer",
        title: "Judicial Hearing Proceedings & Order Note",
        description: outcomeNotes,
        tag: "Court Proceedings"
      });
    }

    this.logAudit({
      actor: this.currentUser?.name || "Adv. Ananya Mehta",
      actorRole: "Legal Officer",
      action: "Court Hearing Schedule & Proceedings Updated",
      target: `${caseItem.caseNumber} -> Next: ${caseItem.nextHearingDate}`,
      ipAddress: "10.14.22.81"
    });

    this.save();
    return true;
  }

  addCitizenGrievance(caseId, subject, details) {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (!caseItem) return false;

    if (!caseItem.citizenGrievances) caseItem.citizenGrievances = [];

    const newGrievance = {
      id: "GRV-" + Date.now().toString().slice(-4),
      date: new Date().toISOString().split("T")[0],
      subject,
      details,
      status: "Submitted to Investigation Unit",
      reply: "Received by Desk Officer. Designated IO will review within 48 hours."
    };

    caseItem.citizenGrievances.unshift(newGrievance);

    this.logAudit({
      actor: this.currentUser?.name || "Citizen Complainant",
      actorRole: "Citizen",
      action: "Representation / Citizen Inquiry Lodged",
      target: `${caseItem.caseNumber} - ${subject}`,
      ipAddress: "192.168.1.10"
    });

    this.save();
    return newGrievance;
  }

  logAudit({ actor, actorRole, action, target, ipAddress, hashVerification = "PASSED (SHA-256 Valid)" }) {
    const log = {
      id: "LOG-" + (10000 + this.auditLogs.length + 1),
      timestamp: new Date().toISOString(),
      actor,
      actorRole,
      action,
      target,
      ipAddress: ipAddress || "10.14.0." + Math.floor(Math.random() * 250 + 1),
      hashVerification
    };
    this.auditLogs.unshift(log);
    // Keep logs bounded
    if (this.auditLogs.length > 100) this.auditLogs.pop();
  }

  // --- Convenience Getters ---

  getStats() {
    const total = this.cases.length;
    const solved = this.cases.filter(c => c.status === "Solved/Disposed").length;
    const pending = this.cases.filter(c => c.status !== "Solved/Disposed").length;
    const inTrial = this.cases.filter(c => c.status === "In Trial").length;
    const underInvestigation = this.cases.filter(c => c.status === "Under Investigation").length;
    const chargesheetFiled = this.cases.filter(c => c.status === "Charge-sheet Filed").length;
    const pendingApprovals = this.requests.filter(r => r.status === "Pending").length;
    const totalDocuments = this.cases.reduce((acc, c) => acc + (c.documents?.length || 0), 0);

    return {
      total,
      solved,
      pending,
      inTrial,
      underInvestigation,
      chargesheetFiled,
      pendingApprovals,
      totalDocuments
    };
  }

  getCasesForCurrentUser() {
    if (!this.currentUser) return [];

    const role = this.currentUser.role;

    if (role === "Administrator" || role === "Record Officer" || role === "Others") {
      return this.cases;
    }

    if (role === "Investigator Officer") {
      return this.cases.filter(c => c.assignedIOId === this.currentUser.id || c.assignedIO === this.currentUser.name);
    }

    if (role === "Legal Officer") {
      return this.cases.filter(c => c.assignedLegalOfficerId === this.currentUser.id || c.assignedLegalOfficer === this.currentUser.name);
    }

    if (role === "Citizen") {
      // Citizen only sees cases where they are complainant
      return this.cases.filter(c => 
        c.complainantId === this.currentUser.id || 
        c.complainant.toLowerCase() === this.currentUser.name.toLowerCase()
      );
    }

    return [];
  }
}

// Global Singleton
const appState = new AppState();
