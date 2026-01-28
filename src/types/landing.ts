export interface AjtbdAnalysis {
  coreJob: string;
  bigJob: string;
  pointA: {
    problem: string;
    context: string;
    emotions: string;
  };
  pointB: {
    result: string;
    emotions: string;
  };
  valueProposition: string;
  competitors: string;
  barriers: string;
}

export interface LandingSettings {
  theme: "light" | "dark";
  accentColor: string;
  mood: "strict" | "minimal" | "friendly" | "creative";
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title: string;
  items: FeatureItem[];
}

export interface ProblemContent {
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksContent {
  title: string;
  steps: HowItWorksStep[];
}

export interface CompetitorItem {
  title: string;
  description: string;
}

export interface CompetitorsContent {
  title: string;
  items: CompetitorItem[];
}

export interface CtaContent {
  title: string;
  description: string;
  ctaText: string;
}

export interface LandingBlock {
  id: string;
  type: "hero" | "features" | "problem" | "how_it_works" | "competitors" | "cta";
  content:
    | HeroContent
    | FeaturesContent
    | ProblemContent
    | HowItWorksContent
    | CompetitorsContent
    | CtaContent;
}

export interface LandingPageData {
  settings: LandingSettings;
  blocks: LandingBlock[];
}
