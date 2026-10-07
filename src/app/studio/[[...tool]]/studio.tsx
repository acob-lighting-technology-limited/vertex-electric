"use client";

import { NextStudio } from "next-sanity/studio/client-component";
import config from "../../../../sanity.config";

// The Sanity config pulls in client-only modules, so it must load from a Client Component.
export function Studio() {
  return <NextStudio config={config} />;
}
