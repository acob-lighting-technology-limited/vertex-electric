import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./studio";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <h1 className="font-display text-2xl font-semibold">Sanity Studio isn&apos;t connected yet</h1>
        <p className="mt-4 text-muted">
          Create the Vertex project at sanity.io/manage, then set{" "}
          <code className="font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{" "}
          <code className="font-mono">.env.local</code> (see <code className="font-mono">.env.example</code>).
        </p>
      </div>
    );
  }
  return <Studio />;
}
