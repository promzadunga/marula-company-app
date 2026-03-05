// App configuration - easily change branding here
export const siteConfig = {
  name: "Marula",
  description: "Mobile Solutions & Premium Marula Oil Products",
  tagline: "Quality Solutions for Your Business",
  contact: {
    email: "info@marula.co.za",
    phone: "+27 60 540 5426",
    whatsapp: "27605405426", // WhatsApp number without + or spaces
  },
  social: {
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

// Product categories for easy reference
export const categories = {
  MOBILE_SOLUTIONS: {
    name: "Mobile Solutions",
    slug: "mobile-solutions",
    subcategories: [
      { name: "Fridges", slug: "fridges", value: "FRIDGES" },
      { name: "Toilets", slug: "toilets", value: "TOILETS" },
      { name: "Clinics", slug: "clinics", value: "CLINICS" },
    ],
  },
  MARULA_OIL: {
    name: "Marula Oil",
    slug: "marula-oil",
    subcategories: [
      { name: "Retail (50ml - 500ml)", slug: "retail", value: "MARULA_OIL_RETAIL" },
      { name: "Wholesale (1L - 20L)", slug: "wholesale", value: "MARULA_OIL_WHOLESALE" },
      { name: "Bulk/Industrial", slug: "bulk", value: "MARULA_OIL_BULK" },
    ],
  },
};
