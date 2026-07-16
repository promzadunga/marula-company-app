// App configuration - easily change branding here
export const siteConfig = {
  name: "Marula",
  description: "Mobile Solutions & Premium Marula Oil Products",
  tagline: "Quality Solutions for Your Business",
  website: "www.marulacompany.co.za",
  contact: {
    email: "sales@marulacompany.co.za",
    phone: "+27 (12) 885-1507",
    whatsapp: "27760124549", // WhatsApp number without + or spaces
  },
  locations: {
    limpopo: {
      name: "Limpopo Office",
      address: "47A Dihlabaneng, Ga-Mashegoana",
      city: "Sekhukhune",
      province: "Limpopo",
      postalCode: "1124",
    },
    gauteng: {
      name: "Gauteng Office",
      address: "Building 8, Central Office Park, 13 Esdoring St, Highveld Techno Park",
      city: "Centurion",
      province: "Gauteng",
      postalCode: "0169",
    },
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
      { name: "Freezers", slug: "freezers", value: "FREEZERS" },
      { name: "Toilets", slug: "toilets", value: "TOILETS" },
      { name: "Clinics", slug: "clinics", value: "CLINICS" },
      { name: "Trailers", slug: "trailers", value: "TRAILERS" },
      { name: "Cold Rooms", slug: "cold-rooms", value: "COLD_ROOMS" },
      { name: "Ice", slug: "ice", value: "ICE" },
      { name: "Insulated Panels", slug: "insulated-panels", value: "INSULATED_PANELS" },
      { name: "Steel Structures", slug: "steel-structures", value: "STEEL_STRUCTURES" },
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
