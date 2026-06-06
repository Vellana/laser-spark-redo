import { Helmet } from "react-helmet-async";

const MedicalSpaSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalSpa",
    "@id": "https://virginialaserspecialists.com/#medicalspa",
    "name": "Virginia Laser Specialists",
    "url": "https://virginialaserspecialists.com",
    "telephone": "+17037526608",
    "image": "https://virginialaserspecialists.com/favicon.png",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8100 Boone Blvd, Suite 270",
      "addressLocality": "Vienna",
      "addressRegion": "VA",
      "postalCode": "22182",
      "addressCountry": "US"
    },
    "areaServed": [
      { "@type": "City", "name": "Tysons" },
      { "@type": "City", "name": "Vienna" },
      { "@type": "City", "name": "McLean" },
      { "@type": "City", "name": "Falls Church" },
      { "@type": "City", "name": "Arlington" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Laser Treatment Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Laser Hair Removal (Clarity II)",
            "description": "Laser hair removal Vienna VA and laser hair removal Tysons Corner using the dual-wavelength Lutronic Clarity II laser. Safe for all skin types."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CoolPeel CO2 Laser Resurfacing",
            "description": "CoolPeel skin resurfacing Tysons with the Cartessa Tetra Pro CO2 laser for radiant, refreshed skin with minimal downtime."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "DEKA CO2 Laser Resurfacing",
            "description": "DEKA SmartXide fractional CO2 laser resurfacing for deeper skin rejuvenation, wrinkles, acne scars, and sun damage."
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default MedicalSpaSchema;
