/**
 * National Legal & Investigation Document Repository (NLADR)
 * Citizen Dashboard Renderer (Strictly Restricted to Own Cases & Status Tracking)
 */

const CitizenDashboard = {
  render(container) {
    const currentUser = appState.currentUser;
    // Strict Privacy Isolation: Citizen only sees their own filed complaints
    const citizenCases = appState.cases.filter(c => 
      c.complainantId === currentUser.id || 
      c.complainant.toLowerCase() === currentUser.name.toLowerCase()
    );

    container.innerHTML = `
      <!-- Citizen Persona Banner -->
      <div class="dashboard-banner">
        <div class="banner-left">
          <div class="officer-avatar" style="background: #e67700; color: #fff;">${currentUser.avatar || "RS"}</div>
          <div class="banner-info">
            <h2>${currentUser.name}</h2>
            <div class="banner-meta">
              <span class="banner-meta-item">👤 <strong>Citizen Portal Access:</strong> Complainant / Petitioner</span>
              <span class="banner-meta-item">🛡️ <strong>Aadhaar / ID Verification:</strong> Masked (XXXX-XXXX-8921)</span>
              <span class="banner-meta-item">📱 <strong>Registered Contact:</strong> ${currentUser.phone || "+91 98111 54321"}</span>
              <span class="banner-meta-item">📂 <strong>Active Representations:</strong> ${citizenCases.length} Registered Matters</span>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <button class="btn btn-saffron btn-sm" id="btnCitizenSubmitSupportDoc">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Submit Additional Proof / Evidence
          </button>
          <button class="btn btn-secondary btn-sm" id="btnCitizenLodgeGrievance">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Submit Status Inquiry / Grievance
          </button>
        </div>
      </div>

      <!-- Citizen Security Notice Callout -->
      <div style="background: #e8f4fd; border: 1px solid #b8daff; border-left: 4px solid var(--gov-ashoka-blue); padding: 0.85rem 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.75rem; font-size: 0.82rem; color: #002266; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <strong>🔒 Citizen Confidentiality Notice:</strong> In compliance with the Digital Personal Data Protection (DPDP) Act 2023 & Section 65B of Evidence Act, your dashboard strictly reveals only cases registered under your citizen identity.
        </div>
        <span class="badge badge-normal" style="background: #ffffff;">Authorized Citizen Session</span>
      </div>

      <!-- Citizen Cases Roster -->
      ${citizenCases.length === 0 ? `
        <div class="gov-card" style="padding: 3.5rem 1.5rem; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📁</div>
          <h3 style="color: var(--gov-navy-deep); margin-bottom: 0.5rem;">No Active Cases Found for Your Account</h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem;">
            You currently do not have any registered FIRs or legal petitions linked to this Aadhaar / Mobile number.
          </p>
          <button class="btn btn-primary" id="btnDemoLinkCase">
            Link Demo Case (FIR No. 412/2026) to My Account
          </button>
        </div>
      ` : citizenCases.map(c => `
        <div class="gov-card" style="margin-bottom: 2rem; border-top: 4px solid var(--gov-gold);">
          
          <div class="card-header" style="background: #f8fafc;">
            <div>
              <div class="card-title" style="font-size: 1.15rem;">
                ${c.title}
              </div>
              <div class="card-subtitle">
                Dossier Number: <strong style="font-family: monospace; color: var(--gov-navy-deep);">${c.caseNumber}</strong> • ${c.firNumber}
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="badge ${c.status === 'Under Investigation' ? 'badge-investigation' : c.status === 'In Trial' ? 'badge-trial' : 'badge-disposed'}" style="font-size: 0.8rem; padding: 4px 10px;">
                ${c.status}
              </span>
              <button class="btn btn-primary btn-sm btn-print-receipt" data-id="${c.id}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Download Certified e-Receipt
              </button>
            </div>
          </div>

          <div class="card-body">
            
            <!-- Visual Step-by-Step Case Progress Stepper (Crucial Citizen Requirement) -->
            <div style="margin-bottom: 2rem;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--gov-navy-deep); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                Official Case Lifecycle Progress (${c.progressPercent}% Completed)
              </div>
              
              <div class="journey-stepper">
                <div class="journey-step completed">
                  <div class="step-circle">1</div>
                  <div class="step-label">FIR Registered</div>
                </div>
                <div class="journey-step ${c.assignedIOId ? 'completed' : 'active'}">
                  <div class="step-circle">2</div>
                  <div class="step-label">Assigned to IO</div>
                </div>
                <div class="journey-step ${c.status === 'Under Investigation' ? 'active' : c.progressPercent >= 65 ? 'completed' : ''}">
                  <div class="step-circle">3</div>
                  <div class="step-label">Active Investigation</div>
                </div>
                <div class="journey-step ${c.status === 'Charge-sheet Filed' ? 'active' : c.progressPercent >= 75 ? 'completed' : ''}">
                  <div class="step-circle">4</div>
                  <div class="step-label">Charge-sheet Filed</div>
                </div>
                <div class="journey-step ${c.status === 'In Trial' ? 'active' : c.progressPercent >= 90 ? 'completed' : ''}">
                  <div class="step-circle">5</div>
                  <div class="step-label">Court Trial</div>
                </div>
                <div class="journey-step ${c.status === 'Solved/Disposed' ? 'completed' : ''}">
                  <div class="step-circle">6</div>
                  <div class="step-label">Judgement / Disposed</div>
                </div>
              </div>
            </div>

            <!-- Case Key Parameters Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; background: #fbfcfe; border: 1px solid var(--border-subtle); padding: 1.15rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
              <div>
                <span class="receipt-row"><span class="label">Date of Registration:</span> <span class="value">${c.filingDate}</span></span>
              </div>
              <div>
                <span class="receipt-row"><span class="label">Assigned Investigating Officer:</span> <span class="value">👮 ${c.assignedIO}</span></span>
              </div>
              <div>
                <span class="receipt-row"><span class="label">Designated Public Prosecutor:</span> <span class="value">⚖️ ${c.assignedLegalOfficer}</span></span>
              </div>
              <div>
                <span class="receipt-row"><span class="label">Listed Court Bench:</span> <span class="value">🏛️ ${c.courtName}</span></span>
              </div>
              <div>
                <span class="receipt-row"><span class="label">Next Hearing Date:</span> <span class="value" style="color: #c92a2a;">📅 ${c.nextHearingDate}</span></span>
              </div>
              <div>
                <span class="receipt-row"><span class="label">Hearing Proceeding Stage:</span> <span class="value">${c.hearingStage}</span></span>
              </div>
            </div>

            <!-- Submitted Additional Documents / Citizen Exhibits -->
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.92rem; color: var(--gov-navy-deep); display: flex; align-items: center; gap: 6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  My Submitted Evidence & Documents (${c.documents.length} Files)
                </h4>
                <button class="btn btn-saffron btn-sm btn-action-add-doc" data-id="${c.id}">
                  + Upload Additional Evidence
                </button>
              </div>

              <div class="table-responsive">
                <table class="gov-table" style="font-size: 0.8rem;">
                  <thead>
                    <tr>
                      <th>Document Title</th>
                      <th>Category</th>
                      <th>Submission Date</th>
                      <th>Digital Fingerprint (SHA-256)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${c.documents.map(doc => `
                      <tr>
                        <td><strong>📄 ${doc.name}</strong></td>
                        <td><span class="badge badge-normal">${doc.type}</span></td>
                        <td>${doc.uploadedDate}</td>
                        <td><code style="font-size: 0.7rem;">${doc.sha256.substring(0, 16)}...</code></td>
                        <td><span class="badge badge-approved">✓ Admitted in Record</span></td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Citizen Inquiries & Grievances Track -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.92rem; color: var(--gov-navy-deep); display: flex; align-items: center; gap: 6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  My Representations & Grievances (${(c.citizenGrievances || []).length} Logged)
                </h4>
                <button class="btn btn-secondary btn-sm btn-action-add-grievance" data-id="${c.id}">
                  + Submit New Inquiry
                </button>
              </div>

              ${(!c.citizenGrievances || c.citizenGrievances.length === 0) ? `
                <div style="padding: 1rem; background: #f8fafc; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-muted); text-align: center;">
                  No pending inquiries lodged on this case.
                </div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${c.citizenGrievances.map(grv => `
                    <div style="background: #fdfdfd; border: 1px solid var(--border-subtle); border-left: 3px solid var(--gov-ashoka-blue); padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-size: 0.82rem;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <strong style="color: var(--gov-navy-deep);">${grv.subject}</strong>
                        <span class="badge badge-approved">${grv.status}</span>
                      </div>
                      <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 6px;">Submitted on: ${grv.date}</div>
                      ${grv.reply ? `
                        <div style="background: #f0f7ff; padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid #d0e4ff; color: #002266; font-size: 0.78rem;">
                          <strong>IO Response:</strong> ${grv.reply}
                        </div>
                      ` : ''}
                    </div>
                  `).join("")}
                </div>
              `}
            </div>

          </div>
        </div>
      `).join("")}
    `;

    this.attachEvents(container, citizenCases);
  },

  attachEvents(container, citizenCases) {
    // Print certified e-Receipt
    container.querySelectorAll(".btn-print-receipt").forEach(btn => {
      btn.addEventListener("click", () => {
        const caseId = btn.getAttribute("data-id");
        window.openReceiptModal(caseId);
      });
    });

    // Upload additional document button
    const openDocModal = (caseId) => {
      const targetId = caseId || (citizenCases.length > 0 ? citizenCases[0].id : null);
      if (targetId) {
        window.openUploadEvidenceModal(targetId, true); // Citizen mode
      } else {
        window.showToast("No active case to attach document to.", "urgent");
      }
    };

    container.querySelectorAll(".btn-action-add-doc").forEach(btn => {
      btn.addEventListener("click", () => openDocModal(btn.getAttribute("data-id")));
    });
    container.querySelector("#btnCitizenSubmitSupportDoc")?.addEventListener("click", () => openDocModal());

    // Submit Grievance / Inquiry
    const openGrievanceModal = (caseId) => {
      const targetId = caseId || (citizenCases.length > 0 ? citizenCases[0].id : null);
      if (targetId) {
        window.openCitizenGrievanceModal(targetId);
      } else {
        window.showToast("No active case to submit inquiry for.", "urgent");
      }
    };

    container.querySelectorAll(".btn-action-add-grievance").forEach(btn => {
      btn.addEventListener("click", () => openGrievanceModal(btn.getAttribute("data-id")));
    });
    container.querySelector("#btnCitizenLodgeGrievance")?.addEventListener("click", () => openGrievanceModal());

    // Demo link case
    container.querySelector("#btnDemoLinkCase")?.addEventListener("click", () => {
      const demoCase = appState.cases[0];
      if (demoCase) {
        demoCase.complainantId = appState.currentUser.id;
        demoCase.complainant = appState.currentUser.name;
        appState.save();
        window.showToast("Linked FIR No. 412/2026 to your Citizen identity.", "success");
        window.appRouter.render();
      }
    });
  }
};
