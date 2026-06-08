"use client"

import HeroSection from "@/components/page-status/landing-page/components/hero-section"
import { Header } from "@/components/page-status/landing-page/components/header"
import DashboardSection from "@/components/page-status/landing-page/components/dashboard-section"
import TransactionsSection from "@/components/page-status/landing-page/components/transactions-section"
import RecurringSection from "@/components/page-status/landing-page/components/recurring-section"
import AccountsSection from "@/components/page-status/landing-page/components/accounts-section"
import CategoriesSection from "@/components/page-status/landing-page/components/categories-section"
import RoadmapSection from "@/components/page-status/landing-page/components/roadmap-section"
import AboutSection from "@/components/page-status/landing-page/components/about-section"
import TestimonialsSection from "@/components/page-status/landing-page/components/testimonials-section"
import Footer from "@/components/page-status/landing-page/components/footer"

export default function LandingPage() {
  return (
    <div className="dark bg-background text-foreground">
      <Header />
      <HeroSection />
      <AboutSection />
      <DashboardSection />
      <TransactionsSection />
      <RecurringSection />
      <AccountsSection />
      <CategoriesSection />
      <TestimonialsSection />
      <RoadmapSection />
      <Footer />
    </div>
  )
}
