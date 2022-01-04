import { useEffect, useState } from "react";
import slugify from 'slugify';

export type HeadingData = {
  id: string; title: string;
}

const getSlug = (content: string) => {
  if (content) {
    return slugify(content, {
      replacement: "-",
      remove: /[*+~.()?'"!:@/]/g,
      lower: true,
      strict: false,
      locale: "vi"
    });
  }
  return content;
}

const useHeadingsData = ({ enabled, rootElement }: { enabled: boolean; rootElement?: HTMLElement }) => {
  const [nestedHeadings, setNestedHeadings] = useState<Array<HeadingData & { items?: Array<HeadingData> }>>([]);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (enabled) {
      const root = rootElement || document;
      const headingElements = root.querySelectorAll("h2, h3");
      const nestedHeadings: Array<HeadingData & { items?: Array<HeadingData> }> = [];
      headingElements.forEach((heading) => {
        const title = heading.textContent;
        const id = getSlug(title);
        heading.id = id;

        if (heading.nodeName === "H2") {
          nestedHeadings.push({ id, title, items: [] });
        } else if (heading.nodeName === "H3") {
          nestedHeadings[nestedHeadings.length - 1]?.items?.push({ id, title });
        }
      });

      setNestedHeadings(nestedHeadings);
      setReady(true);
    }
  }, [enabled, rootElement]);

  return { nestedHeadings, isReady };
}

export default useHeadingsData;