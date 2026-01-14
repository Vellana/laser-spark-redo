import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://virginialaserspecialists.com",
    "name": "Virginia Laser Specialists",
    "description": "Premier laser hair removal and skin resurfacing treatments in Tysons, VA. Using advanced Lutronic Clarity II and Tetra Pro CO2 laser technology.",
    "url": "https://virginialaserspecialists.com",
    "telephone": "703-547-4499",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8230 Boone Blvd, Suite 320",
      "addressLocality": "Tysons",
      "addressRegion": "VA",
      "postalCode": "22182",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.9187,
      "longitude": -77.2311
    },
    "areaServed": [
      "Tysons, VA",
      "Vienna, VA",
      "Fairfax, VA",
      "McLean, VA",
      "Falls Church, VA",
      "Arlington, VA",
      "Reston, VA"
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "127"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "image": "https://virginialaserspecialists.com/favicon.png",
    "sameAs": [
      "https://www.instagram.com/virginialaserspecialists",
      "https://www.facebook.com/profile.php?id=61573588844302"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Laser Treatment Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Laser Hair Removal",
            "description": "Permanent hair reduction using the dual-wavelength Lutronic Clarity II laser, safe for all skin types."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CoolPeel CO₂ Laser Resurfacing",
            "description": "Revolutionary CO2 laser skin resurfacing with minimal downtime for smoother, rejuvenated skin using Cartessa Tetra Pro technology."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "DEKA Pulse Laser Resurfacing",
            "description": "Deep CO2 laser resurfacing for dramatic skin rejuvenation and collagen stimulation."
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
