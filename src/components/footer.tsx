import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="px-5 sm:px-8 py-8 pb-28 md:pb-8 border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-xs text-muted-fg">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </p>
        <p>Thanks for reading this far.</p>
      </div>
    </footer>
  );
}
