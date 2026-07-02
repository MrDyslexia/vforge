import {
  BarChart3,
  Brain,
  Globe,
  Lock,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface PricingTier {
  name: string;
  price: string;
  yearlyPrice: string;
  features: string[];
  highlighted?: boolean;
}

export interface Stat {
  label: string;
  value: string;
}

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export const features: Feature[] = [
  {
    icon: BarChart3,
    title: "Real-Time Dashboards",
    description:
      "Live-updating dashboards that give you instant visibility into every metric that matters to your business.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Automated anomaly detection and predictive analytics that surface opportunities before they pass you by.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share dashboards, annotate charts, and set up alerts so your whole team stays aligned.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Ingest millions of events per second from anywhere in the world with sub-second query latency.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified, end-to-end encryption, and fine-grained RBAC controls.",
  },
  {
    icon: TrendingUp,
    title: "Custom Reports",
    description:
      "Drag-and-drop report builder with scheduled exports to PDF, CSV, and Slack.",
  },
];

export const stats: Stat[] = [
  { label: "Active Users", value: "10K+" },
  { label: "Events Processed", value: "2.3B" },
  { label: "Uptime SLA", value: "99.99%" },
  { label: "Integrations", value: "150+" },
];

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "VP of Product, GrowthLoop",
    avatar: "SC",
    quote:
      "Analytiq transformed how we understand user behavior. We went from weekly manual reports to real-time dashboards in days.",
  },
  {
    name: "Marcus Rivera",
    role: "CTO, Finova",
    avatar: "MR",
    quote:
      "The AI-powered anomaly detection caught a revenue-critical bug before our monitoring stack even blinked. Absolutely indispensable.",
  },
  {
    name: "Priya Patel",
    role: "Head of Data, ScaleUp",
    avatar: "PP",
    quote:
      "We evaluated a dozen analytics platforms. Analytiq won on query speed, ease of use, and the team collaboration features.",
  },
  {
    name: "James Okonkwo",
    role: "Engineering Lead, Tablr",
    avatar: "JO",
    quote:
      "The global ingestion pipeline handles our peak traffic without breaking a sweat. Six months in, zero downtime.",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    yearlyPrice: "$0",
    features: [
      "Up to 10K events/month",
      "1 dashboard",
      "7-day data retention",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    yearlyPrice: "$39",
    features: [
      "Up to 1M events/month",
      "Unlimited dashboards",
      "90-day data retention",
      "AI-powered insights",
      "Slack & email alerts",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    yearlyPrice: "$159",
    features: [
      "Unlimited events",
      "Custom retention",
      "SAML / SSO",
      "Dedicated instance",
      "Audit logs",
      "99.99% SLA",
      "24/7 phone support",
      "Custom integrations",
    ],
  },
];
