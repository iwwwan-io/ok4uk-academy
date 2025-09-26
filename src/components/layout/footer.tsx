import Link from "next/link";
import { Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-4 md:px-8 lg:px-16 py-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <Link
              href="/"
              className="hover:underline hover:text-primary transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:underline hover:text-primary transition"
            >
              About
            </Link>
            <Link
              href="/team"
              className="hover:underline hover:text-primary transition"
            >
              Team
            </Link>
            <Link
              href="/nvq"
              className="hover:underline hover:text-primary transition"
            >
              NVQ
            </Link>

            <Link
              href="/contact"
              className="hover:underline hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          {/* Social Media */}
          <div className="flex gap-4">
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 hover:text-primary transition" />
            </Link>
            <Link
              href="https://www.facebook.com"
              target="_blank"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 hover:text-primary transition" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-center">
          <span>© OK4UK Academy 2025. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
