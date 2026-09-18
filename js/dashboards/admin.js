/**
 * National Legal & Investigation Document Repository (NLADR)
 * Administrator Dashboard Renderer
 */

const AdminDashboard = {
  render(container) {
    const stats = appState.getStats();
    const currentUser = appState.currentUser;
    const cases = appState.cases;
    const pendingRequests = appState.requests.filter(r => r.status === "Pending");

    container.innerHTML = `
      <!-- Administrator Persona Banner -->
      <div class="dashboard-banner">
        <div class="banner-left">
          <div class="officer-avatar">${currentUser.avatar || "AS"}</div>
          <div class="banner-info">
            <h2>${currentUser.name}</h2>
            <div class="banner-meta">
              <span class="banner-meta-item">🏛️ <strong>Role:</strong> Administrator (Chief Controller)</span>
              <span class="banner-meta-item">📋 <strong>Badge / ID:</strong> ${currentUser.badgeNumber}</span>
              <span class="banner-meta-item">🏢 <strong>Department:</strong> ${currentUser.department}</span>
              <span class="banner-meta-item">🛡️ <strong>Security Clearance:</strong> Level-5 (National High Security)</span>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <button class="btn btn-saffron btn-sm" id="adminRefreshBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Sync State
          </button>
          <button class="btn btn-secondary btn-sm" id="adminAuditExportBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Audit Log Dossier
          </button>
        </div>
      </div>

      <!-- Key Performance & Governance Metrics Cards -->
      <div class="metrics-grid">
        <div class="metric-card border-blue">
          <div class="metric-icon-wrap blue">📂</div>
          <div class="metric-data">
            <div class="metric-number">${stats.total}</div>
            <div class="metric-label">Total Cases Under Repository</div>
          </div>
        </div>
        <div class="metric-card border-green">
          <div class="metric-icon-wrap green">⚖️</div>
          <div class="metric-data">
            <div class="metric-number">${stats.solved}</div>
            <div class="metric-label">Cases Solved / Disposed</div>
          </div>
        </div>
        <div class="metric-card border-orange">
          <div class="metric-icon-wrap orange">⏳</div>
          <div class="metric-data">
            <div class="metric-number">${stats.pending}</div>
            <div class="metric-label">Active / Pending Cases</div>
          </div>
        </div>
        <div class="metric-card border-red">
          <div class="metric-icon-wrap red">🚨</div>
          <div class="metric-data">
            <div class="metric-number">${pendingRequests.length}</div>
            <div class="metric-label">Pending User Access Approvals</div>
          </div>
        </div>
        <div class="metric-card border-gold">
          <div class="metric-icon-wrap gold">🔒</div>
          <div class="metric-data">
            <div class="metric-number">${stats.totalDocuments}</div>
            <div class="metric-label">Certified Cryptographic Records</div>
          </div>
        </div>
      </div>

      <!-- Pending User Approvals Queue Section (Crucial Requirement) -->
      <div class="gov-card" style="margin-bottom: 2rem;">
        <div class="card-header" style="background: rgba(255, 139, 31, 0.08);">
          <div>
            <div class="card-title" style="color: var(--gov-saffron-dark);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              User Access Clearance & Authorization Queue (${pendingRequests.length} Pending)
            </div>
            <div class="card-subtitle">Administrator authority to verify credentials and Approve or Reject registration requests for Officers, Citizens, and Allied Agencies</div>
          </div>
          <span class="badge ${pendingRequests.length > 0 ? 'badge-urgent' : 'badge-normal'}">
            ${pendingRequests.length > 0 ? 'Requires Action' : 'All Clear'}
          </span>
        </div>

        <div class="table-responsive">
          ${pendingRequests.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
              <strong>No Pending User Clearance Requests</strong>
              <p style="font-size: 0.8rem; margin-top: 4px;">All officer and citizen registration applications have been authorized or reviewed.</p>
            </div>
          ` : `
            <table class="gov-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Applicant Name</th>
                  <th>Requested Role & Designation</th>
                  <th>Official Department / Agency</th>
                  <th>ID Proof Document</th>
                  <th>Statement of Need</th>
                  <th>Application Date</th>
                  <th style="text-align: right;">Administrative Action</th>
                </tr>
              </thead>
              <tbody>
                ${pendingRequests.map(req => `
                  <tr>
                    <td><code>${req.id}</code></td>
                    <td>
                      <div style="font-weight: 700; color: var(--gov-navy-deep);">${req.name}</div>
                      <div style="font-size: 0.74rem; color: var(--text-muted);">${req.email} | ${req.phone}</div>
                    </td>
                    <td>
                      <span class="badge ${req.role === 'Investigator Officer' ? 'badge-investigation' : req.role === 'Legal Officer' ? 'badge-trial' : req.role === 'Others' ? 'badge-secret' : 'badge-normal'}">
                        ${req.role}
                      </span>
                      ${req.customRole ? `<div style="font-size: 0.76rem; font-weight: 600; color: var(--gov-saffron-dark); margin-top: 3px;">Designation: ${req.customRole}</div>` : ''}
                    </td>
                    <td style="font-size: 0.8rem;">${req.department || 'N/A'}</td>
                    <td>
                      <div style="font-size: 0.78rem; font-weight: 600;">${req.idProofType}</div>
                      <code style="font-size: 0.74rem;">${req.idProofNumber}</code>
                    </td>
                    <td style="max-width: 220px; font-size: 0.76rem; color: var(--text-secondary);">${req.reason}</td>
                    <td style="font-size: 0.76rem; white-space: nowrap;">${new Date(req.appliedAt).toLocaleDateString("en-IN")}</td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button class="btn btn-success btn-sm btn-approve-user" data-id="${req.id}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        Approve
                      </button>
                      <button class="btn btn-danger btn-sm btn-reject-user" data-id="${req.id}" style="margin-left: 4px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Reject
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `}
        </div>
      </div>

      <!-- Master Case Progress & Allocation Management Console -->
      <div class="gov-card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Master Case Progress & Officer Allocation Management
            </div>
            <div class="card-subtitle">Comprehensive oversight of all legal proceedings, overall lifecycle progress, and officer allocation authority</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <select class="form-control" id="adminCaseStatusFilter" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; width: auto;">
              <option value="ALL">All Statuses (${cases.length})</option>
              <option value="Under Investigation">Under Investigation (${cases.filter(c => c.status === 'Under Investigation').length})</option>
              <option value="Charge-sheet Filed">Charge-sheet Filed (${cases.filter(c => c.status === 'Charge-sheet Filed').length})</option>
              <option value="In Trial">In Trial (${cases.filter(c => c.status === 'In Trial').length})</option>
              <option value="Solved/Disposed">Solved/Disposed (${cases.filter(c => c.status === 'Solved/Disposed').length})</option>
            </select>
          </div>
        </div>

        <div class="table-toolbar">
          <div class="table-search-box">
            <span class="search-icon">🔍</span>
            <input type="text" class="form-control" id="adminCaseSearchInput" placeholder="Search by Case No, FIR, or Subject..." />
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            Showing <strong id="adminCaseCountLabel">${cases.length}</strong> of ${cases.length} active case files
          </div>
        </div>

        <div class="table-responsive">
          <table class="gov-table" id="adminCasesMasterTable">
            <thead>
              <tr>
                <th>Case Dossier / FIR</th>
                <th>Subject & Offence Details</th>
                <th>Complainant</th>
                <th>Assigned IO</th>
                <th>Assigned Legal Counsel</th>
                <th>Lifecycle Progress</th>
                <th>Status</th>
                <th style="text-align: right;">Case Allocation Authority</th>
              </tr>
            </thead>
            <tbody id="adminCasesTableBody">
              ${this.renderCaseRows(cases)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  renderCaseRows(casesList) {
    if (casesList.length === 0) {
      return `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No cases match the selected filter criteria.
          </td>
        </tr>
      `;
    }

    return casesList.map(c => `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--gov-navy-deep); font-family: monospace;">${c.caseNumber}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${c.firNumber}</div>
          <span class="badge ${c.priority === 'Urgent' ? 'badge-urgent' : c.priority === 'High' ? 'badge-high' : 'badge-normal'}" style="margin-top: 4px;">
            ${c.priority} Priority
          </span>
        </td>
        <td style="max-width: 240px;">
          <div style="font-weight: 600; color: var(--text-primary); font-size: 0.84rem;">${c.title}</div>
          <div style="font-size: 0.75rem; color: var(--gov-ashoka-blue); font-weight: 500; margin-top: 3px;">${c.statuteSections}</div>
        </td>
        <td>
          <div style="font-weight: 600; font-size: 0.8rem;">${c.complainant}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted);">${c.complainantContact}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: ${c.assignedIOId ? 'var(--gov-navy-deep)' : '#d9480f'};">
            ${c.assignedIOId ? `👮 ${c.assignedIO}` : '⚠️ Unassigned'}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Investigator Officer</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--gov-navy-deep);">
            ⚖️ ${c.assignedLegalOfficer}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Public Prosecutor</div>
        </td>
        <td style="min-width: 140px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700;">
            <span>${c.status}</span>
            <span>${c.progressPercent}%</span>
          </div>
          <div class="progress-container">
            <div class="progress-fill" style="width: ${c.progressPercent}%;"></div>
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 3px;">
            Next Hearing: ${c.nextHearingDate}
          </div>
        </td>
        <td>
          <span class="badge ${c.status === 'Under Investigation' ? 'badge-investigation' : c.status === 'Charge-sheet Filed' ? 'badge-chargesheet' : c.status === 'In Trial' ? 'badge-trial' : 'badge-disposed'}">
            ${c.status}
          </span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-primary btn-sm btn-assign-case" data-id="${c.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Assign / Reallocate
          </button>
        </td>
      </tr>
    `).join("");
  },

  attachEvents(container) {
    // Approve User Access button
    container.querySelectorAll(".btn-approve-user").forEach(btn => {
      btn.addEventListener("click", () => {
        const reqId = btn.getAttribute("data-id");
        const newUser = appState.approveRegistration(reqId, "Authorized by Dr. Arvind Sharma, IAS (Principal Secretary)");
        if (newUser) {
          window.showToast(`User ${newUser.name} approved and granted active credentials!`, "success");
          window.appRouter.render();
        }
      });
    });

    // Reject User Access button
    container.querySelectorAll(".btn-reject-user").forEach(btn => {
      btn.addEventListener("click", () => {
        const reqId = btn.getAttribute("data-id");
        const reason = prompt("Enter official rejection reason for Ministry records:", "Incomplete departmental authorization documentation.");
        if (reason !== null) {
          appState.rejectRegistration(reqId, reason);
          window.showToast(`Registration request ${reqId} rejected.`, "urgent");
          window.appRouter.render();
        }
      });
    });

    // Open Case Allocation Modal
    container.querySelectorAll(".btn-assign-case").forEach(btn => {
      btn.addEventListener("click", () => {
        const caseId = btn.getAttribute("data-id");
        window.openCaseAssignmentModal(caseId);
      });
    });

    // Case Status Filter
    const filterSelect = container.querySelector("#adminCaseStatusFilter");
    const searchInput = container.querySelector("#adminCaseSearchInput");
    const tableBody = container.querySelector("#adminCasesTableBody");
    const countLabel = container.querySelector("#adminCaseCountLabel");

    const applyFilters = () => {
      const selectedStatus = filterSelect.value;
      const query = searchInput.value.toLowerCase().trim();

      let filtered = appState.cases;
      if (selectedStatus !== "ALL") {
        filtered = filtered.filter(c => c.status === selectedStatus);
      }
      if (query) {
        filtered = filtered.filter(c => 
          c.caseNumber.toLowerCase().includes(query) ||
          c.firNumber.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.complainant.toLowerCase().includes(query) ||
          c.assignedIO.toLowerCase().includes(query)
        );
      }

      tableBody.innerHTML = this.renderCaseRows(filtered);
      countLabel.textContent = filtered.length;

      // Re-bind modal buttons in updated rows
      tableBody.querySelectorAll(".btn-assign-case").forEach(btn => {
        btn.addEventListener("click", () => {
          window.openCaseAssignmentModal(btn.getAttribute("data-id"));
        });
      });
    };

    filterSelect.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);

    // Refresh button
    container.querySelector("#adminRefreshBtn")?.addEventListener("click", () => {
      window.appRouter.render();
      window.showToast("Administrative ledger synchronized successfully.", "normal");
    });

    // Export Audit Dossier
    container.querySelector("#adminAuditExportBtn")?.addEventListener("click", () => {
      window.showToast("Generating Section 65B Certified Audit Dossier... Log records compiled.", "success");
    });
  }
};
