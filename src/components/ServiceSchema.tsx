import { Helmet } from "react-helmet-async";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
}

const ServiceSchema = ({
  name,
  description,
  url,
  category = "MedicalProcedure",
  image = "https://virginialaserspecialists.com/favicon.png",
}: ServiceSchemaProps) => {
  const baseUrl = "https://virginialaserspecialists.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}${url}#service`,
    "name": name,
    "description": description,
    "url": `${baseUrl}${url}`,
    "category": category,
    "image": image,
    "provider": {
      "@type": ["MedicalBusiness", "LocalBusiness"],
      "@id": "https://virginialaserspecialists.com/#business",
      "name": "Virginia Laser Specialists",
      "telephone": "+1-703-752-6608",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "8100 Boone Blvd, Suite 270",
        "addressLocality": "Vienna",
        "addressRegion": "VA",
        "postalCode": "22182",
        "addressCountry": "US",
      },
    },
    "areaServed": {
      "@type": "Place",
      "name": "Northern Virginia",
      "containsPlace": [
        { "@type": "City", "name": "Tysons" },
        { "@type": "City", "name": "Vienna" },
        { "@type": "City", "name": "McLean" },
        { "@type": "City", "name": "Falls Church" },
        { "@type": "City", "name": "Arlington" },
        { "@type": "City", "name": "Fairfax" },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default ServiceSchema;
