/**
 * National Legal & Investigation Document Repository (NLADR)
 * Authentication & Access Portal Handler
 */

class AuthManager {
  constructor() {
    this.currentCaptcha = "";
    this.init();
  }

  init() {
    this.generateCaptcha();
    this.setupEventListeners();
  }

  generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.currentCaptcha = captcha;

    const captchaDisplay = document.getElementById("captchaDisplay");
    if (captchaDisplay) {
      captchaDisplay.textContent = captcha;
    }

    const regCaptchaDisplay = document.getElementById("regCaptchaDisplay");
    if (regCaptchaDisplay) {
      regCaptchaDisplay.textContent = captcha;
    }
  }

  setupEventListeners() {
    // Refresh Captcha buttons
    document.querySelectorAll(".captcha-refresh-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.generateCaptcha();
      });
    });

    // Login Role selection - dynamic 'Others' handler
    const loginRoleSelect = document.getElementById("loginRoleSelect");
    const loginConditionalBox = document.getElementById("loginConditionalBox");
    const loginCustomRoleInput = document.getElementById("loginCustomRoleInput");

    if (loginRoleSelect && loginConditionalBox) {
      loginRoleSelect.addEventListener("change", (e) => {
        if (e.target.value === "Others") {
          loginConditionalBox.style.display = "block";
          if (loginCustomRoleInput) loginCustomRoleInput.required = true;
        } else {
          loginConditionalBox.style.display = "none";
          if (loginCustomRoleInput) {
            loginCustomRoleInput.required = false;
            loginCustomRoleInput.value = "";
          }
        }
      });
    }

    // Register Role selection - dynamic 'Others' handler
    const regRoleSelect = document.getElementById("regRoleSelect");
    const regConditionalBox = document.getElementById("regConditionalBox");
    const regCustomRoleInput = document.getElementById("regCustomRoleInput");

    if (regRoleSelect && regConditionalBox) {
      regRoleSelect.addEventListener("change", (e) => {
        if (e.target.value === "Others") {
          regConditionalBox.style.display = "block";
          if (regCustomRoleInput) regCustomRoleInput.required = true;
        } else {
          regConditionalBox.style.display = "none";
          if (regCustomRoleInput) {
            regCustomRoleInput.required = false;
            regCustomRoleInput.value = "";
          }
        }
      });
    }

    // Login Tabs (Sign In vs Register)
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const formLogin = document.getElementById("formLogin");
    const formRegister = document.getElementById("formRegister");

    if (tabLogin && tabRegister) {
      tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        if (formLogin) formLogin.style.display = "block";
        if (formRegister) formRegister.style.display = "none";
      });

      tabRegister.addEventListener("click", () => {
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        if (formLogin) formLogin.style.display = "none";
        if (formRegister) formRegister.style.display = "block";
        this.generateCaptcha();
      });
    }

    // Handle Login Form Submit
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLoginSubmit();
      });
    }

    // Handle Register Form Submit
    if (formRegister) {
      formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleRegisterSubmit();
      });
    }

    // Demo Role Switcher quick buttons
    document.querySelectorAll(".role-chip-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetRole = btn.getAttribute("data-role");
        this.quickSwitchRole(targetRole);
      });
    });

    // Global Logout button
    const logoutBtn = document.getElementById("logoutNavBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        appState.logout();
        window.appRouter.render();
        window.showToast("You have been securely logged out from NLADR Portal.", "normal");
      });
    }
  }

  handleLoginSubmit() {
    const roleSelect = document.getElementById("loginRoleSelect");
    const customRoleInput = document.getElementById("loginCustomRoleInput");
    const identifierInput = document.getElementById("loginIdentifier");
    const passwordInput = document.getElementById("loginPassword");
    const captchaInput = document.getElementById("loginCaptchaInput");

    const role = roleSelect ? roleSelect.value : "Administrator";
    const customRole = customRoleInput ? customRoleInput.value.trim() : "";
    const identifier = identifierInput ? identifierInput.value.trim() : "";
    const captcha = captchaInput ? captchaInput.value.trim() : "";

    // Verify Captcha
    if (captcha.toUpperCase() !== this.currentCaptcha.toUpperCase()) {
      window.showToast("Security Captcha is incorrect. Please re-enter the code.", "urgent");
      this.generateCaptcha();
      if (captchaInput) captchaInput.value = "";
      return;
    }

    // Find existing user matching role
    let matchedUser = null;

    if (role === "Others") {
      matchedUser = appState.users.find(u => u.role === "Others");
      if (!matchedUser) {
        // Create an on-the-fly authorized session for this specified designation
        matchedUser = {
          id: "USR-OTH-" + Math.floor(100 + Math.random() * 900),
          username: identifier || "special.officer",
          name: identifier ? `Officer (${identifier})` : "Special Magistrate / Expert",
          role: "Others",
          customRole: customRole || "Special Judicial Investigator",
          designation: customRole || "External Specialist",
          department: "Allied Judicial & Enforcement Wing",
          badgeNumber: "SPE-2026-99",
          email: "officer@gov.in",
          phone: "+91 99000 11223",
          status: "Active",
          avatar: "SO",
          approvedAt: new Date().toISOString()
        };
        appState.users.push(matchedUser);
      }
    } else {
      matchedUser = appState.users.find(u => u.role === role);
    }

    if (!matchedUser) {
      window.showToast(`No active profile found for role: ${role}`, "urgent");
      return;
    }

    appState.setCurrentUser(matchedUser);
    window.showToast(`Welcome, ${matchedUser.name} (${matchedUser.role}${matchedUser.customRole ? ` - ${matchedUser.customRole}` : ""})`, "success");
    window.appRouter.render();
  }

  handleRegisterSubmit() {
    const name = document.getElementById("regFullName")?.value.trim();
    const email = document.getElementById("regEmail")?.value.trim();
    const phone = document.getElementById("regPhone")?.value.trim();
    const role = document.getElementById("regRoleSelect")?.value;
    const customRole = document.getElementById("regCustomRoleInput")?.value.trim() || "";
    const department = document.getElementById("regDepartment")?.value.trim() || "";
    const idProofType = document.getElementById("regIdType")?.value;
    const idProofNumber = document.getElementById("regIdNumber")?.value.trim() || "";
    const reason = document.getElementById("regReason")?.value.trim() || "";
    const captcha = document.getElementById("regCaptchaInput")?.value.trim() || "";

    if (captcha.toUpperCase() !== this.currentCaptcha.toUpperCase()) {
      window.showToast("Security Captcha is incorrect. Please check and retry.", "urgent");
      this.generateCaptcha();
      return;
    }

    if (!name || !email || !role) {
      window.showToast("Please fill all mandatory fields marked with *", "urgent");
      return;
    }

    const newReq = appState.submitRegistrationRequest({
      name,
      email,
      phone,
      role,
      customRole,
      department,
      idProofType,
      idProofNumber,
      reason
    });

    window.showToast(`Registration request #${newReq.id} submitted! It is now pending clearance by the Administrator.`, "success");

    // Reset register form & switch back to login
    document.getElementById("formRegister")?.reset();
    document.getElementById("tabLogin")?.click();
  }

  quickSwitchRole(roleName) {
    if (roleName === "Others") {
      let otherUser = appState.users.find(u => u.role === "Others");
      if (!otherUser) {
        otherUser = {
          id: "USR-OTH-099",
          username: "special.expert",
          name: "Dr. K. S. Ramanujan",
          role: "Others",
          customRole: "Director - Forensic Science Laboratory",
          designation: "Director - Digital Forensics Wing",
          department: "Central Forensic Science Laboratory, CBI Campus",
          badgeNumber: "CFSL-DFW-2018-099",
          email: "ramanujan.fsl@delhi.gov.in",
          phone: "+91 98661 22334",
          status: "Active",
          avatar: "KR",
          approvedAt: "2024-01-05T10:00:00Z"
        };
        appState.users.push(otherUser);
      }
      appState.setCurrentUser(otherUser);
    } else {
      const user = appState.users.find(u => u.role === roleName);
      if (user) {
        appState.setCurrentUser(user);
      }
    }

    window.appRouter.render();
    window.showToast(`Switched active role to: ${roleName}`, "normal");
  }
}
