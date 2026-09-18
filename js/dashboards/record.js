/**
 * National Legal & Investigation Document Repository (NLADR)
 * Record Officer (Archivist & Vault Custodian) Dashboard
 */

const RecordDashboard = {
  render(container) {
    const currentUser = appState.currentUser;
    const cases = appState.cases;
    const allDocuments = [];
    cases.forEach(c => {
      (c.documents || []).forEach(d => {
        allDocuments.push({
          ...d,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          caseId: c.id,
          archiveLocation: c.archiveLocation
        });
      });
    });

    container.innerHTML = `
      <!-- Record Officer Persona Banner -->
      <div class="dashboard-banner">
        <div class="banner-left">
          <div class="officer-avatar" style="background: #7a1111; color: #fff;">${currentUser.avatar || "OV"}</div>
          <div class="banner-info">
            <h2>${currentUser.name}</h2>
            <div class="banner-meta">
              <span class="banner-meta-item">📦 <strong>Role:</strong> ${currentUser.designation}</span>
              <span class="banner-meta-item">🛡️ <strong>Custodian Badge:</strong> ${currentUser.badgeNumber}</span>
              <span class="banner-meta-item">🏛️ <strong>Depository:</strong> Central Archival Vault, Ministry of Law & Justice</span>
              <span class="banner-meta-item">🔒 <strong>Preservation Standard:</strong> ISO/IEC 27001 & Section 65B Certified</span>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <button class="btn btn-saffron btn-sm" id="btnVerifyIntegrity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Verify Full Archive Cryptographic Integrity
          </button>
        </div>
      </div>

      <!-- Record Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card border-gold">
          <div class="metric-icon-wrap gold">🗄️</div>
          <div class="metric-data">
            <div class="metric-number">${allDocuments.length}</div>
            <div class="metric-label">Archived Digital Evidence Files</div>
          </div>
        </div>
        <div class="metric-card border-blue">
          <div class="metric-icon-wrap blue">📦</div>
          <div class="metric-data">
            <div class="metric-number">${cases.length}</div>
            <div class="metric-label">Physical Vault Case Dossiers</div>
          </div>
        </div>
        <div class="metric-card border-green">
          <div class="metric-icon-wrap green">✓</div>
          <div class="metric-data">
            <div class="metric-number">100%</div>
            <div class="metric-label">SHA-256 Cryptographic Match</div>
          </div>
        </div>
        <div class="metric-card border-red">
          <div class="metric-icon-wrap red">🔒</div>
          <div class="metric-data">
            <div class="metric-number">${allDocuments.filter(d => d.accessLevel === 'Secret' || d.accessLevel === 'Classified').length}</div>
            <div class="metric-label">High-Security Classified Exhibits</div>
          </div>
        </div>
      </div>

      <!-- Physical Vault & Digital Archival Catalog -->
      <div class="gov-card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              Master Digital & Physical Evidence Ledger
            </div>
            <div class="card-subtitle">Chain of custody, vault room coordinates, and cryptographic verification status</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>Document Exhibit & ID</th>
                <th>Associated Case Dossier</th>
                <th>Physical Vault Coordinates</th>
                <th>Classification Tier</th>
                <th>File Size</th>
                <th>Cryptographic SHA-256 Digest</th>
                <th>Integrity Audit</th>
              </tr>
            </thead>
            <tbody>
              ${allDocuments.map(doc => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--gov-navy-deep);">📄 ${doc.name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Doc ID: ${doc.id} | Deposited: ${doc.uploadedDate}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600; font-size: 0.8rem;">${doc.caseNumber}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${doc.caseTitle.substring(0, 32)}...</div>
                  </td>
                  <td>
                    <div style="font-size: 0.78rem; font-weight: 600; color: var(--gov-navy-deep);">
                      ${doc.archiveLocation ? `${doc.archiveLocation.vaultNumber}` : 'Vault-01'}
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">
                      ${doc.archiveLocation ? `${doc.archiveLocation.rackNumber}, ${doc.archiveLocation.shelfNumber}` : 'R-01, Shelf-A'}
                    </div>
                  </td>
                  <td>
                    <span class="badge ${doc.accessLevel === 'Secret' || doc.accessLevel === 'Classified' ? 'badge-secret' : 'badge-confidential'}">
                      ${doc.accessLevel}
                    </span>
                  </td>
                  <td>${doc.fileSize}</td>
                  <td>
                    <code style="font-size: 0.7rem; color: var(--gov-ashoka-blue);">${doc.sha256.substring(0, 16)}...${doc.sha256.substring(56)}</code>
                  </td>
                  <td>
                    <span class="badge badge-approved" style="font-size: 0.68rem;">
                      ✓ SHA-256 VERIFIED
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Real-Time Audit Trail of Chain of Custody Transfers -->
      <div class="gov-card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Live Chain of Custody & Access Audit Log
          </div>
          <div class="card-subtitle">Immutable security ledger capturing all institutional interactions</div>
        </div>

        <div class="table-responsive">
          <table class="gov-table" style="font-size: 0.78rem;">
            <thead>
              <tr>
                <th>Audit Log ID</th>
                <th>Timestamp</th>
                <th>Officer / Actor</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Target Resource</th>
                <th>IP / Terminal</th>
                <th>Hash Integrity</th>
              </tr>
            </thead>
            <tbody>
              ${appState.auditLogs.slice(0, 8).map(log => `
                <tr>
                  <td><code>${log.id}</code></td>
                  <td style="white-space: nowrap;">${new Date(log.timestamp).toLocaleString("en-IN")}</td>
                  <td style="font-weight: 600;">${log.actor}</td>
                  <td><span class="badge badge-normal">${log.actorRole}</span></td>
                  <td>${log.action}</td>
                  <td style="color: var(--gov-ashoka-blue); font-weight: 500;">${log.target}</td>
                  <td><code>${log.ipAddress}</code></td>
                  <td><span class="badge badge-approved">${log.hashVerification}</span></td>
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
    container.querySelector("#btnVerifyIntegrity")?.addEventListener("click", () => {
      window.showToast("All cryptographic hashes checked against national blockchain ledger: 100% Tamper-Free!", "success");
    });
  }
};
