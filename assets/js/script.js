(function () {
  "use strict";

  const KEYS = {
    projects: "KGFIPL_Projects",
    enquiries: "KGFIPL_Enquiries",
    careers: "KGFIPL_Careers",
    divisions: "KGFIPL_Divisions"
  };
  const MAX_PROJECT_IMAGE = 300 * 1024;
  const MAX_RESUME = 250 * 1024;
  const fallbackImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80";
  const DIVISION_CONTENT_VERSION = "20261127-1";
  const divisionSeeds = [
    { name: "Construction & Mining", short: "Infrastructure, civil works, mining operations and quality woodwork solutions.", description: "We aim to support the built environment through construction, civil works, infrastructure development, mining support and woodwork. Our approach prioritizes careful planning, safety, dependable delivery and lasting value for clients and communities.", services: ["Civil construction and infrastructure", "Mining support and operations", "Woodwork and interior solutions", "Project planning and coordination"], image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=82" },
    { name: "Renewable Energy", short: "Exploring renewable power and energy solutions for a more sustainable future.", description: "We are interested in renewable energy solutions that can support cleaner power and future-ready infrastructure. Potential areas include solar, wind, hydroelectric, thermoelectric and waste-to-energy, developed with appropriate planning and partners.", services: ["Solar and wind opportunities", "Hydroelectric and thermoelectric concepts", "Waste-to-energy solutions", "Energy project planning and partnerships"], image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=82" },
    { name: "Manufacturing", short: "Food processing, electronics, EV equipment and industrial manufacturing opportunities.", description: "Our manufacturing interests include food processing, electronics, mechanical and industrial production, and components that support electric mobility. We aim to promote quality, efficient operations and the development of domestic production capabilities.", services: ["Food processing", "Electronics and EV equipment", "Mechanical and industrial manufacturing", "Production, assembly and sourcing"], image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=82" },
    { name: "Agriculture & Farming", short: "Modern cultivation, livestock and agribusiness focused on productivity and rural development.", description: "We see agriculture as an important foundation for livelihoods and inclusive growth. Our areas of interest include modern cultivation, dairy, poultry, fisheries and connected agribusiness that can strengthen productivity and rural development.", services: ["Cultivation and modern farming", "Dairy, poultry and fisheries", "Agribusiness development", "Market access and supply partnerships"], image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=82" },
    { name: "EV Vehicle & Equipment Manufacturing", short: "Electric vehicles, components and charging equipment for the growing mobility ecosystem.", description: "We are exploring opportunities across electric vehicles and the equipment that supports them. This includes vehicle components, battery and charging systems, controllers and motors, alongside sales, service and partnership opportunities.", services: ["Electric vehicles and components", "Batteries, motors and controllers", "Charging systems and equipment", "Sales, service and mobility partnerships"], image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=82" },
    { name: "Electrical & Electronic Equipment Manufacturing", short: "Electrical systems, control panels, wiring and electronic equipment for industry and infrastructure.", description: "This division focuses on electrical and electronic equipment and technology-driven systems for industrial, infrastructure and consumer applications. We aim to connect customers with dependable products, components and supply solutions.", services: ["Electrical equipment and control panels", "Electronic systems and components", "Industrial wiring and related systems", "Product sourcing and supply"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=82" },
    { name: "Import & Export", short: "Sourcing, logistics coordination and trade connections between India and global markets.", description: "Our trade interests connect Indian businesses, suppliers and buyers through sourcing, import-export facilitation and logistics coordination. We aim to build responsible trade relationships and support the reach of Indian products in global markets.", services: ["Import and export facilitation", "Product and supplier sourcing", "Trade and logistics coordination", "International business partnerships"], image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=900&q=82" },
    { name: "Finance & Education", short: "Financial service initiatives, education, training and institutional development.", description: "We support initiatives in finance and education that can strengthen knowledge, skills and institutional capability. Our focus is on responsible service development, useful learning opportunities and inclusive access, subject to applicable requirements.", services: ["Financial service initiatives", "Education and training support", "Institutional development", "Skills and capability building"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=82" },
    { name: "Security & Manpower Supply", short: "Skilled and general workforce and security support for public and private organizations.", description: "We aim to provide workforce solutions that help organizations meet operational needs. This includes skilled and general manpower and security staffing, supported by appropriate recruitment, deployment and service practices.", services: ["Skilled and general manpower", "Workforce planning and deployment", "Security staffing solutions", "Recruitment and service coordination"], image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=82" },
    { name: "Adventure & Hospitality", short: "Hotels and resorts combining welcoming stays with engaging adventure experiences.", description: "Our hospitality vision brings adventure activities together with hotels and resorts to create memorable, engaging stays. We aim to serve guests through welcoming spaces, thoughtful experiences and responsible partnerships with local destinations.", services: ["Hotel and resort concepts", "Adventure and guest activities", "Hospitality operations and services", "Tourism and destination partnerships"], image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=82" }
  ];
  const heroSlides = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=2000&q=88"
  ];
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  let projectImageData = "";
  let heroIndex = 0;
  let adminLoggedIn = false;

  function getData(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.warn("LocalStorage data is not a list:", key);
        return [];
      }
      return parsed;
    } catch (error) {
      console.warn("Could not read LocalStorage data:", key, error);
      return [];
    }
  }

  function saveData(key, data) {
    try {
      if (!Array.isArray(data)) throw new TypeError("Saved data must be a list.");
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Could not save LocalStorage data:", key, error);
      return false;
    }
  }

  function updateData(key, id, updates) {
    const records = getData(key);
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) return false;
    records[index] = Object.assign({}, records[index], updates);
    return saveData(key, records);
  }

  function deleteData(key, id) {
    const records = getData(key);
    return saveData(key, records.filter((record) => record.id !== id));
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "kgf-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[character]);
  }

  function safeImage(url, fallback) {
    return typeof url === "string" && (/^https:\/\/images\.unsplash\.com\//.test(url) || /^data:image\/(png|jpeg|webp|gif);base64,/.test(url))
      ? url : (fallback || fallbackImage);
  }

  function showToast(message) {
    const toastElement = $("#siteToast");
    if (!toastElement || !window.bootstrap) {
      window.alert(message);
      return;
    }
    $("#toastMessage").textContent = message;
    window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3600 }).show();
  }

  function setFeedback(element, message, isError) {
    element.textContent = message;
    element.classList.toggle("error", Boolean(isError));
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("The selected file could not be read."));
      reader.readAsDataURL(file);
    });
  }

  function isSupportedImage(file) {
    return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
  }

  function initData() {
    try {
      const seededDivisions = divisionSeeds.map((division, index) => Object.assign({ id: "division-" + (index + 1) }, division));
      if (localStorage.getItem(KEYS.divisions) === null) {
        if (saveData(KEYS.divisions, seededDivisions)) localStorage.setItem("KGFIPL_DivisionsContentVersion", DIVISION_CONTENT_VERSION);
      } else if (localStorage.getItem("KGFIPL_DivisionsContentVersion") !== DIVISION_CONTENT_VERSION) {
        const storedDivisions = getData(KEYS.divisions);
        const refreshedDivisions = storedDivisions.map((stored) => {
          const seed = stored && seededDivisions.find((division) => division.id === stored.id);
          return seed ? Object.assign({}, stored, seed) : stored;
        });
        if (saveData(KEYS.divisions, refreshedDivisions)) localStorage.setItem("KGFIPL_DivisionsContentVersion", DIVISION_CONTENT_VERSION);
      }
      [KEYS.projects, KEYS.enquiries, KEYS.careers].forEach((key) => {
        if (localStorage.getItem(key) === null) saveData(key, []);
      });
    } catch (error) {
      console.warn("Browser storage is unavailable; the site will remain viewable without saved demo data.", error);
    }
  }

  function currentDivisions() {
    return getData(KEYS.divisions);
  }

  function renderDivisionCards() {
    const grid = $("#divisionGrid");
    const divisions = currentDivisions();
    if (!divisions.length) {
      grid.innerHTML = '<div class="empty-state"><i class="bi bi-grid"></i><strong>No divisions to display</strong><p>Divisions added in the demo admin workspace will appear here.</p></div>';
      refreshDivisionOptions();
      return;
    }
    grid.innerHTML = divisions.map((division, index) => `
      <article class="division-card">
        <img src="${escapeHTML(safeImage(division.image))}" alt="${escapeHTML(division.name)}" loading="lazy">
        <div class="division-card-content">
          <span class="division-num">${String(index + 1).padStart(2, "0")} / 10</span>
          <h3>${escapeHTML(division.name)}</h3>
          <p>${escapeHTML(division.short || division.description)}</p>
          <div class="division-actions">
            <button type="button" class="read-more" data-division-details="${escapeHTML(division.id)}">Read more <i class="bi bi-arrow-up-right"></i></button>
            <a class="division-enquire" href="#contact" data-division-enquire="${escapeHTML(division.name)}">Enquire <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
      </article>`).join("");
    refreshDivisionOptions();
  }

  function refreshDivisionOptions() {
    const divisions = currentDivisions();
    const contact = $("#contactDivision");
    const selected = contact.value;
    contact.innerHTML = '<option value="">Choose a division</option>' + divisions.map((division) =>
      `<option value="${escapeHTML(division.name)}">${escapeHTML(division.name)}</option>`).join("");
    if (divisions.some((division) => division.name === selected)) contact.value = selected;

    const categorySelects = [$("#projectCategory"), $("#projectFilter")];
    categorySelects.forEach((select, position) => {
      const oldValue = select.value;
      const firstOption = position === 0 ? '<option value="">Choose a category</option>' : '<option value="">All categories</option>';
      select.innerHTML = firstOption + divisions.map((division) =>
        `<option value="${escapeHTML(division.name)}">${escapeHTML(division.name)}</option>`).join("") +
        '<option value="Other">Other</option>';
      if (Array.from(select.options).some((option) => option.value === oldValue)) select.value = oldValue;
    });
  }

  function openDivision(id) {
    const division = currentDivisions().find((item) => item.id === id);
    if (!division) return;
    $("#divisionModalImage").src = safeImage(division.image);
    $("#divisionModalImage").alt = division.name;
    $("#divisionModalTitle").textContent = division.name;
    $("#divisionModalDescription").textContent = division.description || division.short || "";
    $("#divisionModalServices").innerHTML = (Array.isArray(division.services) ? division.services : []).map((service) =>
      `<li>${escapeHTML(service)}</li>`).join("");
    if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance($("#divisionModal")).show();
  }

  function projectEmptyState(message) {
    return `<div class="empty-state"><i class="bi bi-kanban"></i><strong>${message}</strong><p>Add a project to showcase upcoming work. Project data is saved in this browser.</p></div>`;
  }

  function renderProjects() {
    const grid = $("#projectGrid");
    const search = $("#projectSearch").value.trim().toLowerCase();
    const filter = $("#projectFilter").value;
    const projects = getData(KEYS.projects).filter((project) => {
      const text = `${project.name || ""} ${project.description || ""} ${project.category || ""}`.toLowerCase();
      return (!search || text.includes(search)) && (!filter || project.category === filter);
    });
    if (!projects.length) {
      grid.innerHTML = projectEmptyState(search || filter ? "No matching projects" : "No upcoming projects yet");
      return;
    }
    grid.innerHTML = projects.map((project) => `
      <article class="project-card">
        ${project.image ? `<img class="project-image" src="${escapeHTML(safeImage(project.image))}" alt="${escapeHTML(project.name)}" loading="lazy">` : '<div class="project-image-placeholder"><i class="bi bi-buildings"></i></div>'}
        <div class="project-card-body">
          <div class="project-card-top"><div><span class="project-category">${escapeHTML(project.category || "Other")}</span><h3>${escapeHTML(project.name)}</h3></div><span class="status-pill">${escapeHTML(project.status || "Planning")}</span></div>
          <p>${escapeHTML(project.description)}</p>
          <div class="project-card-actions"><button type="button" data-edit-project="${escapeHTML(project.id)}"><i class="bi bi-pencil"></i> Edit</button><button type="button" data-delete-project="${escapeHTML(project.id)}"><i class="bi bi-trash3"></i> Delete</button></div>
        </div>
      </article>`).join("");
  }

  function resetProjectForm() {
    $("#projectForm").reset();
    $("#projectId").value = "";
    $("#projectFormTitle").textContent = "Add a project";
    $("#saveProjectButton").innerHTML = 'Save project <i class="bi bi-arrow-right"></i>';
    $("#projectImagePreviewWrap").hidden = true;
    $("#projectImagePreview").src = "";
    projectImageData = "";
  }

  function startProjectEdit(id) {
    const project = getData(KEYS.projects).find((item) => item.id === id);
    if (!project) return;
    $("#projectFormCard").hidden = false;
    $("#projectId").value = project.id;
    $("#projectName").value = project.name || "";
    $("#projectCategory").value = project.category || "";
    $("#projectStatus").value = project.status || "Planning";
    $("#projectDescription").value = project.description || "";
    projectImageData = project.image || "";
    if (projectImageData) {
      $("#projectImagePreview").src = safeImage(projectImageData);
      $("#projectImagePreviewWrap").hidden = false;
    } else {
      $("#projectImagePreviewWrap").hidden = true;
    }
    $("#projectFormTitle").textContent = "Edit project";
    $("#saveProjectButton").innerHTML = 'Update project <i class="bi bi-arrow-right"></i>';
    $("#projectFormCard").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submitProject(event) {
    event.preventDefault();
    const file = $("#projectImage").files[0];
    if (file && (!isSupportedImage(file) || file.size > MAX_PROJECT_IMAGE)) {
      showToast(file.size > MAX_PROJECT_IMAGE ? "Choose an image smaller than 300 KB." : "Choose a valid image file.");
      return;
    }
    try {
      if (file) projectImageData = await readFileAsDataURL(file);
      const id = $("#projectId").value;
      const existing = id ? getData(KEYS.projects).find((project) => project.id === id) : null;
      const project = {
        id: id || createId(),
        name: $("#projectName").value.trim(),
        category: $("#projectCategory").value,
        status: $("#projectStatus").value,
        description: $("#projectDescription").value.trim(),
        image: projectImageData || "",
        updatedAt: new Date().toISOString(),
        createdAt: existing ? existing.createdAt : new Date().toISOString()
      };
      const records = getData(KEYS.projects);
      const saved = existing
        ? saveData(KEYS.projects, records.map((item) => item.id === id ? project : item))
        : saveData(KEYS.projects, [project].concat(records));
      if (!saved) {
        showToast("Could not save the project. Browser storage may be full; try a smaller image.");
        return;
      }
      resetProjectForm();
      $("#projectFormCard").hidden = true;
      renderProjects();
      renderAdminIfOpen();
      showToast(existing ? "Project updated." : "Project added.");
    } catch (error) {
      console.error("Project image processing failed:", error);
      showToast(error.message || "The selected image could not be processed.");
    }
  }

  function setupProjectManager() {
    $("#toggleProjectForm").addEventListener("click", () => {
      const card = $("#projectFormCard");
      card.hidden = !card.hidden;
      if (!card.hidden) $("#projectName").focus();
    });
    $("#closeProjectForm").addEventListener("click", () => {
      resetProjectForm();
      $("#projectFormCard").hidden = true;
    });
    $("#projectForm").addEventListener("submit", submitProject);
    $("#projectSearch").addEventListener("input", renderProjects);
    $("#projectFilter").addEventListener("change", renderProjects);
    $("#projectGrid").addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit-project]");
      const remove = event.target.closest("[data-delete-project]");
      if (edit) startProjectEdit(edit.dataset.editProject);
      if (remove && window.confirm("Delete this project from this browser?")) {
        if (deleteData(KEYS.projects, remove.dataset.deleteProject)) {
          renderProjects();
          renderAdminIfOpen();
          showToast("Project deleted.");
        } else showToast("Could not delete the project.");
      }
    });
    $("#projectImage").addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (!isSupportedImage(file) || file.size > MAX_PROJECT_IMAGE) {
        event.target.value = "";
        showToast(file.size > MAX_PROJECT_IMAGE ? "Choose an image smaller than 300 KB." : "Choose a valid image file.");
        return;
      }
      try {
        projectImageData = await readFileAsDataURL(file);
        $("#projectImagePreview").src = projectImageData;
        $("#projectImagePreviewWrap").hidden = false;
      } catch (error) {
        showToast(error.message);
      }
    });
    $("#removeProjectImage").addEventListener("click", () => {
      projectImageData = "";
      $("#projectImage").value = "";
      $("#projectImagePreviewWrap").hidden = true;
    });
  }

  function submitCareer(event) {
    event.preventDefault();
    const feedback = $("#careerFeedback");
    const file = $("#careerResume").files[0];
    if (file && file.size > MAX_RESUME) {
      setFeedback(feedback, "Please choose a resume smaller than 250 KB.", true);
      return;
    }
    if (file && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      setFeedback(feedback, "Please upload a PDF, DOC or DOCX resume.", true);
      return;
    }
    const record = {
      id: createId(),
      name: $("#careerName").value.trim(),
      email: $("#careerEmail").value.trim(),
      phone: $("#careerPhone").value.trim(),
      qualification: $("#careerQualification").value.trim(),
      experience: $("#careerExperience").value,
      position: $("#careerPosition").value.trim(),
      message: $("#careerMessage").value.trim(),
      resumeName: file ? file.name : "",
      createdAt: new Date().toISOString()
    };
    const save = (resumeDataUrl) => {
      if (resumeDataUrl) record.resumeDataUrl = resumeDataUrl;
      const success = saveData(KEYS.careers, [record].concat(getData(KEYS.careers)));
      if (!success) {
        setFeedback(feedback, "Could not save this application. Browser storage may be full.", true);
        return;
      }
      event.target.reset();
      setFeedback(feedback, "Thank you — your demo application is saved in this browser.");
      renderAdminIfOpen();
    };
    if (file) {
      readFileAsDataURL(file).then(save).catch((error) => {
        console.error("Resume processing failed:", error);
        setFeedback(feedback, "The selected resume could not be read. Please try again.", true);
      });
    } else save("");
  }

  function submitContact(event) {
    event.preventDefault();
    const record = {
      id: createId(),
      name: $("#contactName").value.trim(),
      email: $("#contactEmail").value.trim(),
      phone: $("#contactPhone").value.trim(),
      division: $("#contactDivision").value,
      message: $("#contactMessage").value.trim(),
      createdAt: new Date().toISOString()
    };
    if (saveData(KEYS.enquiries, [record].concat(getData(KEYS.enquiries)))) {
      event.target.reset();
      setFeedback($("#contactFeedback"), "Thank you — your demo enquiry has been saved in this browser.");
      renderAdminIfOpen();
    } else {
      setFeedback($("#contactFeedback"), "Could not save your enquiry. Browser storage may be unavailable.", true);
    }
  }

  function renderAdminStats() {
    const stats = [
      ["Enquiries", getData(KEYS.enquiries).length, "bi-chat-left-text"],
      ["Applications", getData(KEYS.careers).length, "bi-person-workspace"],
      ["Projects", getData(KEYS.projects).length, "bi-kanban"],
      ["Divisions", currentDivisions().length, "bi-grid"]
    ];
    $("#adminStats").innerHTML = stats.map((item) =>
      `<div class="admin-stat"><span><i class="bi ${item[2]}"></i> ${item[0]}</span><strong>${item[1]}</strong></div>`).join("");
  }

  function dateLabel(date) {
    if (!date) return "—";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString();
  }

  function renderAdminRecords() {
    const type = $("#adminRecordType").value;
    const query = $("#adminSearch").value.trim().toLowerCase();
    const records = getData(KEYS[type]).filter((record) =>
      JSON.stringify(record).toLowerCase().includes(query));
    if (!records.length) {
      $("#adminRecordList").innerHTML = `<div class="empty-state"><i class="bi bi-inbox"></i><strong>${query ? "No matching records" : "No records yet"}</strong><p>Records saved in this browser will appear here.</p></div>`;
      return;
    }
    let headings = [];
    let rows = [];
    if (type === "enquiries") {
      headings = ["Name / date", "Email", "Phone", "Division", "Message", "Action"];
      rows = records.map((record) => [escapeHTML(record.name), `<span class="table-sub">${dateLabel(record.createdAt)}</span>`, escapeHTML(record.email), escapeHTML(record.phone), escapeHTML(record.division), escapeHTML(record.message), record.id]);
    } else if (type === "careers") {
      headings = ["Applicant / date", "Email", "Position", "Qualification", "Experience", "Resume", "Action"];
      rows = records.map((record) => [
        escapeHTML(record.name), `<span class="table-sub">${dateLabel(record.createdAt)}</span>`, escapeHTML(record.email), escapeHTML(record.position),
        escapeHTML(record.qualification), escapeHTML(record.experience),
        record.resumeDataUrl ? `<a href="${escapeHTML(record.resumeDataUrl)}" download="${escapeHTML(record.resumeName || "resume")}">Download</a>` : escapeHTML(record.resumeName || "—"), record.id
      ]);
    } else if (type === "projects") {
      headings = ["Project", "Category", "Status", "Description", "Action"];
      rows = records.map((record) => [escapeHTML(record.name), escapeHTML(record.category), escapeHTML(record.status), escapeHTML(record.description), record.id]);
    } else {
      headings = ["Division", "Description", "Action"];
      rows = records.map((record) => [escapeHTML(record.name), escapeHTML(record.short || record.description), record.id]);
    }
    const actionColumn = type === "projects"
      ? (id) => `<button type="button" class="record-edit" data-admin-edit-project="${escapeHTML(id)}">Edit</button> <button type="button" class="record-delete" data-admin-delete="${escapeHTML(id)}">Delete</button>`
      : (id) => `<button type="button" class="record-delete" data-admin-delete="${escapeHTML(id)}">Delete</button>`;
    const tableRows = rows.map((row) => {
      const id = row[row.length - 1];
      const cells = row.slice(0, -1);
      if (type === "enquiries") {
        return `<tr><td>${cells[0]}${cells[1]}</td><td>${cells[2]}</td><td>${cells[3]}</td><td>${cells[4]}</td><td>${cells[5]}</td><td>${actionColumn(id)}</td></tr>`;
      }
      if (type === "careers") {
        return `<tr><td>${cells[0]}${cells[1]}</td><td>${cells[2]}</td><td>${cells[3]}</td><td>${cells[4]}</td><td>${cells[5]}</td><td>${cells[6]}</td><td>${actionColumn(id)}</td></tr>`;
      }
      if (type === "projects") {
        return `<tr><td>${cells[0]}</td><td>${cells[1]}</td><td>${cells[2]}</td><td>${cells[3]}</td><td>${actionColumn(id)}</td></tr>`;
      }
      return `<tr><td>${cells[0]}</td><td>${cells[1]}</td><td>${actionColumn(id)}</td></tr>`;
    }).join("");
    $("#adminRecordList").innerHTML = `<table class="admin-table"><thead><tr>${headings.map((heading) => `<th>${heading}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table>`;
  }

  function renderAdminIfOpen() {
    if (!adminLoggedIn || $("#adminDashboard").hidden) return;
    renderAdminStats();
    renderAdminRecords();
  }

  function showAdminView() {
    $("main").hidden = true;
    $(".site-footer").hidden = true;
    $("#admin").hidden = false;
    if (adminLoggedIn) {
      $("#adminLoginCard").hidden = true;
      $("#adminDashboard").hidden = false;
      renderAdminStats();
      renderAdminRecords();
    } else {
      $("#adminLoginCard").hidden = false;
      $("#adminDashboard").hidden = true;
    }
    window.scrollTo(0, 0);
  }

  function showPublicView() {
    $("#admin").hidden = true;
    $("main").hidden = false;
    $(".site-footer").hidden = false;
  }

  function setupAdmin() {
    $("#adminLink").addEventListener("click", () => { adminLoggedIn = false; });
    $("#adminLoginForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if ($("#adminUsername").value === "admin" && $("#adminPassword").value === "kgfipl2026") {
        adminLoggedIn = true;
        setFeedback($("#adminLoginFeedback"), "");
        showAdminView();
      } else {
        setFeedback($("#adminLoginFeedback"), "Credentials did not match the published demo login.", true);
      }
    });
    $("#adminLogout").addEventListener("click", () => {
      adminLoggedIn = false;
      $("#adminLoginForm").reset();
      setFeedback($("#adminLoginFeedback"), "");
      showAdminView();
    });
    $("#adminRecordType").addEventListener("change", renderAdminRecords);
    $("#adminSearch").addEventListener("input", renderAdminRecords);
    $("#adminRecordList").addEventListener("click", (event) => {
      const remove = event.target.closest("[data-admin-delete]");
      const edit = event.target.closest("[data-admin-edit-project]");
      if (edit) {
        window.location.hash = "projects";
        $("#projectFormCard").hidden = false;
        startProjectEdit(edit.dataset.adminEditProject);
        return;
      }
      if (!remove) return;
      const type = $("#adminRecordType").value;
      const label = type === "enquiries" ? "enquiry" : type === "careers" ? "application" : type === "divisions" ? "division" : "project";
      if (!window.confirm(`Delete this ${label} from this browser?`)) return;
      if (deleteData(KEYS[type], remove.dataset.adminDelete)) {
        renderAdminStats();
        renderAdminRecords();
        renderDivisionCards();
        renderProjects();
        showToast("Record deleted.");
      } else showToast("Could not delete this record.");
    });
    $("#divisionForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#newDivisionName").value.trim();
      const description = $("#newDivisionDescription").value.trim();
      const divisions = currentDivisions();
      if (divisions.some((division) => division.name.toLowerCase() === name.toLowerCase())) {
        showToast("A division with that name already exists.");
        return;
      }
      const added = { id: createId(), name, short: description, description, services: ["Business enquiries", "Partnership opportunities"], image: fallbackImage };
      if (saveData(KEYS.divisions, divisions.concat(added))) {
        event.target.reset();
        renderDivisionCards();
        renderAdminStats();
        renderAdminRecords();
        showToast("Division added.");
      } else showToast("Could not save the division.");
    });
  }

  function setupNavigation() {
    function updateView() {
      if (window.location.hash === "#admin") {
        showAdminView();
        return;
      }
      showPublicView();
      if (window.location.hash && window.location.hash !== "#home") {
        const target = document.querySelector(window.location.hash);
        if (target) window.setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 20);
      } else if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }
    window.addEventListener("hashchange", updateView);
    $$(".navbar-nav .nav-link, .footer-bottom a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        const collapse = $("#mainNav");
        if (collapse.classList.contains("show") && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      });
    });
    updateView();
  }

  function setupHero() {
    const image = $("#heroImage");
    image.style.backgroundImage = `url("${heroSlides[0]}")`;
    window.setInterval(() => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      image.style.backgroundImage = `url("${heroSlides[heroIndex]}")`;
      $("#slideNumber").textContent = String(heroIndex + 1).padStart(2, "0");
    }, 6500);
  }

  function setupImageFallbacks() {
    $$(".office-gallery img, .career-people-image img").forEach((image) => {
      image.addEventListener("error", () => {
        if (!image.dataset.fallbackApplied) {
          image.dataset.fallbackApplied = "true";
          image.src = fallbackImage;
        }
      });
    });
  }

  function setupContactAndCareers() {
    $("#careerForm").addEventListener("submit", submitCareer);
    $("#contactForm").addEventListener("submit", submitContact);
    ["#careerPhone", "#contactPhone"].forEach((selector) => {
      const input = $(selector);
      input.addEventListener("input", () => {
        const value = input.value.trim();
        const digits = (value.match(/\d/g) || []).length;
        input.setCustomValidity(!value || (/^[+0-9() .-]{7,20}$/.test(value) && digits >= 7) ? "" : "Enter a valid phone number.");
      });
    });
    $("#divisionGrid").addEventListener("click", (event) => {
      const detailButton = event.target.closest("[data-division-details]");
      const enquiryLink = event.target.closest("[data-division-enquire]");
      if (detailButton) openDivision(detailButton.dataset.divisionDetails);
      if (enquiryLink) {
        $("#contactDivision").value = enquiryLink.dataset.divisionEnquire;
      }
    });
  }

  function start() {
    initData();
    $("#currentYear").textContent = new Date().getFullYear();
    renderDivisionCards();
    setupHero();
    setupImageFallbacks();
    setupProjectManager();
    setupContactAndCareers();
    setupAdmin();
    setupNavigation();
    renderProjects();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
}());
