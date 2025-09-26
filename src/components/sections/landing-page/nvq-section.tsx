import { SectionWrapper } from "./section-wrapper";

export function NvqSection() {
  return (
    <SectionWrapper className="bg-muted">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-mono">
          What is an NVQ?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          National Vocational Qualifications (NVQs) are work-based awards in
          England, Wales, and Northern Ireland that are achieved through
          assessment and training. <strong>OK4UK</strong> helps you earn them
          with ease, fully guided.
        </p>
      </div>
    </SectionWrapper>
  );
}
