import type { ComponentType } from "react";
import {
  CrmIcon,
  EmailIcon,
  PpcIcon,
  SeoIcon,
  SocialIcon,
} from "@/components/icons";

export type Service = {
  slug: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  copy: string;
  description: string;
  benefits: string[];
  idealFor: string[];
  rotate: string;
  radius: string;
  image: string;
};

export const services: Service[] = [
  {
    slug: "seo-content-marketing",
    icon: SeoIcon,
    title: "SEO & Content Marketing",
    copy: "Search-first content that ranks, earns trust, and keeps compounding organic pipeline long after it's published.",
    description:
      "Our comprehensive SEO and Content Marketing service is designed to elevate your online visibility and attract your ideal customers naturally. We conduct in-depth keyword research, optimize your website's technical aspects, and create compelling, valuable content that resonates with your target audience. From blog posts and articles to landing page copy, we ensure your brand ranks higher on search engines and establishes authority in your industry, driving sustainable lead growth.",
    benefits: [
      "Increased organic search rankings",
      "Higher website traffic",
      "Improved brand authority",
      "Sustainable lead generation",
      "Cost-effective long-term results",
    ],
    idealFor: [
      "Businesses seeking long-term, organic growth",
      "Companies looking to establish thought leadership",
      "Brands with complex products/services requiring educational content",
    ],
    rotate: "-rotate-2",
    radius: "rounded-[3rem_2rem_3rem_1.5rem]",
    image: "https://images.pexels.com/photos/13628541/pexels-photo-13628541.jpeg",
  },
  {
    slug: "paid-advertising",
    icon: PpcIcon,
    title: "Paid Advertising (PPC)",
    copy: "Search, social, and display spend engineered against payback period, not vanity clicks.",
    description:
      "Lead Frog Marketing specializes in creating and managing highly effective Paid Advertising (PPC) campaigns. We craft data-driven strategies for Google Ads, Facebook Ads, LinkedIn Ads, and other platforms to put your brand directly in front of your most valuable prospects. Our service includes audience targeting, ad copy creation, landing page optimization, continuous A/B testing, and detailed performance reporting to ensure maximum ROI and rapid lead acquisition.",
    benefits: [
      "Immediate traffic and lead generation",
      "Precise audience targeting",
      "Measurable ROI",
      "Flexible budget control",
      "Rapid market entry",
    ],
    idealFor: [
      "Businesses needing quick lead volume",
      "E-commerce stores",
      "Companies launching new products/services",
      "Brands with specific campaign goals",
    ],
    rotate: "rotate-1",
    radius: "rounded-[2rem_3rem_1.5rem_3rem]",
    image: "https://images.pexels.com/photos/8154349/pexels-photo-8154349.jpeg",
  },
  {
    slug: "social-media-marketing",
    icon: SocialIcon,
    title: "Social Media Marketing",
    copy: "Organic and paid social built to build the audience your sales team gets to close later.",
    description:
      "Our Social Media Marketing service goes beyond just posting. We develop tailored social media strategies that align with your business objectives, focusing on platforms where your target audience is most active. This includes content creation, community management, paid social campaigns, influencer collaborations, and performance analytics. We help you foster meaningful connections, drive website traffic, and generate qualified leads directly from your social channels.",
    benefits: [
      "Enhanced brand visibility",
      "Increased customer engagement",
      "Direct lead generation from social platforms",
      "Improved customer loyalty",
      "Real-time market insights",
    ],
    idealFor: [
      "Brands looking to connect with a younger demographic",
      "Businesses focused on community building",
      "Companies leveraging visual content",
      "B2C and B2B brands",
    ],
    rotate: "-rotate-1",
    radius: "rounded-[3rem_1.5rem_3rem_2rem]",
    image: "https://images.pexels.com/photos/15406294/pexels-photo-15406294.jpeg",
  },
  {
    slug: "email-marketing-automation",
    icon: EmailIcon,
    title: "Email Marketing Automation",
    copy: "Lifecycle flows that nurture, re-engage, and convert — running quietly in the background, every day.",
    description:
      "Transform your lead nurturing process with our Email Marketing Automation service. We design and implement sophisticated email sequences, from welcome series and abandoned cart reminders to re-engagement campaigns and promotional newsletters. Our approach focuses on segmentation, personalization, and A/B testing to ensure your messages resonate with recipients, build trust, and guide them through the sales funnel efficiently, turning prospects into paying customers.",
    benefits: [
      "Improved lead conversion rates",
      "Increased customer retention",
      "Personalized customer journeys",
      "Efficient communication at scale",
      "Measurable campaign performance",
    ],
    idealFor: [
      "Businesses with existing lead databases",
      "Companies seeking to improve customer lifecycle management",
      "E-commerce businesses",
      "Service providers with complex sales cycles",
    ],
    rotate: "rotate-2",
    radius: "rounded-[1.5rem_3rem_2rem_3rem]",
    image: "https://images.pexels.com/photos/7821760/pexels-photo-7821760.jpeg",
  },
  {
    slug: "lead-nurturing-crm",
    icon: CrmIcon,
    title: "Lead Nurturing & CRM Integration",
    copy: "Your CRM becomes the single source of truth, with scoring and hand-off rules that get leads to sales at the right moment.",
    description:
      "Our Lead Nurturing & CRM Integration service bridges the gap between marketing and sales. We help you define lead scoring models, create targeted nurturing paths, and ensure smooth data flow between your marketing automation platforms and CRM system. This service ensures that sales teams receive warm, qualified leads with comprehensive historical data, reducing sales cycles and increasing close rates. We focus on creating a cohesive strategy that maximizes the value of every lead.",
    benefits: [
      "Higher lead qualification",
      "Shorter sales cycles",
      "Improved sales team efficiency",
      "Better alignment between marketing and sales",
      "Comprehensive lead tracking",
    ],
    idealFor: [
      "B2B companies",
      "Businesses with long sales cycles",
      "Organizations looking to streamline their sales process",
      "Companies using or planning to use a CRM system",
    ],
    rotate: "-rotate-2",
    radius: "rounded-[3rem_2rem_1.5rem_3rem]",
    image: "https://images.pexels.com/photos/7709146/pexels-photo-7709146.jpeg",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
