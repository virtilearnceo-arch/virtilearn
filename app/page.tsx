// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";
import { HeroSectionOne } from "@/components/Landing/Hero";
import { MarqueeDemo } from "@/components/Landing/Marquee";
// import { WhyChooseUs } from "@/components/Landing/AnimatedBeam";
import { WhyChooseSkillveta } from "@/components/magicui/AnimatedList ";
import { InternshipFlow } from "@/components/Landing/Timeine";
import TopHighlights from "@/components/Landing/TopHighlights";
import CertificatesShowcase from "@/components/Landing/CertificatesShowcase";
// import LinkedInMockScroll from "@/components/Landing/LinkedinInMockScroll";
import PartnershipsShowcase from "@/components/Landing/PartnershipsShowcase";
import TerminalCareerDemo from "@/components/Landing/TerminalCareerDemo";
import FAQSection from "@/components/Landing/FAQSection";
import VerifyCertificateCard from "@/components/Landing/VerifyCertificateCard";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-20 md:my-12 my-8 ">

        <AnimatedGridPattern
          numSquares={10}
          maxOpacity={0.8}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
        <HeroSectionOne />
      </div>



      <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-32 md:my-32 my-24 ">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(1500px_circle_at_right,white,transparent)]",
          )}
        />
        <TerminalCareerDemo />
      </div>



      <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-28 md:my-12 my-10 ">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          // strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:linear-gradient(to_top,white,transparent,transparent)]",
          )}
        />
        {/* <TerminalCareerDemo /> */}
        <CertificatesShowcase />
      </div>



      <InternshipFlow />

      <div className="relative flex  w-full items-center justify-center overflow-hidden rounded-lg border-none bg-background p-20 md:my-32 my-24">
        <AnimatedGridPattern
          numSquares={10}
          maxOpacity={0.8}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
        <TopHighlights />
      </div>


      <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-32 md:mb-32 mb-24 ">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(1500px_circle_at_right,white,transparent)]",
          )}
        />
        <WhyChooseSkillveta />
      </div>

      {/* <LinkedInMockScroll /> */}


      {/* <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-20 md:my-12 my-8 ">

        <PartnershipsShowcase />
      </div> */}

      <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-20 md:my-12 my-8 ">

        <MarqueeDemo />
      </div>


      <FAQSection />

      <div className="relative flex size-full items-center justify-center overflow-hidden  rounded-lg border-none bg-background py-20 md:my-12 my-8 ">

        <GridPattern
          width={60}
          height={60}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}

          className={cn(
            "[mask-image:linear-gradient(to_left,white,transparent,transparent)]",
          )}
        />
        {/* <TerminalCareerDemo /> */}
        <VerifyCertificateCard />
      </div>



    </main>
  );
}
