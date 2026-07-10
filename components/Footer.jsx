export default function Footer() {
  return (
    <footer className="relative z-[2] border-t border-white/[0.06] px-5 py-[26px] text-center text-muted2 text-xs">
      © {new Date().getFullYear()} TurfNext Technologies Pvt. Ltd. ·{" "}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted no-underline hover:text-accent"
      >
        Instagram
      </a>{" "}
      ·{" "}
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted no-underline hover:text-accent"
      >
        LinkedIn
      </a>{" "}
      ·{" "}
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted no-underline hover:text-accent"
      >
        Twitter
      </a>
    </footer>
  );
}
