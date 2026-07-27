import {
  BookOpen,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  HandHeart,
  Lightbulb,
  MessageCircleMore,
  Rocket,
  UsersRound,
} from "lucide-react";

export const navigation = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/ai", label: "AI guide" },
];

export const categories = [
  { name: "Scholarships", icon: GraduationCap, description: "Funding for your next chapter", color: "bg-amber-100 text-amber-700" },
  { name: "Jobs", icon: BriefcaseBusiness, description: "Remote roles and internships", color: "bg-blue-100 text-blue-700" },
  { name: "Learning", icon: BookOpen, description: "Free courses and resources", color: "bg-violet-100 text-violet-700" },
  { name: "Technology", icon: Code2, description: "Build useful digital skills", color: "bg-emerald-100 text-emerald-700" },
  { name: "Business", icon: Rocket, description: "Ideas, startups, and funding", color: "bg-rose-100 text-rose-700" },
  { name: "Community", icon: UsersRound, description: "Meet people who move you forward", color: "bg-orange-100 text-orange-700" },
  { name: "Volunteering", icon: HandHeart, description: "Create impact near and far", color: "bg-pink-100 text-pink-700" },
  { name: "Guides", icon: Lightbulb, description: "Practical answers for today", color: "bg-cyan-100 text-cyan-700" },
  { name: "Ask & help", icon: MessageCircleMore, description: "Get unstuck together", color: "bg-lime-100 text-lime-700" },
];

export type OpportunityPreview = {
  id: string;
  title: string;
  organization: string;
  type: "Scholarship" | "Job" | "Internship" | "Program";
  location: string;
  deadline: string;
  tags: string[];
  featured?: boolean;
};

export const featuredOpportunities: OpportunityPreview[] = [
  {
    id: "global-leaders",
    title: "Global Leaders Scholarship 2026",
    organization: "African Futures Foundation",
    type: "Scholarship",
    location: "Worldwide · Hybrid",
    deadline: "2026-09-15",
    tags: ["Undergraduate", "Fully funded"],
    featured: true,
  },
  {
    id: "product-intern",
    title: "Product Design Internship",
    organization: "Kigali Innovation City",
    type: "Internship",
    location: "Kigali, Rwanda · Hybrid",
    deadline: "2026-08-20",
    tags: ["Design", "Paid"],
  },
  {
    id: "remote-engineer",
    title: "Junior Frontend Engineer",
    organization: "Open Africa Studio",
    type: "Job",
    location: "Remote · Africa",
    deadline: "2026-08-12",
    tags: ["Technology", "Remote"],
  },
];

export const learningPaths = [
  { title: "Launch your tech career", lessons: 12, accent: "from-blue-600 to-cyan-400", icon: Code2 },
  { title: "Win your next scholarship", lessons: 8, accent: "from-violet-600 to-fuchsia-400", icon: GraduationCap },
  { title: "Build a thriving freelance practice", lessons: 10, accent: "from-rose-500 to-orange-400", icon: Rocket },
];
