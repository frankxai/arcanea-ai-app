import { HomeExperience } from "./home-experience";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Arcanea",
      url: "https://www.arcanea.ai",
      description:
        "A creative multiverse where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.arcanea.ai/library?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://www.arcanea.ai",
      logo: "https://www.arcanea.ai/icon",
      sameAs: ["https://github.com/frankxai"],
      description:
        "Creative multiverse for builders: chat with AI, build worlds, share creations, and turn imagination into products.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience />
    </>
  );
}
