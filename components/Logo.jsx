import Link from "next/link";

/**
 * TurfNext brand mark. Pure presentational server component.
 * The mark is an inline SVG (no raster asset needed) so it stays crisp
 * at any size and ships with zero extra network requests.
 */
export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 no-underline"
      aria-label="TurfNext — Go to homepage"
    >
      <span className="w-6 h-[33px] shrink-0" aria-hidden="true">
        <svg
          viewBox="0 0 52 72"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <polygon points="8,72 22,72 44,28 30,28" fill="#C8FF00" />
          <polygon
            points="28,72 40,72 62,28 50,28"
            fill="#C8FF00"
            opacity="0.35"
          />
        </svg>
      </span>
      <span className="font-display font-black text-[19px] leading-none tracking-[-1px]">
        <span className="text-white">Turf</span>
        <span className="text-accent">Next</span>
      </span>
    </Link>
  );
}
