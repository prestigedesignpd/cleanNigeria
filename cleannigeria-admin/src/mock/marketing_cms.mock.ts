export interface HeroImage {
  id: string;
  url: string;
  altText: string;
  order: number;
}

export interface LandingPageConfig {
  mainHeadline: string;
  subHeadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImages: HeroImage[];
}

export const mockLandingConfig: LandingPageConfig = {
  mainHeadline: "Smart Waste Management for a Cleaner Nigeria",
  subHeadline: "Join thousands of estates and businesses using CleanNigeria to manage collections, track fleet schedules, and maintain a sustainable environment.",
  primaryCtaText: "Get Started Now",
  primaryCtaLink: "/register",
  secondaryCtaText: "View Pricing Plans",
  secondaryCtaLink: "/pricing",
  heroImages: [
    {
      id: "IMG-001",
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop",
      altText: "Clean city street with recycling bins",
      order: 1
    },
    {
      id: "IMG-002",
      url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2070&auto=format&fit=crop",
      altText: "Waste management fleet truck",
      order: 2
    },
    {
      id: "IMG-003",
      url: "https://images.unsplash.com/photo-1516992654410-9309d4587e94?q=80&w=2070&auto=format&fit=crop",
      altText: "Community recycling effort",
      order: 3
    }
  ]
};
