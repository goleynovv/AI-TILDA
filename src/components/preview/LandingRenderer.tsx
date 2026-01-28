"use client";

import type {
  LandingPageData,
  HeroContent,
  FeaturesContent,
  ProblemContent,
  HowItWorksContent,
  CompetitorsContent,
  CtaContent,
} from "@/types/landing";
import HeroBlock from "./blocks/HeroBlock";
import FeaturesBlock from "./blocks/FeaturesBlock";
import ProblemBlock from "./blocks/ProblemBlock";
import HowItWorksBlock from "./blocks/HowItWorksBlock";
import CompetitorsBlock from "./blocks/CompetitorsBlock";
import CtaBlock from "./blocks/CtaBlock";

interface Props {
  data: LandingPageData;
}

export default function LandingRenderer({ data }: Props) {
  const { settings, blocks } = data;
  const accent = settings.accentColor;

  return (
    <div className="bg-white">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return (
              <HeroBlock
                key={block.id}
                content={block.content as HeroContent}
                accentColor={accent}
              />
            );
          case "features":
            return (
              <FeaturesBlock
                key={block.id}
                content={block.content as FeaturesContent}
                accentColor={accent}
              />
            );
          case "problem":
            return (
              <ProblemBlock
                key={block.id}
                content={block.content as ProblemContent}
              />
            );
          case "how_it_works":
            return (
              <HowItWorksBlock
                key={block.id}
                content={block.content as HowItWorksContent}
                accentColor={accent}
              />
            );
          case "competitors":
            return (
              <CompetitorsBlock
                key={block.id}
                content={block.content as CompetitorsContent}
                accentColor={accent}
              />
            );
          case "cta":
            return (
              <CtaBlock
                key={block.id}
                content={block.content as CtaContent}
                accentColor={accent}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
