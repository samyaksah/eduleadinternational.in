(function initializeAdmin() {
  const loginPanel = document.querySelector("[data-login-panel]");
  const loginForm = document.querySelector("[data-login-form]");
  const loginMessage = document.querySelector("[data-login-message]");
  const dashboard = document.querySelector("[data-dashboard]");
  const dashboardMessage = document.querySelector("[data-dashboard-message]");
  const signoutButton = document.querySelector("[data-signout]");
  const tabButtons = document.querySelectorAll("[data-admin-tab]");
  const newRecordButton = document.querySelector("[data-new-record]");
  const importRecordsButton = document.querySelector("[data-import-records]");
  const recordList = document.querySelector("[data-record-list]");
  const recordCount = document.querySelector("[data-record-count]");
  const recordsTitle = document.querySelector("[data-records-title]");
  const recordsDescription = document.querySelector("[data-records-description]");
  const workspace = document.querySelector(".admin-workspace");
  const editor = document.querySelector("[data-editor]");
  const closeEditorButton = document.querySelector("[data-close-editor]");
  const editorKicker = document.querySelector("[data-editor-kicker]");
  const editorTitle = document.querySelector("[data-editor-title]");
  const contentForm = document.querySelector("[data-content-form]");

  const COURSE_OPTIONS = [
    ["teachingLearning", "Teaching and Learning"],
    ["educationalLeadership", "Educational Leadership"],
    ["cpdOnline", "CPD Online"],
    ["certifiedTraining", "Certified Training"],
    ["other", "Other"]
  ];

  const schemas = {
    results: {
      table: "results",
      title: "Results",
      singular: "result",
      description: "Distinction holders shown on the Results page and homepage carousel.",
      mediaField: "photo_url",
      fields: [
        { name: "name", label: "Name", required: true },
        { name: "designation", label: "Designation" },
        { name: "school", label: "School" },
        { name: "city", label: "City" },
        { name: "course", label: "Course name", required: true },
        { name: "course_group", label: "Course section", type: "select", options: COURSE_OPTIONS.slice(0, 2), required: true },
        { name: "score", label: "Score" },
        { name: "photo_url", label: "Portrait URL", type: "url" },
        { name: "photo_upload", label: "Upload portrait", type: "file", accept: "image/jpeg,image/png,image/webp", target: "photo_url", folder: "results" },
        { name: "featured", label: "Show in homepage carousel", type: "checkbox" },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "sort_order", label: "Display order", type: "number", default: 100 }
      ]
    },
    gallery: {
      table: "gallery_items",
      title: "Gallery",
      singular: "gallery item",
      description: "Images and descriptions displayed in the public gallery.",
      mediaField: "image_url",
      fields: [
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "image_url", label: "Image URL", type: "url", required: true },
        { name: "image_upload", label: "Upload image", type: "file", accept: "image/jpeg,image/png,image/webp", target: "image_url", folder: "gallery" },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "sort_order", label: "Display order", type: "number", default: 100 }
      ]
    },
    commencements: {
      table: "commencement_dates",
      title: "Commencement dates",
      singular: "commencement date",
      description: "Upcoming cohort dates used across the website.",
      fields: [
        { name: "course", label: "Course name", required: true },
        { name: "course_group", label: "Course", type: "select", options: COURSE_OPTIONS, required: true },
        { name: "commencement_date", label: "Date", type: "date" },
        { name: "display_date", label: "Displayed date", placeholder: "July 24, 2026" },
        { name: "label", label: "Label", default: "New Cohort Commencement Date" },
        { name: "url", label: "Course page URL", placeholder: "teaching-learning.html" },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "sort_order", label: "Display order", type: "number", default: 100 }
      ]
    },
    testimonials: {
      table: "testimonials",
      title: "Testimonials",
      singular: "testimonial",
      description: "Written and video testimonials for the homepage and course pages.",
      mediaField: "portrait_url",
      fields: [
        { name: "course_slug", label: "Page", type: "select", options: [
          ["general", "Homepage / General"],
          ["teaching-learning", "Teaching and Learning"],
          ["educational-leadership", "Educational Leadership"],
          ["cpd-online", "CPD Online"],
          ["certified-training", "Certified Training"]
        ], required: true },
        { name: "testimonial_type", label: "Type", type: "select", options: [["written", "Written"], ["video", "Video"]], required: true },
        { name: "name", label: "Name", required: true },
        { name: "designation", label: "Designation" },
        { name: "school", label: "School" },
        { name: "city", label: "City" },
        { name: "quote", label: "Testimonial", type: "textarea" },
        { name: "portrait_url", label: "Portrait URL", type: "url" },
        { name: "portrait_upload", label: "Upload portrait", type: "file", accept: "image/jpeg,image/png,image/webp", target: "portrait_url", folder: "testimonials/portraits" },
        { name: "video_url", label: "Video URL", type: "url" },
        { name: "video_upload", label: "Upload video", type: "file", accept: "video/mp4,video/webm", target: "video_url", folder: "testimonials/videos" },
        { name: "video_thumbnail_url", label: "Video thumbnail URL", type: "url" },
        { name: "thumbnail_upload", label: "Upload video thumbnail", type: "file", accept: "image/jpeg,image/png,image/webp", target: "video_thumbnail_url", folder: "testimonials/thumbnails" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "sort_order", label: "Display order", type: "number", default: 100 }
      ]
    }
  };

  let client;
  let storageBucket = "site-media";
  let currentType = "results";
  let records = [];
  let editingRecord = null;
  let currentUser = null;

  function setMessage(target, message, isError = false) {
    if (!target) return;
    target.textContent = message;
    target.classList.toggle("is-error", isError);
  }

  function slugify(value) {
    return String(value || "file")
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
  }

  function getRecordTitle(record) {
    if (currentType === "results" || currentType === "testimonials") return record.name;
    if (currentType === "gallery") return record.description;
    return record.course;
  }

  function getRecordSubtitle(record) {
    if (currentType === "results") return [record.designation, record.school].filter(Boolean).join(" | ");
    if (currentType === "gallery") return `Order ${record.sort_order ?? 100}`;
    if (currentType === "commencements") return record.display_date || formatDate(record.commencement_date);
    return [record.testimonial_type, record.course_slug].filter(Boolean).join(" | ");
  }

  function createRecordMedia(record, schema) {
    const media = document.createElement("span");
    media.className = "admin-record-media";
    const mediaUrl = schema.mediaField ? record[schema.mediaField] : "";

    if (mediaUrl) {
      const image = document.createElement("img");
      image.src = mediaUrl;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        media.textContent = getRecordTitle(record)?.slice(0, 2).toUpperCase() || "EL";
      });
      media.appendChild(image);
    } else {
      media.textContent = getRecordTitle(record)?.slice(0, 2).toUpperCase() || "EL";
    }

    return media;
  }

  function renderRecords() {
    const schema = schemas[currentType];
    recordsTitle.textContent = schema.title;
    recordsDescription.textContent = schema.description;
    recordCount.textContent = `${records.length} ${records.length === 1 ? "entry" : "entries"}`;
    recordList.replaceChildren();

    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = `No ${schema.title.toLowerCase()} have been added yet.`;
      recordList.appendChild(empty);
      return;
    }

    records.forEach((record) => {
      const item = document.createElement("article");
      item.className = "admin-record";
      item.appendChild(createRecordMedia(record, schema));

      const copy = document.createElement("div");
      copy.className = "admin-record-copy";
      const title = document.createElement("strong");
      title.textContent = getRecordTitle(record) || "Untitled";
      const subtitle = document.createElement("span");
      subtitle.textContent = getRecordSubtitle(record);
      copy.append(title, subtitle);

      const status = document.createElement("span");
      status.className = `admin-record-status${record.published ? " is-published" : ""}`;
      status.textContent = record.published ? "Published" : "Draft";

      const actions = document.createElement("div");
      actions.className = "admin-record-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => openEditor(record));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => deleteRecord(record));
      actions.append(edit, remove);

      item.append(copy, status, actions);
      recordList.appendChild(item);
    });
  }

  function createField(field, record) {
    if (field.type === "checkbox") {
      const label = document.createElement("label");
      label.className = "admin-checkbox";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = field.name;
      input.checked = Boolean(record?.[field.name] ?? field.default);
      label.append(input, document.createTextNode(field.label));
      return label;
    }

    const label = document.createElement("label");
    label.textContent = field.label;
    let input;

    if (field.type === "textarea") {
      input = document.createElement("textarea");
    } else if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach(([value, optionLabel]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = optionLabel;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = field.type || "text";
    }

    input.name = field.name;
    input.required = Boolean(field.required);
    if (field.placeholder) input.placeholder = field.placeholder;

    if (field.type === "file") {
      input.accept = field.accept || "";
      label.className = "admin-upload";
      const help = document.createElement("small");
      help.textContent = field.accept?.includes("video") ? "MP4 or WebM, up to 50 MB." : "JPEG, PNG or WebP.";
      const progress = document.createElement("p");
      progress.className = "admin-upload-progress";
      progress.dataset.uploadProgress = field.name;
      input.addEventListener("change", () => uploadFile(input, field, progress));
      label.append(input, help, progress);
      return label;
    }

    const value = record?.[field.name] ?? field.default ?? "";
    if (field.type === "date" && value) {
      input.value = String(value).slice(0, 10);
    } else {
      input.value = value;
    }
    label.appendChild(input);
    return label;
  }

  function openEditor(record = null) {
    const schema = schemas[currentType];
    editingRecord = record;
    editor.hidden = false;
    workspace.classList.add("has-editor");
    editorKicker.textContent = record ? "Edit entry" : "New entry";
    editorTitle.textContent = `${record ? "Edit" : "Add"} ${schema.singular}`;
    contentForm.replaceChildren();

    schema.fields.forEach((field) => contentForm.appendChild(createField(field, record)));

    const actions = document.createElement("div");
    actions.className = "admin-form-actions";
    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = record ? "Save changes" : "Add entry";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "admin-secondary-action";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", closeEditor);
    actions.append(save, cancel);
    contentForm.appendChild(actions);
    contentForm.onsubmit = saveRecord;
    editor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeEditor() {
    editor.hidden = true;
    workspace.classList.remove("has-editor");
    editingRecord = null;
    contentForm.replaceChildren();
  }

  async function uploadFile(input, field, progress) {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      progress.textContent = "This file exceeds the 50 MB limit.";
      progress.classList.add("is-error");
      input.value = "";
      return;
    }

    progress.classList.remove("is-error");
    progress.textContent = "Uploading...";
    input.disabled = true;

    try {
      const extension = slugify(file.name.split(".").pop() || "file");
      const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "media";
      const path = `${field.folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${baseName}.${extension}`;
      const { error } = await client.storage.from(storageBucket).upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });
      if (error) throw error;

      const { data } = client.storage.from(storageBucket).getPublicUrl(path);
      const target = contentForm.elements[field.target];
      if (target) target.value = data.publicUrl;
      progress.textContent = "Upload complete.";
    } catch (error) {
      progress.textContent = error.message || "Upload failed.";
      progress.classList.add("is-error");
    } finally {
      input.disabled = false;
    }
  }

  function formValues() {
    const schema = schemas[currentType];
    const values = {};

    schema.fields.forEach((field) => {
      if (field.type === "file") return;
      const input = contentForm.elements[field.name];
      if (!input) return;
      if (field.type === "checkbox") {
        values[field.name] = input.checked;
      } else if (field.type === "number") {
        values[field.name] = Number.parseInt(input.value, 10) || 100;
      } else {
        values[field.name] = input.value.trim() || null;
      }
    });

    return values;
  }

  async function saveRecord(event) {
    event.preventDefault();
    const schema = schemas[currentType];
    const submit = contentForm.querySelector("button[type='submit']");
    submit.disabled = true;
    setMessage(dashboardMessage, "Saving...");

    try {
      const values = formValues();
      if (currentType === "testimonials" && values.testimonial_type === "written" && !values.quote) {
        throw new Error("A written testimonial needs testimonial text.");
      }
      if (currentType === "testimonials" && values.testimonial_type === "video" && !values.video_url) {
        throw new Error("A video testimonial needs an uploaded video or video URL.");
      }
      let response;

      if (editingRecord) {
        response = await client.from(schema.table).update(values).eq("id", editingRecord.id);
      } else {
        values.created_by = currentUser.id;
        response = await client.from(schema.table).insert(values);
      }

      if (response.error) throw response.error;
      setMessage(dashboardMessage, "Saved.");
      closeEditor();
      await loadRecords();
    } catch (error) {
      setMessage(dashboardMessage, error.message || "The entry could not be saved.", true);
    } finally {
      submit.disabled = false;
    }
  }

  async function deleteRecord(record) {
    const schema = schemas[currentType];
    const title = getRecordTitle(record) || schema.singular;
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setMessage(dashboardMessage, "Deleting...");
    const { error } = await client.from(schema.table).delete().eq("id", record.id);
    if (error) {
      setMessage(dashboardMessage, error.message || "The entry could not be deleted.", true);
      return;
    }

    setMessage(dashboardMessage, "Deleted.");
    if (editingRecord?.id === record.id) closeEditor();
    await loadRecords();
  }

  function currentApiImport(type, payload) {
    if (type === "results") {
      return (payload.results || []).map((item) => ({
        name: item.name,
        designation: item.designation || null,
        school: item.school || null,
        city: item.city || null,
        course: item.course,
        course_group: item.courseGroup,
        score: item.score || null,
        photo_url: item.photoUrl || null,
        featured: Boolean(item.featured),
        published: true,
        sort_order: item.sortOrder ?? 100,
        created_by: currentUser.id
      }));
    }

    if (type === "gallery") {
      return (payload.gallery || []).map((item) => ({
        description: item.description,
        image_url: item.imageUrl,
        published: true,
        sort_order: item.sortOrder ?? 100,
        created_by: currentUser.id
      }));
    }

    if (type === "commencements") {
      return (payload.commencements || []).map((item) => ({
        course: item.course,
        course_group: item.courseGroup,
        display_date: item.commencementDate,
        label: item.label || "New Cohort Commencement Date",
        url: item.url || null,
        published: true,
        sort_order: item.sortOrder ?? 100,
        created_by: currentUser.id
      }));
    }

    return [];
  }

  async function importCurrentData() {
    if (currentType === "testimonials") {
      setMessage(dashboardMessage, "Existing testimonials are stored in the page HTML and should be added through this dashboard.", true);
      return;
    }

    if (records.length && !window.confirm(`There are already ${records.length} entries here. Importing may create duplicates. Continue?`)) {
      return;
    }

    const endpoint = currentType === "commencements" ? "commencements" : currentType;
    setMessage(dashboardMessage, "Importing current content...");
    importRecordsButton.disabled = true;

    try {
      const response = await fetch(`/api/${endpoint}`, { cache: "no-store" });
      if (!response.ok) throw new Error("The current content API could not be loaded.");
      const payload = await response.json();
      if (payload.source === "supabase") {
        throw new Error("The public website is already reading Supabase; no import is needed.");
      }

      const rows = currentApiImport(currentType, payload);
      if (!rows.length) throw new Error("No current records were found to import.");
      const { error } = await client.from(schemas[currentType].table).insert(rows);
      if (error) throw error;

      setMessage(dashboardMessage, `${rows.length} entries imported.`);
      await loadRecords();
    } catch (error) {
      setMessage(dashboardMessage, error.message || "Import failed.", true);
    } finally {
      importRecordsButton.disabled = false;
    }
  }

  async function loadRecords() {
    const schema = schemas[currentType];
    recordList.innerHTML = '<p class="admin-empty">Loading...</p>';
    const { data, error } = await client
      .from(schema.table)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      records = [];
      renderRecords();
      setMessage(dashboardMessage, error.message || "Content could not be loaded.", true);
      return;
    }

    records = data || [];
    renderRecords();
  }

  async function showDashboard(user) {
    currentUser = user;
    const { data, error } = await client
      .from("admin_users")
      .select("user_id, display_name, active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data?.active) {
      await client.auth.signOut();
      setMessage(loginMessage, "This account has not been granted administrator access.", true);
      return;
    }

    loginPanel.hidden = true;
    dashboard.hidden = false;
    signoutButton.hidden = false;
    await loadRecords();
  }

  async function handleLogin(event) {
    event.preventDefault();
    const submit = loginForm.querySelector("button[type='submit']");
    const values = new FormData(loginForm);
    submit.disabled = true;
    setMessage(loginMessage, "Signing in...");

    const { data, error } = await client.auth.signInWithPassword({
      email: values.get("email"),
      password: values.get("password")
    });

    submit.disabled = false;
    if (error) {
      setMessage(loginMessage, "The email or password is incorrect.", true);
      return;
    }

    setMessage(loginMessage, "");
    await showDashboard(data.user);
  }

  async function signOut() {
    await client.auth.signOut();
    currentUser = null;
    dashboard.hidden = true;
    signoutButton.hidden = true;
    loginPanel.hidden = false;
    loginForm.reset();
    closeEditor();
  }

  async function start() {
    if (!window.supabase?.createClient) {
      setMessage(loginMessage, "The administration library could not be loaded.", true);
      return;
    }

    try {
      const response = await fetch("/api/supabase-config", { cache: "no-store" });
      const config = await response.json();
      if (!config.configured) {
        setMessage(loginMessage, "Supabase has not been configured in Netlify yet.", true);
        return;
      }

      storageBucket = config.storageBucket || storageBucket;
      client = window.supabase.createClient(config.url, config.publishableKey);
      const { data } = await client.auth.getSession();
      if (data.session?.user) await showDashboard(data.session.user);
    } catch (error) {
      setMessage(loginMessage, "The administration service is temporarily unavailable.", true);
    }
  }

  loginForm.addEventListener("submit", handleLogin);
  signoutButton.addEventListener("click", signOut);
  newRecordButton.addEventListener("click", () => openEditor());
  importRecordsButton.addEventListener("click", importCurrentData);
  closeEditorButton.addEventListener("click", closeEditor);

  tabButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      currentType = button.dataset.adminTab;
      tabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      importRecordsButton.hidden = currentType === "testimonials";
      closeEditor();
      setMessage(dashboardMessage, "");
      await loadRecords();
    });
  });

  start();
})();
