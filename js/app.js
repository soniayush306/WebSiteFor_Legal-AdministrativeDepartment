/**
 * National Legal & Investigation Document Repository (NLADR)
 * Department of Legal & Administrative Affairs - Government of India
 * Core Application Orchestrator, Router & Modal Engine
 */

class AppRouter {
  constructor() {
    this.authManager = new AuthManager();
    this.init();
  }

  init() {
    this.setupAccessibility();
    this.setupModals();
    this.setupQuickSearch();
    this.render();

    // Subscribe to state changes
    appState.subscribe(() => {
      this.updateNavbarUserBadge();
    });
  }

  render() {
    const authView = document.getElementById("authView");
    const dashboardView = document.getElementById("dashboardView");
    const demoQuickbar = document.getElementById("demoQuickbar");
    const currentUser = appState.currentUser;

    this.updateNavbarUserBadge();

    if (!currentUser) {
      if (authView) authView.style.display = "block";
      if (dashboardView) dashboardView.style.display = "none";
      this.updateActiveRoleChip(null);
      return;
    }

    if (authView) authView.style.display = "none";
    if (dashboardView) {
      dashboardView.style.display = "block";
      dashboardView.innerHTML = ""; // Clear existing

      const role = currentUser.role;
      this.updateActiveRoleChip(role);

      if (role === "Administrator") {
        AdminDashboard.render(dashboardView);
      } else if (role === "Investigator Officer") {
        InvestigatorDashboard.render(dashboardView);
      } else if (role === "Legal Officer") {
        LegalDashboard.render(dashboardView);
      } else if (role === "Record Officer") {
        RecordDashboard.render(dashboardView);
      } else if (role === "Citizen") {
        CitizenDashboard.render(dashboardView);
      } else if (role === "Others") {
        // Render specialized allied dashboard with custom designation
        this.renderOthersDashboard(dashboardView, currentUser);
      } else {
        AdminDashboard.render(dashboardView);
      }
    }
  }

  renderOthersDashboard(container, user) {
    container.innerHTML = `
      <div class="dashboard-banner">
        <div class="banner-left">
          <div class="officer-avatar" style="background: #102a45; color: #ffd875;">${user.avatar || "SO"}</div>
          <div class="banner-info">
            <h2>${user.name}</h2>
            <div class="banner-meta">
              <span class="banner-meta-item">🔬 <strong>Specialized Designation:</strong> ${user.customRole || user.designation}</span>
              <span class="banner-meta-item">📋 <strong>Credentials ID:</strong> ${user.badgeNumber}</span>
              <span class="banner-meta-item">🏢 <strong>Allied Wing:</strong> ${user.department}</span>
              <span class="banner-meta-item">🛡️ <strong>Authorization Status:</strong> Approved by Principal Secretary</span>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <button class="btn btn-saffron btn-sm" onclick="window.openUploadEvidenceModal('${appState.cases[0].id}')">
            Submit Specialized Technical Report
          </button>
        </div>
      </div>

      <div class="gov-card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <div class="card-title">
            <span>Specialized Forensic & Technical Consultation Portfolio</span>
          </div>
          <span class="badge badge-secret">${user.customRole || 'Allied Agency Specialist'}</span>
        </div>
        <div class="card-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            As an authorized external specialist (${user.customRole || 'Technical Expert'}), you have Section 65B cryptographic upload privileges to deposit certified analysis reports and consult on ongoing investigations.
          </p>

          <h4 style="font-size: 0.92rem; color: var(--gov-navy-deep); margin-bottom: 0.75rem;">Consulting Matters:</h4>
          <div class="table-responsive">
            <table class="gov-table">
              <thead>
                <tr>
                  <th>Case Dossier</th>
                  <th>Category</th>
                  <th>Lead Investigator</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${appState.cases.slice(0, 3).map(c => `
                  <tr>
                    <td>
                      <strong>${c.caseNumber}</strong>
                      <div style="font-size: 0.74rem; color: var(--text-muted);">${c.title}</div>
                    </td>
                    <td>${c.category}</td>
                    <td>👮 ${c.assignedIO}</td>
                    <td><span class="badge badge-normal">${c.status}</span></td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.openUploadEvidenceModal('${c.id}')">
                        Upload Lab Certificate
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  updateNavbarUserBadge() {
    const user = appState.currentUser;
    const navUserWrap = document.getElementById("navUserWrap");
    const navUserName = document.getElementById("navUserName");
    const navUserRole = document.getElementById("navUserRole");
    const logoutBtn = document.getElementById("logoutNavBtn");

    if (user) {
      if (navUserWrap) navUserWrap.style.display = "flex";
      if (logoutBtn) logoutBtn.style.display = "inline-flex";
      if (navUserName) navUserName.textContent = user.name;
      if (navUserRole) navUserRole.textContent = user.role + (user.customRole ? ` (${user.customRole})` : "");
    } else {
      if (navUserWrap) navUserWrap.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  updateActiveRoleChip(activeRole) {
    document.querySelectorAll(".role-chip-btn").forEach(btn => {
      if (btn.getAttribute("data-role") === activeRole) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  setupAccessibility() {
    // Font resizing
    const btnFontDecrease = document.getElementById("btnFontDecrease");
    const btnFontNormal = document.getElementById("btnFontNormal");
    const btnFontIncrease = document.getElementById("btnFontIncrease");

    if (btnFontDecrease) {
      btnFontDecrease.addEventListener("click", () => {
        document.documentElement.style.setProperty("--base-font-size", "13.5px");
      });
    }
    if (btnFontNormal) {
      btnFontNormal.addEventListener("click", () => {
        document.documentElement.style.setProperty("--base-font-size", "15px");
      });
    }
    if (btnFontIncrease) {
      btnFontIncrease.addEventListener("click", () => {
        document.documentElement.style.setProperty("--base-font-size", "16.5px");
      });
    }

    // High Contrast Toggle
    const btnHighContrast = document.getElementById("btnHighContrast");
    if (btnHighContrast) {
      btnHighContrast.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
        document.body.classList.remove("dark-theme");
      });
    }

    // Dark Mode Toggle
    const btnThemeToggle = document.getElementById("btnThemeToggle");
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        document.body.classList.remove("high-contrast");
      });
    }

    // Language Toggle (English / हिंदी)
    const btnLangToggle = document.getElementById("btnLangToggle");
    if (btnLangToggle) {
      btnLangToggle.addEventListener("click", () => {
        const isHindi = btnLangToggle.getAttribute("data-lang") === "hi";
        if (isHindi) {
          btnLangToggle.setAttribute("data-lang", "en");
          btnLangToggle.textContent = "English";
          window.showToast("Portal language set to: English", "normal");
        } else {
          btnLangToggle.setAttribute("data-lang", "hi");
          btnLangToggle.textContent = "हिन्दी";
          window.showToast("पोर्टल भाषा बदली गई: हिन्दी", "normal");
        }
      });
    }
  }

  setupQuickSearch() {
    const globalSearch = document.getElementById("globalCaseSearch");
    if (globalSearch) {
      globalSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const q = globalSearch.value.trim().toLowerCase();
          if (!q) return;

          const match = appState.cases.find(c => 
            c.caseNumber.toLowerCase().includes(q) || 
            c.firNumber.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q)
          );

          if (match) {
            window.showToast(`Found Match: ${match.caseNumber} (${match.status})`, "success");
            window.openReceiptModal(match.id);
          } else {
            window.showToast(`No case file matched: "${globalSearch.value}". Try "412" or "EOW".`, "urgent");
          }
        }
      });
    }
  }

  setupModals() {
    // Close button click on any modal
    document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
      });
    });

    // Close when clicking outside dialog
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("open");
        }
      });
    });
  }
}

// --- Global Modal Actions ---

window.openCaseAssignmentModal = function(caseId) {
  const c = appState.cases.find(item => item.id === caseId);
  if (!c) return;

  const modal = document.getElementById("modalCaseAssignment");
  if (!modal) return;

  document.getElementById("assignCaseDossierNumber").textContent = `${c.caseNumber} (${c.firNumber})`;
  document.getElementById("assignCaseTitle").textContent = c.title;
  document.getElementById("assignCaseHiddenId").value = c.id;

  // Populate IO dropdown
  const ioSelect = document.getElementById("assignIOSelect");
  const legalSelect = document.getElementById("assignLegalSelect");
  const prioritySelect = document.getElementById("assignPrioritySelect");

  const ios = appState.users.filter(u => u.role === "Investigator Officer");
  const legals = appState.users.filter(u => u.role === "Legal Officer");

  ioSelect.innerHTML = ios.map(io => `
    <option value="${io.id}" ${io.id === c.assignedIOId ? 'selected' : ''}>
      ${io.name} (${io.badgeNumber} - ${io.designation})
    </option>
  `).join("");

  legalSelect.innerHTML = legals.map(leg => `
    <option value="${leg.id}" ${leg.id === c.assignedLegalOfficerId ? 'selected' : ''}>
      ${leg.name} (${leg.badgeNumber} - ${leg.designation})
    </option>
  `).join("");

  prioritySelect.value = c.priority || "High";
  document.getElementById("assignNotesInput").value = "";

  modal.classList.add("open");
};

window.handleCaseAssignmentSubmit = function(e) {
  e.preventDefault();
  const caseId = document.getElementById("assignCaseHiddenId").value;
  const ioId = document.getElementById("assignIOSelect").value;
  const legalId = document.getElementById("assignLegalSelect").value;
  const priority = document.getElementById("assignPrioritySelect").value;
  const notes = document.getElementById("assignNotesInput").value.trim();

  appState.assignCase(caseId, {
    assignedIOId: ioId,
    assignedLegalOfficerId: legalId,
    priority,
    notes
  });

  document.getElementById("modalCaseAssignment").classList.remove("open");
  window.showToast("Case allocation & administrative directives updated successfully!", "success");
  window.appRouter.render();
};

window.openAddFindingModal = function(caseId) {
  const modal = document.getElementById("modalAddFinding");
  if (!modal) return;
  document.getElementById("findingCaseHiddenId").value = caseId;
  document.getElementById("findingTitle").value = "";
  document.getElementById("findingDescription").value = "";
  modal.classList.add("open");
};

window.handleAddFindingSubmit = function(e) {
  e.preventDefault();
  const caseId = document.getElementById("findingCaseHiddenId").value;
  const title = document.getElementById("findingTitle").value.trim();
  const description = document.getElementById("findingDescription").value.trim();
  const tag = document.getElementById("findingTag").value;

  if (!title || !description) return;

  appState.addInvestigationFinding(caseId, { title, description, tag });

  document.getElementById("modalAddFinding").classList.remove("open");
  window.showToast("Case diary entry recorded with Section 65B hash log.", "success");
  window.appRouter.render();
};

window.openUploadEvidenceModal = function(caseId, isCitizen = false) {
  const modal = document.getElementById("modalUploadEvidence");
  if (!modal) return;

  document.getElementById("evidenceCaseHiddenId").value = caseId;
  document.getElementById("evidenceDocName").value = "";
  document.getElementById("evidenceDocType").value = isCitizen ? "Supplementary Proof" : "Forensic Evidence";
  
  // Pre-generate pseudo SHA-256 preview
  const previewHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  document.getElementById("evidenceHashPreview").textContent = previewHash;

  modal.classList.add("open");
};

window.handleEvidenceUploadSubmit = function(e) {
  e.preventDefault();
  const caseId = document.getElementById("evidenceCaseHiddenId").value;
  const name = document.getElementById("evidenceDocName").value.trim();
  const type = document.getElementById("evidenceDocType").value;
  const accessLevel = document.getElementById("evidenceAccessLevel").value;
  const sha256 = document.getElementById("evidenceHashPreview").textContent;

  if (!name) return;

  appState.addDocument(caseId, {
    name: name.endsWith(".pdf") ? name : `${name}.pdf`,
    type,
    fileSize: (Math.random() * 8 + 1).toFixed(1) + " MB",
    accessLevel,
    sha256
  });

  document.getElementById("modalUploadEvidence").classList.remove("open");
  window.showToast("Evidence document cryptographically admitted into vault.", "success");
  window.appRouter.render();
};

window.openHearingOutcomeModal = function(caseId) {
  const c = appState.cases.find(item => item.id === caseId);
  if (!c) return;

  const modal = document.getElementById("modalHearingOutcome");
  if (!modal) return;

  document.getElementById("hearingCaseHiddenId").value = c.id;
  document.getElementById("hearingCaseDossier").textContent = `${c.caseNumber} (${c.title})`;
  document.getElementById("hearingNextDate").value = c.nextHearingDate === "Disposed" ? "" : c.nextHearingDate;
  document.getElementById("hearingStageInput").value = c.hearingStage;
  document.getElementById("hearingCourtInput").value = c.courtName;
  document.getElementById("hearingJudgeInput").value = c.presidingJudge;
  document.getElementById("hearingNotesInput").value = "";

  modal.classList.add("open");
};

window.handleHearingOutcomeSubmit = function(e) {
  e.preventDefault();
  const caseId = document.getElementById("hearingCaseHiddenId").value;
  const nextHearingDate = document.getElementById("hearingNextDate").value;
  const hearingStage = document.getElementById("hearingStageInput").value.trim();
  const courtName = document.getElementById("hearingCourtInput").value.trim();
  const presidingJudge = document.getElementById("hearingJudgeInput").value.trim();
  const outcomeNotes = document.getElementById("hearingNotesInput").value.trim();

  appState.updateHearingSchedule(caseId, {
    nextHearingDate,
    hearingStage,
    courtName,
    presidingJudge,
    outcomeNotes
  });

  document.getElementById("modalHearingOutcome").classList.remove("open");
  window.showToast("Hearing outcome and schedule updated in Court Register.", "success");
  window.appRouter.render();
};

window.openCitizenGrievanceModal = function(caseId) {
  const modal = document.getElementById("modalCitizenGrievance");
  if (!modal) return;
  document.getElementById("grievanceCaseHiddenId").value = caseId;
  document.getElementById("grievanceSubject").value = "";
  document.getElementById("grievanceDetails").value = "";
  modal.classList.add("open");
};

window.handleCitizenGrievanceSubmit = function(e) {
  e.preventDefault();
  const caseId = document.getElementById("grievanceCaseHiddenId").value;
  const subject = document.getElementById("grievanceSubject").value.trim();
  const details = document.getElementById("grievanceDetails").value.trim();

  if (!subject) return;

  appState.addCitizenGrievance(caseId, subject, details);

  document.getElementById("modalCitizenGrievance").classList.remove("open");
  window.showToast("Your representation inquiry has been forwarded to the Supervisory Officer.", "success");
  window.appRouter.render();
};

window.openReceiptModal = function(caseId) {
  const c = appState.cases.find(item => item.id === caseId) || appState.cases[0];
  const modal = document.getElementById("modalReceipt");
  if (!modal) return;

  document.getElementById("receiptCaseNo").textContent = c.caseNumber;
  document.getElementById("receiptFirNo").textContent = c.firNumber;
  document.getElementById("receiptTitle").textContent = c.title;
  document.getElementById("receiptStatute").textContent = c.statuteSections;
  document.getElementById("receiptComplainant").textContent = c.complainant;
  document.getElementById("receiptIO").textContent = c.assignedIO;
  document.getElementById("receiptLegal").textContent = c.assignedLegalOfficer;
  document.getElementById("receiptCourt").textContent = c.courtName;
  document.getElementById("receiptHearing").textContent = c.nextHearingDate;
  document.getElementById("receiptStatus").textContent = c.status;
  document.getElementById("receiptDate").textContent = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });

  modal.classList.add("open");
};

// --- Toast Notification Engine ---

window.showToast = function(message, type = "normal") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "success" : type === "urgent" ? "urgent" : ""}`;
  toast.innerHTML = `
    <span>${type === "success" ? "✅" : type === "urgent" ? "⚠️" : "ℹ️"}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.appRouter = new AppRouter();
});
