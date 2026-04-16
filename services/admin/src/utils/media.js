const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const apiOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, "");
const defaultBrandIcon = "/branding/clever-quest-giraffe.svg";

function resolveMediaUrl(source) {
  if (!source) {
    return "";
  }

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  if (source.startsWith("/uploads/")) {
    return `${apiOrigin}${source}`;
  }

  return source;
}

export {
  apiOrigin,
  defaultBrandIcon,
  resolveMediaUrl
};