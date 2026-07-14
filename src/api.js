export async function loadCloudProgress(deviceId) {
  const response = await fetch(`/api/progress/${encodeURIComponent(deviceId)}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Progress load failed: ${response.status}`);
  const payload = await response.json();
  return payload.progress;
}

export async function saveCloudProgress(deviceId, progress) {
  const response = await fetch(`/api/progress/${encodeURIComponent(deviceId)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ progress }),
  });
  if (!response.ok) throw new Error(`Progress save failed: ${response.status}`);
  return response.json();
}

export async function loadMe() {
  const response = await fetch("/api/me", {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return { authenticated: false, user: null };
  return response.json();
}
