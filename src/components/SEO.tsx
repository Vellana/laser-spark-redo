import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  type?: string;
  image?: string;
}

const SEO = ({ title, description, canonicalUrl, type = "website", image }: SEOProps) => {
  const baseUrl = "https://virginialaserspecialists.com";
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/6irTnypLT0T0JetI2hSqoSKB96W2/social-images/social-1769708068627-ChatGPT Image Jan 21, 2026, 02_17_14 PM.png";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Virginia Laser Specialists" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;
