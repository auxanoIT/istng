import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    name,
    shortName,
    description,
    phone,
    email,
    address,
    city,
    country,
    whatsappSales,
    whatsappSupport,
    hubspotMeetingUrl
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0].items[]{
    label,
    href,
    kind,
    description,
    children[]{
      label,
      href,
      description
    }
  }
`;

export const footerQuery = groq`
  *[_type == "footer"][0].columns[]{
    title,
    links[]{
      label,
      href,
      description
    }
  }
`;

export const marketingPageQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    description,
    "slug": slug.current,
    sections[]{...}
  }
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(title asc) {
    title,
    category,
    summary,
    description,
    positioning,
    outcome,
    heroLabel,
    highlights,
    capabilities,
    deliverables,
    industries,
    serviceMixId,
    navDescription,
    navImage,
    "slug": slug.current
  }
`;

export const serviceSlugsQuery = groq`
  *[_type == "service" && defined(slug.current)].slug.current
`;

export const serviceQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    title,
    category,
    summary,
    description,
    positioning,
    outcome,
    heroLabel,
    highlights,
    capabilities,
    deliverables,
    industries,
    serviceMixId,
    navDescription,
    navImage,
    "slug": slug.current
  }
`;

export const caseStudiesQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)] | order(title asc) {
    category, projectPeriod, clientDisplayName, imageCaption,
    solutionNarrative, specifications, evidenceNote, faqs, relatedServiceLinks,
    "gallery": gallery[]{"src": asset->url, alt, caption},
    textOnly,
    imageIsIllustrative,
    "updatedAt": _updatedAt,
    seo{metaTitle, metaDescription},
    title,
    client,
    industry,
    location,
    "image": select(
      defined(heroImage.asset) => {
        "src": heroImage.asset->url,
        "alt": coalesce(heroImage.alt, title)
      }
    ),
    summary,
    challenge,
    solution,
    result,
    metrics,
    relatedServices,
    published,
    featured,
    projectDate,
    outcome,
    quote,
    "slug": slug.current
  }
`;

export const caseStudySlugsQuery = groq`
  *[_type == "caseStudy" && published == true && defined(slug.current)].slug.current
`;

export const caseStudyQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    category, projectPeriod, clientDisplayName, imageCaption,
    solutionNarrative, specifications, evidenceNote, faqs, relatedServiceLinks,
    "gallery": gallery[]{"src": asset->url, alt, caption},
    textOnly,
    imageIsIllustrative,
    "updatedAt": _updatedAt,
    seo{metaTitle, metaDescription},
    title,
    client,
    industry,
    location,
    "image": select(
      defined(heroImage.asset) => {
        "src": heroImage.asset->url,
        "alt": coalesce(heroImage.alt, title)
      }
    ),
    summary,
    challenge,
    solution,
    result,
    metrics,
    relatedServices,
    published,
    featured,
    projectDate,
    outcome,
    quote,
    "slug": slug.current
  }
`;

const editorialFields = groq`{
    seo{metaTitle, metaDescription},
    "updatedAt": _updatedAt,
    title,
    "category": coalesce(category, "General"),
    entryKind,
    topic, isPillarGuide,
    "cluster": cluster->{title, "slug": slug.current, topic},
    relatedIndustries, relatedServices, "relatedReading": relatedReading[]-> { title, "slug": slug.current, "section": select(_type == "technicalGuide" => "guides", _type == "knowledgeEntry" => "knowledge-centre", "insights") },
    relatedService,
    publishedAt,
    readingTime,
    author,
    excerpt,
    "coverImage": select(
      defined(coverImage.asset) => {
        "src": coverImage.asset->url,
        "alt": coverImage.alt
      }
    ),
    "takeaways": coalesce(takeaways, []),
    "body": coalesce(body[]{
      _type == "string" => @,
      _type == "block" => {
        ...,
        children[]{...},
        markDefs[]{...}
      },
      _type == "blogPlainText" => {
        _type,
        text
      },
      _type == "blogHeading" => {
        _type,
        text,
        level,
        anchor
      },
      _type == "blogParagraph" => {
        _type,
        text
      },
      _type == "blogList" => {
        _type,
        style,
        items
      },
      _type == "blogCallout" => {
        _type,
        tone,
        title,
        text
      },
      _type == "blogQuote" => {
        _type,
        quote,
        attribution
      },
      _type == "blogTable" => {
        _type,
        caption,
        columns,
        rows[]{
          cells
        }
      },
      _type == "image" => {
        _type,
        _key,
        caption,
        "image": select(
          defined(asset) => {
            "src": asset->url,
            "alt": coalesce(alt, caption, "Blog image"),
            "width": asset->metadata.dimensions.width,
            "height": asset->metadata.dimensions.height
          }
        )
      },
      _type == "blogImageBlock" => {
        _type,
        caption,
        "image": {
          "src": image.asset->url,
          "alt": image.alt,
          "width": image.asset->metadata.dimensions.width,
          "height": image.asset->metadata.dimensions.height
        }
      }
    }, []),
    "slug": slug.current
  }`;
export const editorialIndexQuery = groq`*[_type == $type && defined(slug.current) && defined(title)] | order(publishedAt desc, _updatedAt desc) {title, "slug": slug.current, excerpt, "updatedAt": _updatedAt, "category": coalesce(category, "General"), entryKind, topic, isPillarGuide, "cluster": cluster->{title, "slug": slug.current, topic}, relatedService, relatedServices, publishedAt, author, readingTime, "coverImage": select(defined(coverImage.asset) => {"src":coverImage.asset->url,"alt":coalesce(coverImage.alt,title)})}`;
export const editorialArticleQuery = groq`*[_type == $type && slug.current == $slug][0]${editorialFields}`;
export const planningResourcesQuery = groq`*[_type == $type && defined(slug.current) && defined(title) && (_type == "resourceDownload" && pdf.asset->mimeType == "application/pdf")] | order(title asc) {title, "slug": slug.current, excerpt, seo{metaTitle, metaDescription}, "updatedAt": _updatedAt, relatedIndustries, relatedServices, "relatedReading": relatedReading[]-> { title, "slug": slug.current, "section": select(_type == "technicalGuide" => "guides", _type == "knowledgeEntry" => "knowledge-centre", "insights") }, instructions, "file": pdf.asset->{url, originalFilename, size, mimeType}}`;
export const planningResourceQuery = groq`*[_type == $type && slug.current == $slug && (_type == "resourceDownload" && pdf.asset->mimeType == "application/pdf")][0]{title, "slug": slug.current, excerpt, seo{metaTitle, metaDescription}, "updatedAt": _updatedAt, relatedIndustries, relatedServices, "relatedReading": relatedReading[]-> { title, "slug": slug.current, "section": select(_type == "technicalGuide" => "guides", _type == "knowledgeEntry" => "knowledge-centre", "insights") }, instructions, "file": pdf.asset->{url, originalFilename, size, mimeType}}`;
export const relatedResourceCardsQuery = groq`*[!(_id in path("drafts.**")) && !(_id in path("versions.**")) && defined(slug.current) && defined(title) && (_type in ["post","technicalGuide","knowledgeEntry"] || (_type == "resourceDownload" && pdf.asset->mimeType == "application/pdf")) && (($industry != "" && $industry in coalesce(relatedIndustries, [])) || ($service != "" && (count(relatedServices[@ in $serviceAliases]) > 0 || relatedService in $legacyServices)))] | order(publishedAt desc, _updatedAt desc)[0...6]{title, "slug": slug.current, excerpt, "image": {"src": coverImage.asset->url, "alt": coalesce(coverImage.alt, title)}, "section": select(_type == "technicalGuide" => "guides", _type == "knowledgeEntry" => "knowledge-centre", _type == "resourceDownload" => "downloads", "insights")}`;
export const resourceSitemapQuery = groq`*[!(_id in path("drafts.**")) && !(_id in path("versions.**")) && defined(slug.current) && defined(title) && (_type in ["post","technicalGuide","knowledgeEntry"] || (_type == "resourceDownload" && pdf.asset->mimeType == "application/pdf"))]{ title, topic, "cluster": cluster->{title, "slug": slug.current, topic}, relatedService, relatedServices, "slug":slug.current, "updatedAt":_updatedAt, "image":coverImage.asset->url, "images":array::compact([coverImage.asset->url, ...body[_type == "image"].asset->url, ...body[_type == "blogImageBlock"].image.asset->url]), "section": select(_type == "technicalGuide" => "guides", _type == "knowledgeEntry" => "knowledge-centre", _type == "resourceDownload" => "downloads", "insights") }`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    quote,
    name,
    role,
    company
  }
`;

export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    id,
    question,
    answer
  }
`;

export const estimatorConfigQuery = groq`
  *[_type == "estimatorConfig"][0]{
    companySizes,
    locationBands,
    supportTiers,
    cameraBands,
    networkScopes,
    complianceLevels,
    services,
    contingencyLow,
    contingencyHigh
  }
`;

export const careerOpeningsQuery = groq`
  *[_type == "careerOpening" && coalesce(isOpen, true) == true] | order(order asc, _createdAt desc) {
    title,
    location,
    employmentType,
    department,
    summary
  }
`;

export const insightClusterIndexQuery = groq`*[_type == "insightCluster" && topic == $topic && defined(title) && defined(slug.current)] | order(title asc){title, "slug": slug.current, topic, description}`;
export const insightClusterQuery = groq`*[_type == "insightCluster" && topic == $topic && slug.current == $slug][0]{title, "slug": slug.current, topic, description}`;
