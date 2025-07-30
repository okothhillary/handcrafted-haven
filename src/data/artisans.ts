// Centralized artisan data source
// This should be the single source of truth for all artisan data across the application

import { Artisan, ArtisanProfile } from '@/models/artisan';

// Complete artisan database - single source of truth
export const ARTISANS: Artisan[] = [
  {
    id: 1,
    name: "Maria Rodriguez",
    location: "Oaxaca, Mexico",
    specialties: ["Pottery", "Ceramics", "Traditional Crafts"],
    bio: "Maria has been crafting pottery for over 20 years using traditional techniques passed down through generations. Her work reflects the rich cultural heritage of Oaxaca while incorporating modern design elements.",
    experience: "20+ years",
    image: "/images/artisans/maria-rodriguez.jpg",
    featured: true,
    instagram: "@maria_pottery",
    website: "maria-ceramics.com",
    email: "maria@maria-ceramics.com",
    joinedDate: "2020-01-15",
    status: "featured"
  },
  {
    id: 2,
    name: "Sarah Chen",
    location: "Portland, Oregon, USA",
    specialties: ["Textiles", "Macrame", "Fiber Arts"],
    bio: "Sarah specializes in contemporary macrame and fiber arts. She combines traditional knotting techniques with modern design aesthetics to create unique wall hangings and home decor pieces.",
    experience: "8 years",
    image: "/images/artisans/sarah-chen.jpg",
    featured: true,
    instagram: "@sarah_fiber_art",
    email: "sarah@fiberartworks.com",
    joinedDate: "2021-03-20",
    status: "featured"
  },
  {
    id: 3,
    name: "James Wilson",
    location: "Vermont, USA",
    specialties: ["Woodworking", "Furniture", "Sustainable Crafts"],
    bio: "James is a master woodworker who creates functional art pieces from sustainably sourced hardwoods. Each piece showcases the natural beauty of wood grain while serving practical purposes.",
    experience: "15+ years",
    image: "/images/artisans/james-wilson.jpg",
    featured: true,
    website: "wilson-woodworks.com",
    email: "james@wilson-woodworks.com",
    phone: "+1-802-555-0123",
    joinedDate: "2019-11-08",
    status: "featured"
  },
  {
    id: 4,
    name: "Elena Popov",
    location: "Prague, Czech Republic",
    specialties: ["Jewelry", "Metalwork", "Wire Wrapping"],
    bio: "Elena creates intricate wire-wrapped jewelry using traditional European techniques. Her pieces often feature natural stones and crystals, each telling its own unique story.",
    experience: "12 years",
    image: "/images/artisans/elena-popov.jpg",
    featured: false,
    instagram: "@elena_wirework",
    email: "elena@wireworkjewelry.com",
    joinedDate: "2021-07-12",
    status: "active"
  },
  {
    id: 5,
    name: "Hiroshi Tanaka",
    location: "Kyoto, Japan",
    specialties: ["Ceramics", "Pottery", "Tea Ceremony Items"],
    bio: "Hiroshi is a master of traditional Japanese pottery techniques, specializing in tea ceremony items. His work embodies the principles of wabi-sabi and the beauty of imperfection.",
    experience: "25+ years",
    image: "/images/artisans/hiroshi-tanaka.jpg",
    featured: true,
    email: "hiroshi@kyoto-ceramics.jp",
    website: "kyoto-ceramics.jp",
    joinedDate: "2018-05-30",
    status: "featured"
  },
  {
    id: 6,
    name: "Amara Okonkwo",
    location: "Lagos, Nigeria",
    specialties: ["Textiles", "Weaving", "African Patterns"],
    bio: "Amara creates vibrant textile art inspired by traditional Nigerian patterns and colors. Her work celebrates African heritage while addressing contemporary themes through fabric.",
    experience: "10 years",
    image: "/images/artisans/amara-okonkwo.jpg",
    featured: false,
    instagram: "@amara_textiles",
    email: "amara@africanweaves.com",
    joinedDate: "2022-02-14",
    status: "active"
  },
  {
    id: 7,
    name: "Thomas Mueller",
    location: "Bavaria, Germany",
    specialties: ["Metalwork", "Blacksmithing", "Traditional Forging"],
    bio: "Thomas is a traditional blacksmith who creates functional art pieces using time-honored forging techniques passed down through generations. His work combines medieval craftsmanship with modern functionality.",
    experience: "18 years",
    image: "/images/artisans/thomas-mueller.jpg",
    featured: false,
    website: "mueller-forge.de",
    email: "thomas@mueller-forge.de",
    joinedDate: "2020-09-22",
    status: "active"
  },
  {
    id: 8,
    name: "Anna Kowalski",
    location: "Krakow, Poland",
    specialties: ["Jewelry", "Goldsmithing", "Traditional Polish Crafts"],
    bio: "Anna creates unique jewelry pieces in her studio, focusing on organic forms and traditional metalsmithing techniques. Her work often incorporates elements from Polish folk art traditions.",
    experience: "14 years",
    image: "/images/artisans/anna-kowalski.jpg",
    featured: false,
    instagram: "@anna_goldsmith",
    email: "anna@kowalski-jewelry.pl",
    joinedDate: "2021-01-18",
    status: "active"
  },
  {
    id: 9,
    name: "Lisa Johnson",
    location: "Edinburgh, Scotland",
    specialties: ["Textiles", "Knitting", "Nordic Patterns"],
    bio: "Lisa learned knitting from her grandmother and has been creating beautiful scarves and accessories for over a decade. Each piece features traditional Nordic patterns with a contemporary twist.",
    experience: "12 years",
    image: "/images/artisans/lisa-johnson.jpg",
    featured: false,
    website: "nordic-knits.co.uk",
    email: "lisa@nordic-knits.co.uk",
    joinedDate: "2021-11-05",
    status: "active"
  },
  {
    id: 10,
    name: "Lisa Martinez",
    location: "Santa Fe, New Mexico, USA",
    specialties: ["Textiles", "Weaving", "Southwestern Crafts"],
    bio: "Lisa creates beautiful woven textiles inspired by Southwestern traditions. Her work combines traditional Native American weaving techniques with contemporary design sensibilities.",
    experience: "16 years",
    image: "/images/artisans/lisa-martinez.jpg",
    featured: false,
    email: "lisa@southwest-weaves.com",
    joinedDate: "2019-08-12",
    status: "active"
  },
  {
    id: 11,
    name: "Fatima Al-Zahra",
    location: "Marrakech, Morocco",
    specialties: ["Textiles", "Embroidery", "Silk Work"],
    bio: "Fatima specializes in traditional Middle Eastern embroidery techniques, creating luxurious silk accessories with intricate patterns. Her work preserves ancient craft traditions while appealing to modern tastes.",
    experience: "20 years",
    image: "/images/artisans/fatima-al-zahra.jpg",
    featured: false,
    instagram: "@fatima_silks",
    email: "fatima@marrakech-silks.ma",
    joinedDate: "2020-04-10",
    status: "active"
  },
  {
    id: 12,
    name: "Emma Davis",
    location: "Seattle, Washington, USA",
    specialties: ["Glasswork", "Blown Glass", "Art Glass"],
    bio: "Emma has been creating beautiful glass art for over 15 years. Her studio specializes in contemporary blown glass pieces that blend traditional techniques with modern aesthetic sensibilities.",
    experience: "15 years",
    image: "/images/artisans/emma-davis.jpg",
    featured: false,
    email: "emma@davisglassworks.com",
    website: "davisglassworks.com",
    joinedDate: "2021-06-15",
    status: "active"
  },
  {
    id: 13,
    name: "Robert Brown",
    location: "Asheville, North Carolina, USA",
    specialties: ["Woodworking", "Sculpture", "Wood Carving"],
    bio: "Robert has been carving wood for over 30 years, creating sculptures that celebrate the natural beauty and grain of different wood species. His work ranges from functional art to purely decorative pieces.",
    experience: "30+ years",
    image: "/images/artisans/robert-brown.jpg",
    featured: false,
    email: "robert@brownwoodart.com",
    website: "brownwoodart.com",
    joinedDate: "2019-03-20",
    status: "active"
  }
];

// Extended artisan profiles with additional details
export const ARTISAN_PROFILES: ArtisanProfile[] = ARTISANS.map(artisan => ({
  ...artisan,
  story: `${artisan.bio} ${artisan.name} continues to innovate while honoring traditional techniques, creating pieces that bridge past and present.`,
  achievements: [
    "Featured in local craft exhibitions",
    "Recognized by traditional craft organizations",
    "Customer satisfaction rating above 4.8 stars"
  ],
  certifications: [
    "Traditional Craft Certification",
    "Sustainable Materials Certified"
  ],
  techniques: artisan.specialties,
  materials: artisan.specialties.includes("Pottery") || artisan.specialties.includes("Ceramics") 
    ? ["Clay", "Natural Glazes", "Ceramic Tools"]
    : artisan.specialties.includes("Textiles") || artisan.specialties.includes("Weaving")
    ? ["Natural Fibers", "Organic Cotton", "Silk", "Wool"]
    : artisan.specialties.includes("Woodworking")
    ? ["Hardwood", "Sustainable Timber", "Natural Finishes"]
    : artisan.specialties.includes("Jewelry") || artisan.specialties.includes("Metalwork")
    ? ["Silver", "Gold", "Natural Stones", "Wire"]
    : ["Various Craft Materials"],
  workspaceDescription: `${artisan.name}'s studio in ${artisan.location} is a creative space where traditional techniques meet modern innovation.`,
  shippingRegions: ["Worldwide", "North America", "Europe", "Asia"],
  customOrdersAccepted: true,
  responseTime: "Usually responds within 24 hours"
}));

// Utility functions for working with artisans
export const getArtisanById = (id: number): Artisan | undefined => {
  return ARTISANS.find(artisan => artisan.id === id);
};

export const getArtisanByName = (name: string): Artisan | undefined => {
  return ARTISANS.find(artisan => artisan.name === name);
};

export const getArtisansBySpecialty = (specialty: string): Artisan[] => {
  return ARTISANS.filter(artisan => 
    artisan.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
};

export const getFeaturedArtisans = (): Artisan[] => {
  return ARTISANS.filter(artisan => artisan.featured);
};

export const getActiveArtisans = (): Artisan[] => {
  return ARTISANS.filter(artisan => artisan.status === 'active' || artisan.status === 'featured');
};

export const getArtisansByLocation = (location: string): Artisan[] => {
  return ARTISANS.filter(artisan => 
    artisan.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const searchArtisans = (query: string): Artisan[] => {
  const lowercaseQuery = query.toLowerCase();
  return ARTISANS.filter(artisan =>
    artisan.name.toLowerCase().includes(lowercaseQuery) ||
    artisan.location.toLowerCase().includes(lowercaseQuery) ||
    artisan.bio.toLowerCase().includes(lowercaseQuery) ||
    artisan.specialties.some(specialty => specialty.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAllSpecialties = (): string[] => {
  const specialties = new Set<string>();
  ARTISANS.forEach(artisan => {
    artisan.specialties.forEach(specialty => specialties.add(specialty));
  });
  return Array.from(specialties).sort();
};

export const getArtisanProfile = (id: number): ArtisanProfile | undefined => {
  return ARTISAN_PROFILES.find(profile => profile.id === id);
};

// Function to get all artisans - for compatibility
export const getArtisans = (): Artisan[] => {
  return ARTISANS;
};

// Export for backward compatibility
export { ARTISANS as artisans };
