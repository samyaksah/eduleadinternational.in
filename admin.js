(function initializeAdmin() {
  const loginPanel = document.querySelector("[data-login-panel]");
  const loginForm = document.querySelector("[data-login-form]");
  const loginMessage = document.querySelector("[data-login-message]");
  const dashboard = document.querySelector("[data-dashboard]");
  const dashboardMessage = document.querySelector("[data-dashboard-message]");
  const signoutButton = document.querySelector("[data-signout]");
  const tabButtons = document.querySelectorAll("[data-admin-tab]");
  const newRecordButton = document.querySelector("[data-new-record]");
  const recordList = document.querySelector("[data-record-list]");
  const recordCount = document.querySelector("[data-record-count]");
  const recordsTitle = document.querySelector("[data-records-title]");
  const recordsDescription = document.querySelector("[data-records-description]");
  const recordSearch = document.querySelector("[data-record-search]");
  const recordFilterTabs = document.querySelector("[data-record-filter-tabs]");
  const typeFilterWrap = document.querySelector("[data-type-filter-wrap]");
  const typeFilter = document.querySelector("[data-type-filter]");
  const statusFilter = document.querySelector("[data-status-filter]");
  const clearFiltersButton = document.querySelector("[data-clear-filters]");
  const orderHelp = document.querySelector("[data-order-help]");
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
        { name: "published", label: "Published", type: "checkbox" },
        { name: "sort_order", label: "Display order", type: "number", default: 100 }
      ]
    },
    brochures: {
      table: "course_brochures",
      title: "Course brochures",
      singular: "course brochure",
      description: "PDF brochures linked from each course page.",
      fields: [
        { name: "course_slug", label: "Course", type: "select", options: [
          ["teaching-learning", "Teaching and Learning"],
          ["educational-leadership", "Educational Leadership"],
          ["cpd-online", "CPD Online"],
          ["certified-training", "Certified Training"]
        ], required: true },
        { name: "title", label: "Brochure title", required: true },
        { name: "file_url", label: "PDF URL", type: "url", required: true },
        { name: "file_upload", label: "Upload PDF", type: "file", accept: "application/pdf", target: "file_url", folder: "brochures" },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "sort_order", label: "Display order", type: "number", default: 100 }
      ]
    }
  };

  const listFilterConfigs = {
    results: {
      field: "course_group",
      options: [
        ["all", "All results"],
        ["teachingLearning", "Teaching & Learning"],
        ["educationalLeadership", "Educational Leadership"]
      ]
    },
    commencements: {
      field: "course_group",
      options: [["all", "All courses"], ...COURSE_OPTIONS]
    },
    testimonials: {
      field: "course_slug",
      options: [
        ["all", "All pages"],
        ["general", "Homepage"],
        ["teaching-learning", "Teaching & Learning"],
        ["educational-leadership", "Educational Leadership"],
        ["cpd-online", "CPD Online"],
        ["certified-training", "Certified Training"]
      ]
    },
    brochures: {
      field: "course_slug",
      options: [
        ["all", "All courses"],
        ["teaching-learning", "Teaching & Learning"],
        ["educational-leadership", "Educational Leadership"],
        ["cpd-online", "CPD Online"],
        ["certified-training", "Certified Training"]
      ]
    }
  };

  let client;
  let storageBucket = "site-media";
  let currentType = "results";
  let records = [];
  let editingRecord = null;
  let currentUser = null;
  let listFilters = { query: "", group: "all", type: "all", status: "all" };
  let draggedRecordId = null;
  let draggedOrder = [];
  let orderIsSaving = false;

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
    if (currentType === "brochures") return record.title;
    return record.course;
  }

  function getRecordSubtitle(record) {
    if (currentType === "results") return [record.designation, record.school].filter(Boolean).join(" | ");
    if (currentType === "gallery") return `Order ${record.sort_order ?? 100}`;
    if (currentType === "commencements") return record.display_date || formatDate(record.commencement_date);
    if (currentType === "brochures") return record.course_slug;
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

  function configureListTools() {
    listFilters = { query: "", group: "all", type: "all", status: "all" };
    recordSearch.value = "";
    typeFilter.value = "all";
    statusFilter.value = "all";
    typeFilterWrap.hidden = currentType !== "testimonials";
    renderFilterTabs();
    updateOrderHelp();
  }

  function renderFilterTabs() {
    const config = listFilterConfigs[currentType];
    recordFilterTabs.replaceChildren();
    recordFilterTabs.hidden = !config;
    if (!config) return;

    config.options.forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.filterValue = value;
      button.classList.toggle("is-active", listFilters.group === value);
      button.textContent = label;
      recordFilterTabs.appendChild(button);
    });
  }

  function recordSearchText(record) {
    return Object.values(record)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .join(" ")
      .toLowerCase();
  }

  function filteredRecords() {
    const config = listFilterConfigs[currentType];
    const query = listFilters.query.toLowerCase();

    return records.filter((record) => {
      if (query && !recordSearchText(record).includes(query)) return false;
      if (config && listFilters.group !== "all" && record[config.field] !== listFilters.group) return false;
      if (currentType === "testimonials" && listFilters.type !== "all" && record.testimonial_type !== listFilters.type) return false;
      if (listFilters.status === "published" && !record.published) return false;
      if (listFilters.status === "draft" && record.published) return false;
      return true;
    });
  }

  function canReorderRecords() {
    return !listFilters.query && listFilters.status === "all" && !orderIsSaving;
  }

  function updateOrderHelp() {
    if (listFilters.query || listFilters.status !== "all") {
      orderHelp.textContent = "Clear search and publication filters to reorder entries.";
      orderHelp.classList.add("is-disabled");
      return;
    }

    orderHelp.textContent = "Drag entries to change their display order. On touch screens, use the arrow buttons.";
    orderHelp.classList.remove("is-disabled");
  }

  function createMoveButton(record, direction, disabled) {
    const button = document.createElement("button");
    const label = direction < 0 ? "Move up" : "Move down";
    button.type = "button";
    button.className = "admin-move-button";
    button.textContent = direction < 0 ? "\u2191" : "\u2193";
    button.title = label;
    button.setAttribute("aria-label", `${label}: ${getRecordTitle(record) || "entry"}`);
    button.disabled = disabled;
    button.addEventListener("click", () => moveRecord(record.id, direction));
    return button;
  }

  function renderRecords() {
    const schema = schemas[currentType];
    const visibleRecords = filteredRecords();
    const reorderEnabled = canReorderRecords();
    recordsTitle.textContent = schema.title;
    recordsDescription.textContent = schema.description;
    recordCount.textContent = visibleRecords.length === records.length
      ? `${records.length} ${records.length === 1 ? "entry" : "entries"}`
      : `${visibleRecords.length} of ${records.length} entries`;
    recordList.replaceChildren();
    updateOrderHelp();

    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = `No ${schema.title.toLowerCase()} have been added yet.`;
      recordList.appendChild(empty);
      return;
    }

    if (!visibleRecords.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = "No entries match the current search and filters.";
      recordList.appendChild(empty);
      return;
    }

    visibleRecords.forEach((record, index) => {
      const item = document.createElement("article");
      item.className = "admin-record";
      item.dataset.recordId = record.id;
      item.draggable = reorderEnabled;

      const dragHandle = document.createElement("span");
      dragHandle.className = "admin-drag-handle";
      dragHandle.setAttribute("aria-hidden", "true");
      dragHandle.title = reorderEnabled ? "Drag to reorder" : "Clear search and status filters to reorder";
      dragHandle.textContent = "\u22ee\u22ee";
      item.appendChild(dragHandle);
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
      actions.append(
        createMoveButton(record, -1, !reorderEnabled || index === 0),
        createMoveButton(record, 1, !reorderEnabled || index === visibleRecords.length - 1)
      );
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

  function recordIdsInList() {
    return [...recordList.querySelectorAll(".admin-record")]
      .map((item) => item.dataset.recordId)
      .filter(Boolean);
  }

  async function persistRecordOrder(orderedIds) {
    if (orderIsSaving || orderedIds.length < 2) return;
    orderIsSaving = true;
    renderRecords();
    setMessage(dashboardMessage, "Saving display order...");

    const previousOrders = new Map(records.map((record) => [record.id, record.sort_order]));
    orderedIds.forEach((id, index) => {
      const record = records.find((item) => item.id === id);
      if (record) record.sort_order = (index + 1) * 10;
    });

    try {
      const responses = await Promise.all(
        orderedIds.map((id, index) =>
          client
            .from(schemas[currentType].table)
            .update({ sort_order: (index + 1) * 10 })
            .eq("id", id)
        )
      );
      const failed = responses.find((response) => response.error);
      if (failed?.error) throw failed.error;

      records.sort((a, b) => {
        const orderDifference = (a.sort_order ?? 100) - (b.sort_order ?? 100);
        if (orderDifference) return orderDifference;
        return String(a.created_at || "").localeCompare(String(b.created_at || ""));
      });
      setMessage(dashboardMessage, "Display order saved.");
    } catch (error) {
      records.forEach((record) => {
        if (previousOrders.has(record.id)) record.sort_order = previousOrders.get(record.id);
      });
      setMessage(dashboardMessage, error.message || "The display order could not be saved.", true);
    } finally {
      orderIsSaving = false;
      renderRecords();
    }
  }

  function moveRecord(recordId, direction) {
    if (!canReorderRecords()) return;
    const ids = filteredRecords().map((record) => record.id);
    const currentIndex = ids.indexOf(recordId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ids.length) return;
    [ids[currentIndex], ids[nextIndex]] = [ids[nextIndex], ids[currentIndex]];
    persistRecordOrder(ids);
  }

  function startRecordDrag(event) {
    const item = event.target.closest(".admin-record");
    if (!item?.draggable || !canReorderRecords()) {
      event.preventDefault();
      return;
    }

    draggedRecordId = item.dataset.recordId;
    draggedOrder = recordIdsInList();
    item.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedRecordId);
  }

  function moveDraggedRecord(event) {
    if (!draggedRecordId) return;
    const target = event.target.closest(".admin-record");
    const dragged = recordList.querySelector(`[data-record-id="${draggedRecordId}"]`);
    if (!target || !dragged || target === dragged) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const bounds = target.getBoundingClientRect();
    const placeAfter = event.clientY > bounds.top + bounds.height / 2;
    recordList.insertBefore(dragged, placeAfter ? target.nextSibling : target);
  }

  function finishRecordDrag() {
    if (!draggedRecordId) return;
    recordList.querySelectorAll(".admin-record").forEach((item) => item.classList.remove("is-dragging"));
    const nextOrder = recordIdsInList();
    const changed = nextOrder.some((id, index) => id !== draggedOrder[index]);
    draggedRecordId = null;
    draggedOrder = [];
    if (changed) persistRecordOrder(nextOrder);
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
      help.textContent = field.accept?.includes("application/pdf")
        ? "PDF, up to 50 MB."
        : field.accept?.includes("video")
          ? "MP4 or WebM, up to 50 MB."
          : "JPEG, PNG or WebP.";
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
      const message = currentType === "brochures" && error.code === "23505"
        ? "A brochure already exists for this course. Edit the existing entry instead."
        : error.message || "The entry could not be saved.";
      setMessage(dashboardMessage, message, true);
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
    configureListTools();
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
  closeEditorButton.addEventListener("click", closeEditor);
  recordSearch.addEventListener("input", () => {
    listFilters.query = recordSearch.value.trim();
    renderRecords();
  });
  statusFilter.addEventListener("change", () => {
    listFilters.status = statusFilter.value;
    renderRecords();
  });
  typeFilter.addEventListener("change", () => {
    listFilters.type = typeFilter.value;
    renderRecords();
  });
  clearFiltersButton.addEventListener("click", () => {
    configureListTools();
    renderRecords();
    recordSearch.focus();
  });
  recordFilterTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter-value]");
    if (!button) return;
    listFilters.group = button.dataset.filterValue;
    renderFilterTabs();
    renderRecords();
  });
  recordList.addEventListener("dragstart", startRecordDrag);
  recordList.addEventListener("dragover", moveDraggedRecord);
  recordList.addEventListener("drop", (event) => event.preventDefault());
  recordList.addEventListener("dragend", finishRecordDrag);

  tabButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      currentType = button.dataset.adminTab;
      tabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      closeEditor();
      setMessage(dashboardMessage, "");
      configureListTools();
      await loadRecords();
    });
  });

  start();
})();
