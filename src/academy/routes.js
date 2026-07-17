export function parseAppRoute(hash = "") {
  const segments = String(hash)
    .replace(/^#/, "")
    .split("/")
    .filter(Boolean);
  const view = segments[0] || "today";

  return {
    view,
    academyCourseSlug: view === "academy" ? segments[1] || null : null,
  };
}

export function academyRoute(courseSlug = null) {
  return courseSlug ? `academy/${encodeURIComponent(courseSlug)}` : "academy";
}
