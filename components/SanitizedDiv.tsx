import DOMPurify from 'isomorphic-dompurify';
import { CSSProperties, memo, PropsWithoutRef } from 'react';


const SanitizedDiv = (props: PropsWithoutRef<{
  className?: string;
  content?: string;
  style?: CSSProperties
}>) => {
  const { className, content = '', style } = props;
  return (
    <div style={{ ...style }} {...{ className }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  );
};

export default memo(SanitizedDiv);
