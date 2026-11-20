import { createElement } from "react";
import { galleryAlbum } from "./gallery-album";
import { serviceResourceClusters } from "../../data/service-resource-clusters";
import { insightTopics } from "../../data/insight-topics";
import { resourceIndustryOptions, resourceServiceOptions } from "../../data/resource-relationships";
import {
  PortableTextInput,
  defineArrayMember,
  defineField,
  defineType,
  type ArrayOfObjectsInputProps,
  type OnPasteFn,
  type PortableTextInputProps,
} from "sanity";

const createKey = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

type PasteInsertBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

type PasteSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type PasteMarkDef = {
  _type: "link";
  _key: string;
  href: string;
};

const ignoredPasteElements = new Set(["SCRIPT", "STYLE", "META", "LINK"]);
const blockPasteElements = new Set([
  "ADDRESS",
  "ARTICLE",
  "ASIDE",
  "BLOCKQUOTE",
  "DIV",
  "FIGURE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "LI",
  "OL",
  "P",
  "SECTION",
  "TABLE",
  "UL",
]);

const handleBlogBodyPaste: OnPasteFn = ({ event }) => {
  const html = event.clipboardData?.getData("text/html");

  if (!html || typeof DOMParser === "undefined") {
    return undefined;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  if (!doc.querySelector("table")) {
    return undefined;
  }

  const insert = Array.from(doc.body.childNodes).flatMap(nodeToPasteBlocks);

  if (!insert.some((block) => block._type === "blogTable")) {
    return undefined;
  }

  return insert.length ? { insert } : undefined;
};

function nodeToPasteBlocks(node: ChildNode): PasteInsertBlock[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizePastedText(node.textContent ?? "");
    return text ? [createTextPasteBlock(text)] : [];
  }

  if (!isHtmlElement(node) || ignoredPasteElements.has(node.tagName)) {
    return [];
  }

  if (node.tagName === "TABLE") {
    const tableBlock = createTablePasteBlock(node as HTMLTableElement);
    return tableBlock ? [tableBlock] : [];
  }

  if (node.tagName === "UL" || node.tagName === "OL") {
    return listElementToPasteBlocks(node);
  }

  const headingStyle = getHeadingStyle(node.tagName);
  if (headingStyle) {
    const block = elementToTextPasteBlock(node, headingStyle);
    return block ? [block] : [];
  }

  if (node.tagName === "BLOCKQUOTE") {
    const block = elementToTextPasteBlock(node, "blockquote");
    return block ? [block] : [];
  }

  if (canUseElementAsTextBlock(node)) {
    const block = elementToTextPasteBlock(node, "normal");
    return block ? [block] : [];
  }

  return Array.from(node.childNodes).flatMap(nodeToPasteBlocks);
}

function createTablePasteBlock(
  table: HTMLTableElement,
): PasteInsertBlock | null {
  const parsedRows = Array.from(table.querySelectorAll("tr"))
    .map((row) => {
      const cells = Array.from(row.querySelectorAll("th,td")).map((cell) =>
        normalizePastedText(cell.textContent ?? ""),
      );

      return {
        cells,
        hasHeadingCell: Boolean(row.querySelector("th")),
      };
    })
    .filter((row) => row.cells.length > 0);

  if (!parsedRows.length) {
    return null;
  }

  const [firstRow, ...remainingRows] = parsedRows;
  const columnCount = Math.max(...parsedRows.map((row) => row.cells.length));
  const columns = firstRow.hasHeadingCell
    ? padCells(firstRow.cells, columnCount).map(
        (cell, index) => cell || `Column ${index + 1}`,
      )
    : Array.from({ length: columnCount }, (_, index) => `Column ${index + 1}`);
  const rows = firstRow.hasHeadingCell ? remainingRows : parsedRows;

  if (!columns.length || !rows.length) {
    return null;
  }

  return {
    _type: "blogTable",
    _key: createKey(),
    columns,
    rows: rows.map((row) => ({
      _type: "blogTableRow",
      _key: createKey(),
      cells: padCells(row.cells, columns.length),
    })),
  };
}

function listElementToPasteBlocks(element: HTMLElement): PasteInsertBlock[] {
  const listItem = element.tagName === "OL" ? "number" : "bullet";

  return Array.from(element.children).flatMap((child) => {
    if (child.tagName !== "LI") {
      return nodeToPasteBlocks(child);
    }

    const block = elementToTextPasteBlock(child as HTMLElement, "normal", {
      listItem,
      level: 1,
    });
    const nestedBlocks = Array.from(child.children)
      .filter((nestedChild) =>
        ["UL", "OL", "TABLE"].includes(nestedChild.tagName),
      )
      .flatMap((nestedChild) => nodeToPasteBlocks(nestedChild));

    return [block, ...nestedBlocks].filter((item): item is PasteInsertBlock =>
      Boolean(item),
    );
  });
}

function elementToTextPasteBlock(
  element: HTMLElement,
  style: "normal" | "h2" | "h3" | "h4" | "blockquote",
  options: Record<string, unknown> = {},
): PasteInsertBlock | null {
  const markDefs: PasteMarkDef[] = [];
  const children = trimSpans(
    Array.from(element.childNodes).flatMap((child) =>
      collectInlineSpans(child, [], markDefs),
    ),
  );

  if (!children.length) {
    return null;
  }

  const usedMarks = new Set(children.flatMap((child) => child.marks));

  return {
    _type: "block",
    _key: createKey(),
    style,
    markDefs: markDefs.filter((markDef) => usedMarks.has(markDef._key)),
    children,
    ...options,
  };
}

function createTextPasteBlock(text: string): PasteInsertBlock {
  return {
    _type: "block",
    _key: createKey(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: createKey(),
        text,
        marks: [],
      },
    ],
  };
}

function collectInlineSpans(
  node: ChildNode,
  activeMarks: string[],
  markDefs: PasteMarkDef[],
): PasteSpan[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? "").replace(/\s+/g, " ");

    return text.trim()
      ? [
          {
            _type: "span",
            _key: createKey(),
            text,
            marks: activeMarks,
          },
        ]
      : [];
  }

  if (!isHtmlElement(node) || ignoredPasteElements.has(node.tagName)) {
    return [];
  }

  if (node.tagName === "BR") {
    return [
      {
        _type: "span",
        _key: createKey(),
        text: "\n",
        marks: activeMarks,
      },
    ];
  }

  if (["TABLE", "UL", "OL"].includes(node.tagName)) {
    return [];
  }

  const nextMarks = [...activeMarks];

  if (["B", "STRONG"].includes(node.tagName)) {
    nextMarks.push("strong");
  }

  if (["EM", "I"].includes(node.tagName)) {
    nextMarks.push("em");
  }

  if (node.tagName === "U") {
    nextMarks.push("underline");
  }

  if (node.tagName === "CODE") {
    nextMarks.push("code");
  }

  if (node.tagName === "A") {
    const href = node.getAttribute("href");

    if (href) {
      const markKey = createKey();
      markDefs.push({
        _type: "link",
        _key: markKey,
        href,
      });
      nextMarks.push(markKey);
    }
  }

  return Array.from(node.childNodes).flatMap((child) =>
    collectInlineSpans(child, Array.from(new Set(nextMarks)), markDefs),
  );
}

function trimSpans(spans: PasteSpan[]) {
  const trimmedSpans = spans.filter((span) => span.text.length > 0);

  if (!trimmedSpans.length) {
    return [];
  }

  trimmedSpans[0] = {
    ...trimmedSpans[0],
    text: trimmedSpans[0].text.trimStart(),
  };
  const lastIndex = trimmedSpans.length - 1;
  trimmedSpans[lastIndex] = {
    ...trimmedSpans[lastIndex],
    text: trimmedSpans[lastIndex].text.trimEnd(),
  };

  return trimmedSpans.filter((span) => span.text.length > 0);
}

function canUseElementAsTextBlock(element: HTMLElement) {
  if (
    ["P", "DIV", "SECTION", "ARTICLE", "ASIDE", "FIGURE", "LI"].includes(
      element.tagName,
    )
  ) {
    return !Array.from(element.children).some((child) =>
      blockPasteElements.has(child.tagName),
    );
  }

  return false;
}

function getHeadingStyle(tagName: string) {
  if (tagName === "H2" || tagName === "H1") {
    return "h2";
  }

  if (tagName === "H3") {
    return "h3";
  }

  if (["H4", "H5", "H6"].includes(tagName)) {
    return "h4";
  }

  return null;
}

function padCells(cells: string[], length: number) {
  return Array.from({ length }, (_, index) => cells[index] ?? "");
}

function normalizePastedText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function isHtmlElement(node: ChildNode): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

function BlogBodyInput(props: ArrayOfObjectsInputProps) {
  return createElement(PortableTextInput, {
    ...(props as unknown as PortableTextInputProps),
    onPaste: handleBlogBodyPaste,
  });
}

const metric = defineType({
  name: "metric",
  title: "Metric",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "string" }),
  ],
});

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
    }),
    defineField({
      name: "canonicalPath",
      title: "Canonical Path",
      type: "string",
    }),
  ],
});

const blogHeading = defineType({
  name: "blogHeading",
  title: "Heading",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "number",
      options: { list: [2, 3] },
      initialValue: 2,
    }),
    defineField({
      name: "anchor",
      title: "Anchor ID",
      type: "string",
      description:
        "Optional. Use lowercase words with hyphens, for example: planning-the-system",
    }),
  ],
  preview: {
    select: {
      title: "text",
    },
    prepare: ({ title }) => ({ title, subtitle: "Heading" }),
  },
});

const blogParagraph = defineType({
  name: "blogParagraph",
  title: "Paragraph",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "text",
    },
    prepare: ({ title }) => ({ title, subtitle: "Paragraph" }),
  },
});

const blogPlainText = defineType({
  name: "blogPlainText",
  title: "Plain Paragraph",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "text",
    },
    prepare: ({ title }) => ({ title, subtitle: "Plain paragraph" }),
  },
});

const blogImageBlock = defineType({
  name: "blogImageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
    },
    prepare: ({ title, media }) => ({
      title: title || "Image",
      subtitle: "Image block",
      media,
    }),
  },
});

const blogList = defineType({
  name: "blogList",
  title: "List",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "List Style",
      type: "string",
      options: {
        list: [
          { title: "Bullet list", value: "bullet" },
          { title: "Numbered list", value: "number" },
        ],
        layout: "radio",
      },
      initialValue: "bullet",
    }),
    defineField({
      name: "items",
      title: "List Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      style: "style",
      firstItem: "items.0",
    },
    prepare: ({ style, firstItem }) => ({
      title: firstItem || "List",
      subtitle: style === "number" ? "Numbered list" : "Bullet list",
    }),
  },
});

const blogCallout = defineType({
  name: "blogCallout",
  title: "Callout / Important Note",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Important", value: "important" },
          { title: "Warning", value: "warning" },
          { title: "Note", value: "note" },
          { title: "Tip", value: "tip" },
        ],
        layout: "radio",
      },
      initialValue: "important",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Example: Important, Note, Compliance reminder",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      text: "text",
      tone: "tone",
    },
    prepare: ({ title, text, tone }) => ({
      title: title || text || "Callout",
      subtitle: `Callout: ${tone || "important"}`,
    }),
  },
});

const blogQuote = defineType({
  name: "blogQuote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Optional source, person, or standard.",
    }),
  ],
  preview: {
    select: {
      title: "quote",
      subtitle: "attribution",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Quote",
      subtitle: subtitle || "Quote block",
    }),
  },
});

const blogTableRow = defineType({
  name: "blogTableRow",
  title: "Table Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      cells: "cells",
    },
    prepare: ({ cells }) => ({
      title: Array.isArray(cells) ? cells.join(" | ") : "Table row",
      subtitle: "Table row",
    }),
  },
});

const blogTable = defineType({
  name: "blogTable",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional short explanation shown above the table.",
    }),
    defineField({
      name: "columns",
      title: "Column Headings",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "blogTableRow" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "caption",
      columns: "columns",
    },
    prepare: ({ title, columns }) => ({
      title: title || "Table",
      subtitle: Array.isArray(columns) ? columns.join(" | ") : "Table",
    }),
  },
});

const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Studies",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Only explicitly approved case studies appear publicly.",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "projectDate", title: "Project Date", type: "date" }),
    defineField({ name: "projectPeriod", title: "Project month or period", type: "string", description: "Use the recorded month or period, without inventing a day. For example February 2026." }),
    defineField({ name: "category", title: "Project environment", type: "string", options: { list: ["Residential", "Commercial", "Institutional"] } }),
    defineField({ name: "clientDisplayName", title: "Public client label", type: "string", description: "Use a property or estate label when a homeowner should remain unnamed." }),
    defineField({
      name: "textOnly", title: "No Project Photography", type: "boolean",
      description: "Use the text-led layout when no approved project photos are available. Turn off after adding an approved case study image.",
      initialValue: false,
    }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({
      name: "imageIsIllustrative", title: "Illustrative Image", type: "boolean",
      description: "Enable when the image illustrates the project scope rather than showing the actual client site or installed equipment. Leave off for approved genuine project photos.",
      initialValue: false,
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "heroImage",
      title: "Case Study Image",
      type: "image",
      description:
        "Recommended: a wide operational image. The website keeps the layout stable even when this is empty.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe the image for accessibility and search engines.",
        }),
      ],
    }),
    defineField({ name: "imageCaption", title: "Image caption", type: "string", description: "State when a related portfolio installation illustrates the scope rather than showing this specific site." }),
    defineField({ name: "gallery", title: "Installation gallery", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" }), defineField({ name: "caption", title: "Caption", type: "string" })] })] }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "challenge", title: "Challenge", type: "text" }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "result", title: "Result", type: "text" }),
    defineField({ name: "solutionNarrative", title: "Solution narrative", type: "array", of: [defineArrayMember({ type: "text" })] }),
    defineField({ name: "specifications", title: "Installed equipment by site", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "site", title: "Site or installation", type: "string" }), defineField({ name: "inverter", title: "Inverter", type: "string" }), defineField({ name: "battery", title: "Battery", type: "string" }), defineField({ name: "solar", title: "Solar PV", type: "string" })] })] }),
    defineField({ name: "evidenceNote", title: "Record clarification", type: "text", description: "Explain any material ambiguity in the source, such as an unconfirmed battery unit." }),
    defineField({ name: "faqs", title: "Project questions and answers", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "question", title: "Question", type: "string" }), defineField({ name: "answer", title: "Answer", type: "text" })] })] }),
    defineField({ name: "relatedServiceLinks", title: "Related solution pages", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", title: "Link label", type: "string" }), defineField({ name: "href", title: "Website path", type: "string", validation: rule => rule.regex(/^\/(?!\/)/, { name: "local website path" }) })] })] }),
    defineField({ name: "outcome", title: "Outcome", type: "text" }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [defineArrayMember({ type: "metric" })],
    }),
    defineField({
      name: "relatedServices",
      title: "Related Services",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});

const resourceLinksFields = [
  defineField({
    name: "relatedIndustries",
    title: "Related Industries",
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: { list: resourceIndustryOptions },
    validation: rule => rule.unique(),
  }),
  defineField({
    name: "relatedServices",
    title: "Related Services",
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    options: { list: resourceServiceOptions.map(({ title, value, pillar }) => ({ title: `${title} — ${pillar}`, value })) },
    validation: rule => rule.unique(),
  }),
  defineField({
    name: "relatedReading",
    title: "Related Reading",
    description: "Link to a published article, technical guide or Knowledge Centre entry.",
    type: "array",
    of: [defineArrayMember({ type: "reference", to: [{ type: "post" }, { type: "technicalGuide" }, { type: "knowledgeEntry" }] })],
    validation: rule => rule.unique(),
  }),
];

const insightCluster = defineType({
  name: "insightCluster", title: "Topic Clusters", type: "document",
  fields: [
    defineField({ name: "title", title: "Topic Name", type: "string", description: "For example: Solar Battery Storage, Fibre Optic Cabling, or CCTV Planning.", validation: rule => rule.required() }),
    defineField({ name: "topic", title: "Main Service", type: "string", options: { list: insightTopics.map(({ title, slug }) => ({ title, value: slug })) }, validation: rule => rule.required().custom(value => insightTopics.some(topic => topic.slug === value) ? true : "Choose a current main service.") }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", options: { source: "title", maxLength: 90 }, description: "A short, specific address such as battery-storage. Set this before publishing and keep it stable.", validation: rule => rule.required().custom(value => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) ? true : "Use lowercase words separated by hyphens.") }),
    defineField({ name: "description", title: "Introduction", type: "text", rows: 3, description: "Explain the specific questions this topic helps readers answer. Its hub appears in navigation when it has published articles.", validation: rule => rule.required().min(30).max(260) }),
  ],
  preview: { select: { title: "title", topic: "topic" }, prepare: ({ title, topic }) => ({ title, subtitle: insightTopics.find(item => item.slug === topic)?.title ?? "Choose a main service" }) },
});

const post = defineType({
  name: "post",
  title: "Posts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required().custom((value, context) => context.document?._type === "post" && insightTopics.some(topic => topic.slug === value?.current) ? "This slug is reserved for a service topic hub. Use a specific article slug." : true),
    }),
    defineField({ name: "category", title: "Category", description: "Optional reader-facing label. The main service topic below controls the article hub.", type: "string" }),
    defineField({
      name: "topic", title: "Main Service Topic", type: "string",
      description: "Choose one Integrated Solutions service pillar. The article will appear in that topic hub after publication.",
      options: { list: insightTopics.map(({ title, slug }) => ({ title, value: slug })) },
      hidden: ({ document }) => document?._type !== "post",
      validation: rule => rule.custom((value, context) => context.document?._type !== "post" || (value && insightTopics.some(topic => topic.slug === value)) ? true : "Choose a main service topic."),
    }),
    defineField({
      name: "cluster", title: "Topic Cluster", type: "reference", to: [{ type: "insightCluster" }],
      description: "Optional: select a topic within the main service. Create new topics under Resources → Topic Clusters. Leave blank for a service-wide overview guide.",
      options: { filter: ({ document }) => ({ filter: "topic == $topic", params: { topic: document?.topic ?? "" } }) },
      hidden: ({ document }) => document?._type !== "post",
      validation: rule => rule.custom(async (value, context) => {
        if (context.document?._type !== "post" || !value?._ref) return true;
        if (!context.document.topic) return "Choose the main service topic first.";
        const cluster = await context.getClient({ apiVersion: "2026-04-02" }).fetch<{ topic?: string }>("*[_id in [$id, $draft]][0]{topic}", { id: value._ref, draft: `drafts.${value._ref}` });
        return cluster?.topic === context.document.topic ? true : "Choose a cluster belonging to the selected main service.";
      }),
    }),
    defineField({
      name: "isPillarGuide", title: "Main Guide for This Hub", type: "boolean", initialValue: false,
      description: "Feature this as the overview guide for its selected topic cluster, or for the whole service if no cluster is selected.",
      hidden: ({ document }) => document?._type !== "post",
    }),
    defineField({
      name: "relatedService",
      title: "Related Sub-Service",
      type: "string",
      description: "Optional: connect this article to one of Integrated Solutions Technology's current sub-services. The main service topic remains separate.",
      options: { list: serviceResourceClusters.map(({title,value,pillarTitle}) => ({title: `${title} — ${pillarTitle}`, value})) },
      validation: rule => rule.custom(value => !value || serviceResourceClusters.some(cluster => cluster.value === value) ? true : "Choose an existing sub-service."),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({ name: "readingTime", title: "Reading Time", type: "string" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text" }),
    defineField({
      name: "takeaways",
      title: "Takeaways",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description:
        "Write like a document editor. Use the toolbar for headings, lists, bold, italic, links, code, and block quotes. Drag or paste images directly into the body. Pasted tables are converted into table blocks automatically.",
      components: {
        input: BlogBodyInput,
      },
      of: [
        defineArrayMember({
          type: "block",
          title: "Rich Text",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description:
                "Recommended for accessibility and search engines. Use a short description of the image.",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
        defineArrayMember({ type: "blogCallout" }),
        defineArrayMember({ type: "blogTable" }),
        defineArrayMember({ type: "blogImageBlock" }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    ...resourceLinksFields,
  ],
});

const technicalGuide = defineType({
  ...post,
  name: "technicalGuide",
  title: "Technical Guides",
  fields: post.fields.filter(field => field.name !== "relatedService"),
});

const knowledgeEntry = defineType({
  ...post,
  name: "knowledgeEntry",
  title: "Knowledge Centre Entries",
  fields: [
    ...post.fields.slice(0, 2),
    defineField({
      name: "entryKind", title: "Entry Type", type: "string", initialValue: "faq",
      options: { list: [
        { title: "Frequently Asked Question", value: "faq" },
        { title: "Explainer", value: "explainer" },
        { title: "Glossary Term", value: "glossary" },
      ] },
      validation: rule => rule.required(),
    }),
    ...post.fields.slice(2).filter(field => field.name !== "relatedService"),
  ],
});

const resourceDownload = defineType({
  name: "resourceDownload", title: "Downloads & Checklists", type: "document",
  fields: [
    ...post.fields.slice(0, 2),
    defineField({ name: "excerpt", title: "Description", type: "text", rows: 3, validation: rule => rule.required() }),
    defineField({
      name: "pdf", title: "Downloadable PDF", type: "file", options: { accept: "application/pdf,.pdf" },
      validation: rule => rule.required().custom(value => !value?.asset?._ref || value.asset._ref.endsWith("-pdf") || "Upload a PDF file."),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    ...resourceLinksFields,
  ],
});

const careerOpening = defineType({
  name: "careerOpening",
  title: "Career Openings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "department", title: "Department", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      options: {
        list: ["Full Time", "Part Time", "Contract", "Internship", "Remote"],
      },
    }),
    defineField({
      name: "summary",
      title: "Role Summary",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "isOpen",
      title: "Open Position",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      employmentType: "employmentType",
    },
    prepare: ({ title, location, employmentType }) => ({
      title,
      subtitle: [location, employmentType].filter(Boolean).join(" | "),
    }),
  },
});


export const schemaTypes = [
  galleryAlbum,
  metric,
  seo,
  blogHeading,
  blogParagraph,
  blogPlainText,
  blogImageBlock,
  blogList,
  blogCallout,
  blogQuote,
  blogTableRow,
  blogTable,
  caseStudy,
  insightCluster,
  post,
  technicalGuide,
  knowledgeEntry,
  resourceDownload,
  careerOpening,
];
