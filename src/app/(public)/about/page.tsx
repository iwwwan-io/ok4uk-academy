// app/about/page.tsx
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target, Calendar } from "lucide-react";
import Link from "next/link";
import { MeetOurTeamSection } from "@/components/sections/landing-page/meet-our-team-section";

export const metadata: Metadata = {
  title: "About Us | OK4UK Academy",
  description:
    "Learn more about OK4UK Academy – who we are, our mission, and how we support your professional journey.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 mt-16 space-y-16">
      {/* Hero / Title */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">About OK4UK Academy</h1>
        <p className="text-muted-foreground text-lg">
          We are a UK-based academy committed to empowering professionals
          through nationally recognised qualifications.
        </p>
      </section>

      {/* Our Story */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Story</h2>
        <p>
          OK4UK Academy was founded with a clear mission — to provide
          accessible, flexible, and accredited NVQ qualifications to individuals
          and businesses across the UK. Backed by OK4UK Ltd, our team has years
          of experience in education, health & safety, and vocational training.
          We are here to support learners at every stage of their journey.
        </p>
        <p>
          We understand that many professionals are working full-time or
          juggling responsibilities, which is why we specialise in self-paced,
          assessor-guided programs that work around your life — not against it.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To be the leading provider of vocational qualifications in the UK,
              making professional development achievable for everyone, anywhere.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To deliver high-quality NVQ programs that are accessible,
              flexible, and supported by real industry experts, helping people
              reach their full potential.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Timeline / History (static version) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Milestones
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-lg">2021</h3>
              <p>OK4UK Ltd established.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-lg">2023</h3>
              <p>Launch of OK4UK Academy.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-lg">2024</h3>
              <p>
                Officially registered as NVQ provider with full assessor team
                onboard.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-lg">2025</h3>
              <p>Launch of online shop & student portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4">
        <p className="text-lg">
          Ready to start your NVQ journey? Explore our qualifications and see
          how we can help.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/nvq">
            <Button className="hover:scale-105 transition-transform">
              Explore NVQ Programs
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              Visit the Shop
            </Button>
          </Link>
        </div>
      </section>

      {/* Meet Our Team */}
      <MeetOurTeamSection />
    </main>
  );
}
