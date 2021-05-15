import { memo } from 'react';
import './style.scss';

const LinkPagination = (props: {
  total?: number;
  currentPage?: number;
  totalPages?: number;
  startIndex?: number;
  endIndex?: number;
  onClick: (page: number) => any;
}) => {
  const { total = 0, startIndex = 0, endIndex = 0, currentPage = 1, totalPages = 1, onClick } = props;

  return (
    <div className="link-pagination">
      <div className="p-link">
        <i className="fas fa-angle-double-left" onClick={() => onClick(1)} />
      </div>

      <div className="p-link">
        <i className="fas fa-angle-left" onClick={() => {
          if (currentPage - 1 >= 1) onClick(currentPage - 1);
        }} />
      </div>

      <div className="page-info">
        {`${startIndex}-${endIndex} of ${total}`}
      </div>

      <div className="p-link">
        <i className="fas fa-angle-right" onClick={() => {
          if (currentPage + 1 <= totalPages) onClick(currentPage + 1);
        }} />
      </div>

      <div className="p-link">
        <i className="fas fa-angle-double-right" onClick={() => onClick(totalPages)} />
      </div>

    </div>
  )
};

export default memo(LinkPagination);
