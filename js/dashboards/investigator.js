/**
 * National Legal & Investigation Document Repository (NLADR)
 * Investigator Officer (IO) Dashboard Renderer
 */

const InvestigatorDashboard = {
  selectedCaseId: null,

  render(container) {
    const currentUser = appState.currentUser;
    const assignedCases = appState.cases.filter(c => 
      c.assignedIOId === currentUser.id || 
      c.assignedIO === currentUser.name
    );

    // If no case is selected yet, select the first one
    if (!this.selectedCaseId && assignedCases.length > 0) {
      this.selectedCaseId = assignedCases[0].id;
    }

    const activeCase = assignedCases.find(c => c.id === this.selectedCaseId) || assignedCases[0];

    container.innerHTML = `
      <!-- IO Persona Banner -->
      <div class="dashboard-banner">
        <div class="banner-left">
          <div class="officer-avatar" style="background: #117a07; color: #fff;">${currentUser.avatar || "VR"}</div>
          <div class="banner-info">
            <h2>${currentUser.name}</h2>
            <div class="banner-meta">
              <span class="banner-meta-item">👮 <strong>Designation:</strong> ${currentUser.designation}</span>
              <span class="banner-meta-item">📋 <strong>Badge No:</strong> ${currentUser.badgeNumber}</span>
              <span class="banner-meta-item">🏢 <strong>Unit:</strong> ${currentUser.department}</span>
              <span class="banner-meta-item">📁 <strong>Active Cases:</strong> ${assignedCases.length} Assigned</span>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <button class="btn btn-primary btn-sm" id="btnUploadEvidenceModal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Digital Evidence
          </button>
          <button class="btn btn-saffron btn-sm" id="btnAddFindingModal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Record Case Diary Finding
          </button>
        </div>
      </div>

      <!-- Quick Metrics for Investigator -->
      <div class="metrics-grid">
        <div class="metric-card border-blue">
          <div class="metric-icon-wrap blue">📑</div>
          <div class="metric-data">
            <div class="metric-number">${assignedCases.length}</div>
            <div class="metric-label">Cases Assigned Under Charge</div>
          </div>
        </div>
        <div class="metric-card border-orange">
          <div class="metric-icon-wrap orange">🔍</div>
          <div class="metric-data">
            <div class="metric-number">${assignedCases.filter(c => c.status === 'Under Investigation').length}</div>
            <div class="metric-label">Active Field Investigations</div>
          </div>
        </div>
        <div class="metric-card border-gold">
          <div class="metric-icon-wrap gold">👥</div>
          <div class="metric-data">
            <div class="metric-number">${activeCase ? activeCase.teamMembers.length : 0}</div>
            <div class="metric-label">Assigned Investigation Team Size</div>
          </div>
        </div>
        <div class="metric-card border-green">
          <div class="metric-icon-wrap green">🔏</div>
          <div class="metric-data">
            <div class="metric-number">${assignedCases.reduce((sum, c) => sum + (c.documents?.length || 0), 0)}</div>
            <div class="metric-label">Evidence Exhibits Deposited</div>
          </div>
        </div>
      </div>

      <!-- Main Layout: Assigned Cases Selector & Case Details Drilldown -->
      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: start;">
        
        <!-- Left: Assigned Cases Column -->
        <div class="gov-card">
          <div class="card-header">
            <div>
              <div class="card-title" style="font-size: 0.95rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Assigned Case Portfolio
              </div>
              <div class="card-subtitle">Select dossier to inspect team, findings & files</div>
            </div>
            <span class="badge badge-normal">${assignedCases.length} Cases</span>
          </div>

          <div style="max-height: 540px; overflow-y: auto; padding: 0.75rem;">
            ${assignedCases.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.82rem;">
                No cases currently allocated by Administrator.
              </div>
            ` : assignedCases.map(c => `
              <div class="assigned-case-item ${c.id === (activeCase ? activeCase.id : '') ? 'active-case-selected' : ''}" 
                   data-id="${c.id}"
                   style="padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid ${c.id === (activeCase ? activeCase.id : '') ? 'var(--gov-ashoka-blue)' : 'var(--border-subtle)'}; background: ${c.id === (activeCase ? activeCase.id : '') ? '#f0f5fc' : 'var(--bg-secondary)'}; margin-bottom: 0.6rem; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span style="font-family: monospace; font-size: 0.78rem; font-weight: 700; color: var(--gov-navy-deep);">${c.caseNumber}</span>
                  <span class="badge ${c.priority === 'Urgent' ? 'badge-urgent' : 'badge-high'}" style="font-size: 0.68rem;">${c.priority}</span>
                </div>
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-top: 4px; line-height: 1.3;">
                  ${c.title}
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">
                  FIR: ${c.firNumber}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.72rem;">
                  <span class="badge ${c.status === 'Under Investigation' ? 'badge-investigation' : c.status === 'Charge-sheet Filed' ? 'badge-chargesheet' : 'badge-trial'}">${c.status}</span>
                  <span style="font-weight: 700; color: var(--gov-ashoka-blue);">${c.progressPercent}%</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Active Selected Case Inspection -->
        ${!activeCase ? `
          <div class="gov-card" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            Select an assigned case from the list on the left to review team members, case findings, and evidence.
          </div>
        ` : `
          <div>
            <!-- Active Case Details Card -->
            <div class="gov-card" style="margin-bottom: 1.5rem;">
              <div class="card-header" style="background: rgba(0, 34, 102, 0.04);">
                <div>
                  <div class="card-title">
                    <span>${activeCase.title}</span>
                  </div>
                  <div class="card-subtitle">
                    ${activeCase.caseNumber} | ${activeCase.firNumber}
                  </div>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <span class="badge ${activeCase.status === 'Under Investigation' ? 'badge-investigation' : 'badge-trial'}">${activeCase.status}</span>
                  <button class="btn btn-secondary btn-sm" id="btnUpdateCaseStatusPrompt" data-id="${activeCase.id}">
                    Update Status
                  </button>
                </div>
              </div>

              <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; background: #f8fafc; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Statute / Sections:</span>
                    <div style="font-weight: 600; color: var(--gov-ashoka-blue); margin-top: 2px;">${activeCase.statuteSections}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Complainant:</span>
                    <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">${activeCase.complainant} (${activeCase.complainantContact})</div>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Prosecuting Legal Officer:</span>
                    <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">⚖️ ${activeCase.assignedLegalOfficer}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Court & Next Hearing:</span>
                    <div style="font-weight: 600; color: #c92a2a; margin-top: 2px;">📅 ${activeCase.nextHearingDate} (${activeCase.courtName})</div>
                  </div>
                </div>

                <!-- Assigned Investigation Team Members Roster (Crucial Requirement) -->
                <div style="margin-bottom: 1.75rem;">
                  <h4 style="font-size: 0.95rem; color: var(--gov-navy-deep); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Investigation Team Roster & Duty Allocation (${activeCase.teamMembers.length} Members)
                  </h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
                    ${activeCase.teamMembers.map(tm => `
                      <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: #eaf0f8; color: var(--gov-ashoka-blue); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                          ${tm.name.split(" ").map(n=>n[0]).join("").substring(0, 2)}
                        </div>
                        <div>
                          <div style="font-size: 0.84rem; font-weight: 700; color: var(--gov-navy-deep);">${tm.name}</div>
                          <div style="font-size: 0.74rem; color: var(--gov-saffron-dark); font-weight: 600;">${tm.role}</div>
                          <div style="font-size: 0.72rem; color: var(--text-muted);">${tm.phone}</div>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>

                <!-- Case Findings Timeline (Case Diary / दैनिकी) -->
                <div style="margin-bottom: 1.75rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h4 style="font-size: 0.95rem; color: var(--gov-navy-deep); display: flex; align-items: center; gap: 6px;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      Case Diary & Findings Till Now (दैनिकी - CrPC/BNSS Compliance)
                    </h4>
                    <button class="btn btn-saffron btn-sm" id="btnCardAddFinding">
                      + Add New Finding
                    </button>
                  </div>

                  ${activeCase.findings.length === 0 ? `
                    <div style="padding: 1.5rem; background: #f8fafc; text-align: center; color: var(--text-muted); font-size: 0.82rem; border-radius: var(--radius-sm);">
                      No diary findings recorded yet. Click "+ Add New Finding" to log search, seizure, or witness testimony.
                    </div>
                  ` : `
                    <div class="timeline-feed">
                      ${activeCase.findings.map(f => `
                        <div class="timeline-item">
                          <div class="timeline-date">${f.date} • Recorded by <strong>${f.author}</strong></div>
                          <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="timeline-title">${f.title}</div>
                            <span class="badge badge-normal" style="font-size: 0.68rem;">${f.tag}</span>
                          </div>
                          <div class="timeline-desc">${f.description}</div>
                        </div>
                      `).join("")}
                    </div>
                  `}
                </div>

                <!-- Digital Evidence Vault for this Case -->
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h4 style="font-size: 0.95rem; color: var(--gov-navy-deep); display: flex; align-items: center; gap: 6px;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Section 65B Digital Evidence Exhibits (${activeCase.documents.length} Records)
                    </h4>
                    <button class="btn btn-primary btn-sm" id="btnCardUploadEvidence">
                      + Upload Evidence
                    </button>
                  </div>

                  <div class="table-responsive">
                    <table class="gov-table" style="font-size: 0.8rem;">
                      <thead>
                        <tr>
                          <th>Exhibit / Document Name</th>
                          <th>Exhibit Type</th>
                          <th>Uploaded By</th>
                          <th>File Size</th>
                          <th>SHA-256 Hash Digest (Sec 65B)</th>
                          <th>Integrity Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${activeCase.documents.map(doc => `
                          <tr>
                            <td>
                              <div style="font-weight: 700; color: var(--gov-navy-deep);">📄 ${doc.name}</div>
                              <div style="font-size: 0.72rem; color: var(--text-muted);">Doc ID: ${doc.id} | Date: ${doc.uploadedDate}</div>
                            </td>
                            <td><span class="badge badge-confidential">${doc.type}</span></td>
                            <td>${doc.uploadedBy}</td>
                            <td>${doc.fileSize}</td>
                            <td><code style="font-size: 0.7rem; color: var(--gov-ashoka-blue);">${doc.sha256.substring(0, 16)}...${doc.sha256.substring(56)}</code></td>
                            <td>
                              <span class="badge badge-approved" style="font-size: 0.68rem;">
                                ✓ Cryptographically Verified
                              </span>
                            </td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        `}

      </div>
    `;

    this.attachEvents(container, activeCase);
  },

  attachEvents(container, activeCase) {
    // Select case from left list
    container.querySelectorAll(".assigned-case-item").forEach(item => {
      item.addEventListener("click", () => {
        this.selectedCaseId = item.getAttribute("data-id");
        this.render(container);
      });
    });

    // Record Finding button (banner & card)
    const openFindingModal = () => {
      if (activeCase) {
        window.openAddFindingModal(activeCase.id);
      } else {
        window.showToast("Please select a case to record a finding.", "urgent");
      }
    };
    container.querySelector("#btnAddFindingModal")?.addEventListener("click", openFindingModal);
    container.querySelector("#btnCardAddFinding")?.addEventListener("click", openFindingModal);

    // Upload Evidence button (banner & card)
    const openEvidenceModal = () => {
      if (activeCase) {
        window.openUploadEvidenceModal(activeCase.id);
      } else {
        window.showToast("Please select a case to upload evidence.", "urgent");
      }
    };
    container.querySelector("#btnUploadEvidenceModal")?.addEventListener("click", openEvidenceModal);
    container.querySelector("#btnCardUploadEvidence")?.addEventListener("click", openEvidenceModal);

    // Update status prompt
    container.querySelector("#btnUpdateCaseStatusPrompt")?.addEventListener("click", () => {
      if (!activeCase) return;
      const choices = ["Under Investigation", "Charge-sheet Filed", "In Trial", "Solved/Disposed"];
      const newStatus = prompt(`Enter new status for ${activeCase.caseNumber}:\nOptions: ${choices.join(", ")}`, activeCase.status);
      if (newStatus && choices.includes(newStatus)) {
        appState.updateCaseStatus(activeCase.id, newStatus);
        window.showToast(`Case status updated to "${newStatus}"`, "success");
        window.appRouter.render();
      }
    });
  }
};
