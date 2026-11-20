import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./sanity/config";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "integrated-solutions-studio",
  title: "Integrated Solutions Technology",
  basePath: "/sanity",
  projectId: projectId || "placeholder",
  dataset,
  plugins: [structureTool({
    structure: (S) => S.list().title("Integrated Solutions Technology Content").items([
      S.listItem().id("resources").title("Resources").child(
        S.list().title("Resources").items([
          S.documentTypeListItem("post").title("Insights & Articles"),
          S.documentTypeListItem("insightCluster").title("Topic Clusters"),
          S.documentTypeListItem("technicalGuide").title("Technical Guides"),
          S.documentTypeListItem("knowledgeEntry").title("Knowledge Centre"),
          S.documentTypeListItem("resourceDownload").title("Downloads & Checklists"),
        ]),
      ),
      S.documentTypeListItem("caseStudy").title("Case Studies"),
      S.documentTypeListItem("galleryAlbum").title("Our Work / Photo Albums"),
      S.documentTypeListItem("careerOpening").title("Careers"),
    ]),
  })],
  schema: {
    types: schemaTypes,
  },
});
