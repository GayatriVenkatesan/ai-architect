const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${endpoint}`);
  }

  return response.json();
}

/* -------------------- Projects -------------------- */

export async function getProjects() {
  return apiRequest("/projects");
}

export async function createProject(projectData: unknown) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export async function updateProject(projectId: number, projectData: unknown) {
  return apiRequest(`/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });
}

export async function deleteProject(projectId: number) {
  return apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
  });
}

/* -------------------- Analytics -------------------- */

export async function getAnalyticsSummary() {
  return apiRequest("/analytics/summary");
}

/* -------------------- Requirement Analyzer -------------------- */

export async function getRequirements() {
  return apiRequest("/requirements");
}

export async function createRequirementAnalysis(requirementData: unknown) {
  return apiRequest("/requirements/analyze", {
    method: "POST",
    body: JSON.stringify(requirementData),
  });
}

/* -------------------- Interior Design -------------------- */

export async function getInteriorDesigns() {
  return apiRequest("/interior/designs");
}

export async function createInteriorDesign(designData: unknown) {
  return apiRequest("/interior/designs", {
    method: "POST",
    body: JSON.stringify(designData),
  });
}

export async function updateInteriorDesign(
  designId: number,
  designData: unknown
) {
  return apiRequest(`/interior/designs/${designId}`, {
    method: "PUT",
    body: JSON.stringify(designData),
  });
}

export async function deleteInteriorDesign(designId: number) {
  return apiRequest(`/interior/designs/${designId}`, {
    method: "DELETE",
  });
}

/* -------------------- Construction Monitoring -------------------- */

export async function getConstructionUpdates() {
  return apiRequest("/construction/updates");
}

export async function createConstructionUpdate(updateData: unknown) {
  return apiRequest("/construction/updates", {
    method: "POST",
    body: JSON.stringify(updateData),
  });
}

export async function updateConstructionUpdate(
  updateId: number,
  updateData: unknown
) {
  return apiRequest(`/construction/updates/${updateId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}

export async function deleteConstructionUpdate(updateId: number) {
  return apiRequest(`/construction/updates/${updateId}`, {
    method: "DELETE",
  });
}

/* -------------------- Documents -------------------- */

export async function getDocuments() {
  return apiRequest("/documents");
}

export async function createDocument(documentData: unknown) {
  return apiRequest("/documents", {
    method: "POST",
    body: JSON.stringify(documentData),
  });
}

export async function updateDocument(documentId: number, documentData: unknown) {
  return apiRequest(`/documents/${documentId}`, {
    method: "PUT",
    body: JSON.stringify(documentData),
  });
}

export async function deleteDocument(documentId: number) {
  return apiRequest(`/documents/${documentId}`, {
    method: "DELETE",
  });
}

/* -------------------- Feedback / Clients -------------------- */

export async function getFeedback() {
  return apiRequest("/feedback");
}

export async function createFeedback(feedbackData: unknown) {
  return apiRequest("/feedback", {
    method: "POST",
    body: JSON.stringify(feedbackData),
  });
}

export async function updateFeedback(feedbackId: number, feedbackData: unknown) {
  return apiRequest(`/feedback/${feedbackId}`, {
    method: "PUT",
    body: JSON.stringify(feedbackData),
  });
}

export async function deleteFeedback(feedbackId: number) {
  return apiRequest(`/feedback/${feedbackId}`, {
    method: "DELETE",
  });
}

/* -------------------- 2D Floor Plans -------------------- */

export async function getFloorPlans() {
  return apiRequest("/floor-plans/");
}

export async function createFloorPlan(floorPlanData: unknown) {
  return apiRequest("/floor-plans/", {
    method: "POST",
    body: JSON.stringify(floorPlanData),
  });
}

export async function updateFloorPlan(
  floorPlanId: number,
  floorPlanData: unknown
) {
  return apiRequest(`/floor-plans/${floorPlanId}`, {
    method: "PUT",
    body: JSON.stringify(floorPlanData),
  });
}

export async function deleteFloorPlan(floorPlanId: number) {
  return apiRequest(`/floor-plans/${floorPlanId}`, {
    method: "DELETE",
  });
}

/* -------------------- AI Chatbot -------------------- */

export async function sendChatMessage(chatData: unknown) {
  return apiRequest("/chatbot/ask", {
    method: "POST",
    body: JSON.stringify(chatData),
  });
}