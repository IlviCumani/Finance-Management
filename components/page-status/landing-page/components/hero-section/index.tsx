import Link from "next/link"
import LiquidEther from "@/components/page-status/landing-page/components/ui/liquid-ether"
import CardSwap from "@/components/page-status/landing-page/components/ui/card-swap"
import { CardSwapCard } from "./card-swap-card"
import SplitText from "@/components/page-status/landing-page/components/ui/split-text"
import { Button } from "@/components/ui/button"
import Image1PNG from "@/assets/temp-images/goku-blue.jpg"
import Image2PNG from "@/assets/temp-images/goku-yellow.avif"
import Image3PNG from "@/assets/temp-images/goku-red.jpg"

export default function HeroSection() {
  const colors = ["#bbf7d0", "#6ee7b7", "#86efac"]

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <LiquidEther
        colors={colors}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />

      <div className="absolute top-1/4 left-8 z-10 flex max-w-md flex-col items-start gap-5 md:left-16">
        <SplitText
          text="Take Control of Your Finances"
          className="text-4xl font-bold text-foreground drop-shadow-lg md:text-5xl"
          delay={40}
          duration={1.25}
          ease="power3.out"
          splitType="words"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-50px"
          textAlign="left"
          tag="h1"
        />
        <SplitText
          text="Track spending, manage recurring payments, and gain insights into your money — all in one place."
          className="text-base text-muted-foreground drop-shadow-sm md:text-lg"
          delay={20}
          duration={1}
          ease="power2.out"
          splitType="words"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-50px"
          textAlign="left"
          tag="p"
        />
        <Button asChild size="lg" className="mt-2 shadow-lg">
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </div>

      <CardSwap
        cardDistance={55}
        verticalDistance={65}
        delay={7000}
        width={700}
        height={400}
        pauseOnHover={false}
        easing="linear"
      >
        <CardSwapCard imageurl={Image1PNG.src} />
        <CardSwapCard imageurl={Image2PNG.src} />
        <CardSwapCard imageurl={Image3PNG.src} />
      </CardSwap>
    </div>
  )
}
