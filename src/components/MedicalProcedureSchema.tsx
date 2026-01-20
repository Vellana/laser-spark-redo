import { Helmet } from "react-helmet-async";

interface MedicalProcedureSchemaProps {
  name: string;
  description: string;
  procedureType?: string;
  bodyLocation?: string;
  preparation?: string;
  followup?: string;
  howPerformed?: string;
  outcome?: string;
  url: string;
}

const MedicalProcedureSchema = ({
  name,
  description,
  procedureType = "NoninvasiveProcedure",
  bodyLocation,
  preparation,
  followup,
  howPerformed,
  outcome,
  url
}: MedicalProcedureSchemaProps) => {
  const baseUrl = "https://virginialaserspecialists.com";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${baseUrl}${url}#procedure`,
    "name": name,
    "procedureType": procedureType,
    "description": description,
    ...(bodyLocation && { "bodyLocation": bodyLocation }),
    ...(preparation && { "preparation": preparation }),
    ...(followup && { "followup": followup }),
    ...(howPerformed && { "howPerformed": howPerformed }),
    ...(outcome && { "outcome": outcome }),
    "status": "Available",
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://virginialaserspecialists.com/#business",
      "name": "Virginia Laser Specialists",
      "telephone": "703-547-4499",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "8100 Boone Blvd, Suite 270",
        "addressLocality": "Vienna",
        "addressRegion": "VA",
        "postalCode": "22182",
        "addressCountry": "US"
      }
    },
    "relevantSpecialty": {
      "@type": "MedicalSpecialty",
      "name": "Dermatology"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "127"
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

export default MedicalProcedureSchema;
