/**
 * National Legal & Investigation Document Repository (NLADR)
 * Legal Officer (Prosecuting Counsel & Standing Advocate) Dashboard
 */

const LegalDashboard = {
  render(container) {
    const currentUser = appState.currentUser;
    const cases = appState.cases.filter(c => 
      c.assignedLegalOfficerId === currentUser.id || 
      c.assignedLegalOfficer === currentUser.name ||
      currentUser.role === "Legal Officer" // If general counsel, show all prosecuted matters
    );

    // Sort cases by upcoming hearing date
    const activeHearings = [...cases].filter(c => c.status !== "Solved/Disposed" && c.nextHearingDate !== "Disposed").sort((a, b) => {
      return new Date(a.nextHearingDate) - new Date(b.nextHearingDate);
    });

    container.innerHTML = `
      <!-- Legal Officer Persona Banner -->
      <div class="dashboard-banner">
        <div class="banner-left">
          <div class="officer-avatar" style="background: #002266; color: #ffd875;">${currentUser.avatar || "AM"}</div>
          <div class="banner-info">
            <h2>${currentUser.name}</h2>
            <div class="banner-meta">
              <span class="banner-meta-item">⚖️ <strong>Designation:</strong> ${currentUser.designation}</span>
              <span class="banner-meta-item">📜 <strong>Bar Council Enrolment:</strong> ${currentUser.badgeNumber}</span>
              <span class="banner-meta-item">🏛️ <strong>Directorate:</strong> Directorate of Prosecution, Delhi Judiciary</span>
              <span class="banner-meta-item">📅 <strong>Upcoming Hearings:</strong> ${activeHearings.length} Scheduled</span>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <button class="btn btn-saffron btn-sm" id="btnDraftPetition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Draft Legal Motion / Reply
          </button>
        </div>
      </div>

      <!-- Legal Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card border-blue">
          <div class="metric-icon-wrap blue">📅</div>
          <div class="metric-data">
            <div class="metric-number">${activeHearings.length}</div>
            <div class="metric-label">Active Court Appearances</div>
          </div>
        </div>
        <div class="metric-card border-red">
          <div class="metric-icon-wrap red">⚡</div>
          <div class="metric-data">
            <div class="metric-number">${activeHearings.filter(c => c.priority === 'Urgent').length}</div>
            <div class="metric-label">Urgent Priority Hearings</div>
          </div>
        </div>
        <div class="metric-card border-gold">
          <div class="metric-icon-wrap gold">📑</div>
          <div class="metric-data">
            <div class="metric-number">${cases.filter(c => c.status === 'In Trial').length}</div>
            <div class="metric-label">Matters In Active Trial</div>
          </div>
        </div>
        <div class="metric-card border-green">
          <div class="metric-icon-wrap green">🏆</div>
          <div class="metric-data">
            <div class="metric-number">${cases.filter(c => c.status === 'Solved/Disposed').length}</div>
            <div class="metric-label">Disposed / Convictions Secured</div>
          </div>
        </div>
      </div>

      <!-- High Priority Upcoming Hearings Roster (Crucial Requirement) -->
      <div class="gov-card" style="margin-bottom: 2rem;">
        <div class="card-header" style="background: rgba(0, 34, 102, 0.04);">
          <div>
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Upcoming Court Calendar & Hearing Schedule
            </div>
            <div class="card-subtitle">Scheduled judicial proceedings, listed court benches, presiding judges & trial stages</div>
          </div>
          <span class="badge badge-normal">Sorted by Next Hearing Date</span>
        </div>

        <div style="padding: 1.25rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
          ${activeHearings.map(c => `
            <div class="gov-card" style="border-top: 4px solid var(--gov-ashoka-blue); box-shadow: var(--shadow-sm); padding: 1.15rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <span class="badge ${c.priority === 'Urgent' ? 'badge-urgent' : 'badge-high'}">${c.priority} Priority</span>
                <span style="font-size: 0.76rem; font-weight: 700; color: #c92a2a; background: #ffe3e3; padding: 2px 8px; border-radius: var(--radius-sm);">
                  🗓️ ${c.nextHearingDate}
                </span>
              </div>

              <div style="font-weight: 700; font-size: 0.95rem; color: var(--gov-navy-deep); margin-bottom: 4px;">
                ${c.title}
              </div>
              <div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                ${c.caseNumber} • ${c.firNumber}
              </div>

              <div style="font-size: 0.8rem; background: #f8fafc; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
                <div style="margin-bottom: 4px;"><strong>Court:</strong> ${c.courtName}</div>
                <div style="margin-bottom: 4px;"><strong>Judge:</strong> ${c.presidingJudge}</div>
                <div style="color: var(--gov-ashoka-blue);"><strong>Hearing Stage:</strong> ${c.hearingStage}</div>
                <div style="margin-top: 4px; font-size: 0.74rem; color: var(--text-muted);"><strong>Lead IO:</strong> 👮 ${c.assignedIO}</div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge ${c.status === 'In Trial' ? 'badge-trial' : c.status === 'Charge-sheet Filed' ? 'badge-chargesheet' : 'badge-investigation'}">
                  Status: ${c.status}
                </span>
                <button class="btn btn-primary btn-sm btn-update-hearing" data-id="${c.id}">
                  Update Hearing Outcome
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Legal Proceedings Master Table -->
      <div class="gov-card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Comprehensive Case Legal Status & Court Register
          </div>
          <div class="card-subtitle">Overview of legal statuses, statutory sections, and judicial compliance</div>
        </div>

        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>Case Identifier & FIR</th>
                <th>Presiding Court & Judge</th>
                <th>Statute Sections</th>
                <th>Next Hearing Date</th>
                <th>Current Hearing Stage</th>
                <th>Current Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${cases.map(c => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--gov-navy-deep); font-family: monospace;">${c.caseNumber}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${c.title}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600; font-size: 0.82rem;">${c.courtName}</div>
                    <div style="font-size: 0.74rem; color: var(--text-muted);">${c.presidingJudge}</div>
                  </td>
                  <td>
                    <span style="font-size: 0.76rem; color: var(--gov-ashoka-blue); font-weight: 600;">${c.statuteSections}</span>
                  </td>
                  <td>
                    <div style="font-weight: 700; color: ${c.nextHearingDate === 'Disposed' ? 'var(--gov-green)' : '#c92a2a'};">
                      ${c.nextHearingDate}
                    </div>
                  </td>
                  <td style="max-width: 200px; font-size: 0.8rem;">
                    ${c.hearingStage}
                  </td>
                  <td>
                    <span class="badge ${c.status === 'Solved/Disposed' ? 'badge-disposed' : c.status === 'In Trial' ? 'badge-trial' : 'badge-chargesheet'}">
                      ${c.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm btn-update-hearing" data-id="${c.id}">
                      Manage Hearing
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    container.querySelectorAll(".btn-update-hearing").forEach(btn => {
      btn.addEventListener("click", () => {
        const caseId = btn.getAttribute("data-id");
        window.openHearingOutcomeModal(caseId);
      });
    });

    container.querySelector("#btnDraftPetition")?.addEventListener("click", () => {
      window.showToast("Drafting module initialized with Standard Prosecution Templates (CrPC / BNSS Sec 193).", "normal");
    });
  }
};
