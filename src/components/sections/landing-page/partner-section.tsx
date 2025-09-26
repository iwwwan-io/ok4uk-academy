import Image from "next/image";

const partners = [
  "/logo/partners/nus.svg",
  "/logo/partners/totum-logo.svg",
  "/logo/partners/isic-logo.png",
  "/logo/partners/unesco-logo.svg",
  "/logo/partners/nocn-logo.png",
  "/logo/partners/vital-energy-logo.svg",
  "/logo/partners/isic-logo.png",
  "/logo/partners/unesco-logo.svg",
];

export default function PartnerSection() {
  return (
    <section className="py-8 overflow-hidden">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-4 font-mono">Trusted by</h3>
      </div>

      <div className="relative w-full overflow-x-hidden">
        {/* concat(partners) → duplikasi daftar supaya looping mulus */}
        <div className="animate-marquee flex whitespace-nowrap gap-6 sm:gap-8">
          {partners.concat(partners).map((src, i) => (
            <div
              key={i}
              className="flex items-center justify-center min-w-[100px] sm:min-w-[150px] h-26 sm:h-32"
            >
              <Image
                src={src}
                alt={`Partner logo ${i + 1}`}
                width={100}
                height={100}
                className="object-contain lg:grayscale hover:grayscale-0 transition w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
