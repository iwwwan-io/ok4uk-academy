import React from 'react'
import Hero from '@/components/sections/landing-page/hero'
import PartnerSection from '@/components/sections/landing-page/partner-section'
import AboutSection from '@/components/sections/landing-page/about-section'
import WhyChooseUs from '@/components/sections/landing-page/why-choose-us'
import { ShopSection } from '@/components/sections/landing-page/shop-section'
import { NvqSection } from '@/components/sections/landing-page/nvq-section'
import { MeetOurTeamSection } from '@/components/sections/landing-page/meet-our-team-section'
import { ContactUsSection } from '@/components/sections/landing-page/contact-us'

export default async function HomePage() {
  return (
    <>
      <Hero />
      <PartnerSection />
      <AboutSection />
      <WhyChooseUs />
      <ShopSection />
      <NvqSection />
      <MeetOurTeamSection />
      <ContactUsSection />
    </>
  )
}
