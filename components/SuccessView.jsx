import Link from "next/link";

export default function SuccessView({ title, message }) {
  return (
    <div className="text-center py-[30px] px-2.5" role="status">
      <div
        className="w-16 h-16 rounded-full bg-accent/[0.08] border border-accent/[0.19] flex items-center justify-center mx-auto mb-[22px] text-3xl text-accent"
        aria-hidden="true"
      >
        ✓
      </div>
      <h3 className="font-display font-black text-[21px] mb-2.5">{title}</h3>
      <p className="text-muted text-[13.5px] leading-[1.7] max-w-[380px] mx-auto">
        {message}
      </p>
      <Link
        href="/"
        className="mt-[22px] w-full inline-flex items-center justify-center gap-[9px] px-[26px] py-[15px] rounded-r text-[14.5px] font-bold bg-transparent text-ink border border-white/[0.16] no-underline transition-all duration-200 hover:border-accent hover:text-accent"
      >
        Back to Home
      </Link>
    </div>
  );
}
