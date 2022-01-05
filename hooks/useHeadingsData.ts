import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import slugify from 'slugify';
import HeadingData from "../custom-types/HeadingData";
import { setHeadingsDataAction } from "../redux/actions/content.action";

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

const useHeadingsData = ({ rootElement }: { rootElement?: HTMLElement }) => {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (!!rootElement) {
      const headingElements = rootElement.querySelectorAll("h2, h3");
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
      dispatch(setHeadingsDataAction(nestedHeadings))
    }
  }, [rootElement]);
}

export default useHeadingsData;