/**
 * Applies the saved theme before first paint so there is no flash.
 * Dark is the brand default; light is opt-in and remembered per browser.
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export const THEME_STORAGE_KEY = "vx-theme";

// Also marks the intro curtain as seen after the first page view of the session.
const script = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}try{if(sessionStorage.getItem("vx-intro"))d.setAttribute("data-intro","seen");else sessionStorage.setItem("vx-intro","1")}catch(e){d.setAttribute("data-intro","seen")}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
