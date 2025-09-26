"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, ClipboardList } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";

export function ShopSection() {
  const cards = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      level: "Level 2",
      title: "Decorating and Carpentry",
      price: "300",
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      level: "Level 2",
      title:
        "Trade (Passive Fire, Carpentry, Dryling, Traffic Management, Site Logistic)",
      price: "800",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      level: "Level 3",
      title: "Diploma in Supervision suitable for Gold CSCS Card",
      price: "300",
    },
  ];

  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-mono">
          Start Your NVQ Journey Today
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="transition hover:shadow-lg flex flex-col justify-between"
          >
            <CardHeader className="flex flex-col gap-2">
              <h2 className="font-bold text-4xl">NVQ</h2>
              <CardTitle className="text-primary text-4xl">
                {card.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between gap-6">
              <p className="text-accent-foreground text-lg">{card.title}</p>
              <p className="text-primary font-bold text-4xl">£{card.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
