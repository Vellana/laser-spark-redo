import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalBusiness", "LocalBusiness"],
        "@id": "https://virginialaserspecialists.com/#business",
        "name": "Virginia Laser Specialists",
        "alternateName": "VLS Tysons",
        "description": "Premier laser hair removal and CoolPeel CO₂ skin resurfacing clinic in Tysons, Vienna, McLean VA. Using advanced Lutronic Clarity II dual-wavelength laser and Cartessa Tetra Pro CO₂ technology. Safe for all skin types. Board-certified laser specialists.",
        "url": "https://virginialaserspecialists.com",
        "telephone": "+1-703-547-4499",
        "email": "info@virginialaserspecialists.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "8100 Boone Blvd, Suite 270",
          "addressLocality": "Vienna",
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
          {
            "@type": "City",
            "name": "Tysons",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Vienna",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "McLean",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Fairfax",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Falls Church",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Arlington",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Reston",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Great Falls",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Herndon",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Oakton",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Annandale",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          },
          {
            "@type": "City",
            "name": "Burke",
            "containedInPlace": { "@type": "State", "name": "Virginia" }
          }
        ],
        "priceRange": "$$",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Credit Card, Cherry Financing",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "156",
          "reviewCount": "127"
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
        "image": [
          "https://virginialaserspecialists.com/favicon.png"
        ],
        "logo": "https://virginialaserspecialists.com/favicon.png",
        "sameAs": [
          "https://www.instagram.com/virginialaserspecialists",
          "https://www.facebook.com/profile.php?id=61573588844302",
          "https://www.tiktok.com/@virginialaserspecialists",
          "https://www.linkedin.com/company/virginia-laser-specialists"
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
                "description": "Permanent hair reduction using the dual-wavelength Lutronic Clarity II laser with Alexandrite and Nd:YAG technology. Safe for all skin types with integrated cryogen cooling. Treats face, underarms, legs, arms, bikini, Brazilian, back, chest, and full body.",
                "provider": { "@id": "https://virginialaserspecialists.com/#business" },
                "areaServed": "Northern Virginia",
                "url": "https://virginialaserspecialists.com/laser-hair-removal",
                "offers": {
                  "@type": "AggregateOffer",
                  "lowPrice": "100",
                  "highPrice": "1850",
                  "priceCurrency": "USD"
                }
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "CoolPeel CO₂ Laser Resurfacing",
                "description": "Revolutionary CO₂ laser skin resurfacing with minimal downtime (1-3 days) using Cartessa Tetra Pro technology. Treats fine lines, wrinkles, sun damage, uneven skin texture, and large pores.",
                "provider": { "@id": "https://virginialaserspecialists.com/#business" },
                "areaServed": "Northern Virginia",
                "url": "https://virginialaserspecialists.com/coolpeel-co2-laser-tysons-va"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "DEKA Pulse CO₂ Laser Resurfacing",
                "description": "Deep CO₂ laser resurfacing for dramatic skin rejuvenation and collagen stimulation. Intensive treatment for significant aging concerns, deep wrinkles, acne scars, and severe sun damage.",
                "provider": { "@id": "https://virginialaserspecialists.com/#business" },
                "areaServed": "Northern Virginia",
                "url": "https://virginialaserspecialists.com/laser-skin-resurfacing"
              }
            }
          ]
        },
        "medicalSpecialty": {
          "@type": "MedicalSpecialty",
          "name": "Dermatology"
        },
        "knowsAbout": [
          "Laser Hair Removal",
          "CoolPeel CO2 Laser",
          "Skin Resurfacing",
          "Lutronic Clarity II",
          "Cartessa Tetra Pro",
          "DEKA Pulse",
          "Alexandrite Laser",
          "Nd:YAG Laser",
          "Laser Hair Removal Near Me",
          "CoolPeel Near Me",
          "Laser Skin Resurfacing Northern Virginia"
        ],
        "slogan": "Excellence in Laser Technology, Tailored to You"
      },
      {
        "@type": "WebSite",
        "@id": "https://virginialaserspecialists.com/#website",
        "url": "https://virginialaserspecialists.com",
        "name": "Virginia Laser Specialists",
        "description": "Premier laser hair removal and CoolPeel CO₂ skin resurfacing in Tysons, Vienna, McLean VA",
        "publisher": { "@id": "https://virginialaserspecialists.com/#business" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://virginialaserspecialists.com/?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-US"
      }
    ]
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
