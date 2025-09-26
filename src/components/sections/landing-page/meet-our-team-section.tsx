// components/sections/MeetOurTeamSection.tsx

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SectionWrapper } from "./section-wrapper";
import { Linkedin } from "lucide-react";
import Link from "next/link";

export function MeetOurTeamSection() {
  const team = [
    {
      name: "Nick Boldorea",
      role: "CEO",
      image: "/images/team/nick-boldorea.jpeg",
      linkedin: "https://www.linkedin.com/in/boldorea/",
    },
    {
      name: "Dean Bashford",
      role: " Operation Manager",
      image: "/images/team/dean-bashford.jpeg",
      linkedin:
        "https://www.linkedin.com/in/dean-bashford-certiosh-tmiet-aiema-b08367181/",
    },
    {
      name: "Stan Hughes",
      role: "Internal Quality Assurance",
      image: "/images/team/anonimous.jpg",
      linkedin: "https://www.linkedin.com/in/stan-hughes-94478117/",
    },
    {
      name: "Ahmed Awadalla MCIOB",
      role: "Assessor",
      image: "/images/team/ahmed-awadella.jpeg",
      linkedin: "https://www.linkedin.com/in/ahmed-awadalla-mciob-5a76aa238/",
    },
    {
      name: "Alex Popivoda, MCIOB, CMILT",
      role: "Assessor",
      image: "/images/team/alex-popivoda.jpeg",
      linkedin:
        "https://www.linkedin.com/in/alex-popivoda-mciob-cmilt-b0972b54/",
    },
    {
      name: "Mihhail Odnolko",
      role: "Assessor",
      image: "/images/team/mihhail.jpeg",
      linkedin: "https://www.linkedin.com/in/mihhail-odnolko-57a63385/",
    },
    {
      name: "Ray Goddard MCIOB",
      role: "Assessor Level 7",
      image: "/images/team/ray-goddard.jpeg",
      linkedin: "https://www.linkedin.com/in/ray-goddard-mciob-404a09a8/",
    },
    {
      name: "Daniela Szabo",
      role: "Office admin",
      image: "/images/team/daniela-szabo.jpeg",
      linkedin: "https://www.linkedin.com/in/daniela-szabo-1609b1242/",
    },
    {
      name: "Iwan Kurniawan",
      role: "Senior Graphic Designer",
      image: "/images/team/iwan-kurniawan.jpeg",
      linkedin: "https://www.linkedin.com/in/iwan-kurniawan-3b43a536a/",
    },
  ];

  return (
    <SectionWrapper>
      {/* Heading & description */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono">
          Meet Our Team
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          We’re a group of professionals passionate about helping others
          succeed. From assessors to admins, every person at{" "}
          <strong>OK4UK Academy</strong> plays a key role in your success.
        </p>
      </div>

      {/* Team grid */}
      <div className="grid gap-8 grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.name} className="group transition hover:shadow-lg">
            <CardHeader className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative h-24 w-24 overflow-hidden rounded-full mb-4">
                <Image
                  src={member.image}
                  alt={`${member.name} photo`}
                  fill
                  sizes="96px"
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <CardTitle className="text-center">{member.name}</CardTitle>
              <CardDescription className="text-primary">
                {member.role}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center">
              {member.linkedin && (
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-600 transition"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
