import {
  markBlade,
  markInk,
  markViewBox,
  rcInk,
  rcRule,
  registrationViewBox,
  wordBlade,
  wordInk,
  wordmarkViewBox,
} from "./logo-paths";

type LogoProps = {
  /** wordmark: "VERTEX" only · registration: with the RC line · mark: the V monogram */
  variant?: "wordmark" | "registration" | "mark";
  /** Ink follows the theme by default; force it for placements on photos/video. */
  ink?: "theme" | "light" | "dark";
  className?: string;
  title?: string;
};

const inkColor = {
  theme: "var(--vx-logo-ink)",
  light: "var(--vx-paper)",
  dark: "var(--vx-ink)",
} as const;

export function Logo({ variant = "wordmark", ink = "theme", className, title = "Vertex" }: LogoProps) {
  const gid = `vx-blade-${variant}`;
  const viewBox =
    variant === "mark" ? markViewBox : variant === "registration" ? registrationViewBox : wordmarkViewBox;

  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id={gid} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--vx-blue-400)" />
          <stop offset=".55" stopColor="var(--vx-blue-600)" />
          <stop offset="1" stopColor="var(--vx-blue-900)" />
        </linearGradient>
      </defs>
      {variant === "mark" ? (
        <>
          <path fill={inkColor[ink]} d={markInk} />
          <path fill={`url(#${gid})`} d={markBlade} />
        </>
      ) : (
        <>
          <path fill={inkColor[ink]} d={wordInk} />
          <path fill={`url(#${gid})`} d={wordBlade} />
          {variant === "registration" && (
            <>
              <path fill={inkColor[ink]} d={rcInk} />
              <path fill={`url(#${gid})`} d={rcRule} />
            </>
          )}
        </>
      )}
    </svg>
  );
}
