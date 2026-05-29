// FF Players Info API Constants

export const API_BASE_URL =
  "https://asia-south1-edm-fire-app.cloudfunctions.net/ff_players_info_v1";

export const VALID_REGIONS = [
  { value: "ind", label: "India (IND)" },
  { value: "br", label: "Brazil (BR)" },
  { value: "sg", label: "Singapore (SG)" },
  { value: "ru", label: "Russia (RU)" },
  { value: "id", label: "Indonesia (ID)" },
  { value: "tw", label: "Taiwan (TW)" },
  { value: "us", label: "United States (US)" },
  { value: "vn", label: "Vietnam (VN)" },
  { value: "th", label: "Thailand (TH)" },
  { value: "me", label: "Middle East (ME)" },
  { value: "pk", label: "Pakistan (PK)" },
  { value: "cis", label: "CIS" },
  { value: "bd", label: "Bangladesh (BD)" },
];

export interface PlanConfig {
  name: string;
  price: number;
  priceLabel: string;
  requestsPerMonth: string;
  rateLimit: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline";
}

export const PLANS: PlanConfig[] = [
  {
    name: "Free",
    price: 0,
    priceLabel: "₹0/mo",
    requestsPerMonth: "50",
    rateLimit: "5/min",
    features: [
      "50 requests/month",
      "5 req/min rate limit",
      "Basic player data",
      "Community support",
      "API key instant access",
    ],
    buttonText: "Get Free Key",
    buttonVariant: "outline",
  },
  {
    name: "Basic",
    price: 199,
    priceLabel: "₹199/mo",
    requestsPerMonth: "5,000",
    rateLimit: "30/min",
    features: [
      "5,000 requests/month",
      "30 req/min rate limit",
      "Full player data",
      "Priority support",
      "API key instant access",
    ],
    popular: true,
    buttonText: "Buy Now",
    buttonVariant: "default",
  },
  {
    name: "Pro",
    price: 599,
    priceLabel: "₹599/mo",
    requestsPerMonth: "50,000",
    rateLimit: "100/min",
    features: [
      "50,000 requests/month",
      "100 req/min rate limit",
      "Full player data",
      "Email support",
      "Advanced analytics",
    ],
    buttonText: "Buy Now",
    buttonVariant: "default",
  },
  {
    name: "Enterprise",
    price: 1999,
    priceLabel: "₹1,999/mo",
    requestsPerMonth: "Unlimited",
    rateLimit: "1,000/min",
    features: [
      "Unlimited requests",
      "1,000 req/min rate limit",
      "Full player data",
      "Dedicated support",
      "Custom SLA",
      "Webhook support",
    ],
    buttonText: "Contact Us",
    buttonVariant: "outline",
  },
];
