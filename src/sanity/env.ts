export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Empty until the Vertex Sanity project is created; the Studio route explains this. */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const isSanityConfigured = projectId.length > 0;
