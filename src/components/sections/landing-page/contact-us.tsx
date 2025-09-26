import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "./section-wrapper";

export function ContactUsSection() {
  return (
    <SectionWrapper className="bg-muted">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-base md:text-lg mb-6">
          Have questions? Need help choosing a course?
          <br />
          We’re here to support you every step of the way.
        </p>

        <div className="flex flex-col items-center gap-2 text-sm md:text-base mb-6">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>
              Email:{" "}
              <a href="mailto:info@ok4ukacademy.co.uk" className="underline">
                support@ok4uk.academy
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>
              Phone:{" "}
              <a href="tel:+447555 903621" className="underline">
                +44 755 590 3621
              </a>
            </span>
          </div>
        </div>

        <Link href="/contact">
          <Button variant="default" size="lg">
            Contact Us
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
