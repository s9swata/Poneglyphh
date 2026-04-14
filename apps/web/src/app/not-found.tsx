import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-40 flex flex-col items-center gap-8 text-center">
      <p className="text-[120px] font-semibold text-grey-3 leading-none">404</p>
      <div className="flex flex-col gap-4 -mt-4">
        <h1 className="text-[clamp(28px,4vw,40px)] font-medium text-black">Page not found</h1>
        <p className="text-body text-grey-1 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors"
      >
        Back to homepage <ArrowRight size={16} />
      </Link>
    </section>
  );
}
