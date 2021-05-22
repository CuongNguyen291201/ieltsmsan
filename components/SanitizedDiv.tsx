import DOMPurify from 'isomorphic-dompurify';
import { memo } from 'react';


const SanitizedDiv = (props: {
  className?: string;
  content?: string;
}) => {
  const { className = '', content = '' } = props;
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  );
};

export default memo(SanitizedDiv);
