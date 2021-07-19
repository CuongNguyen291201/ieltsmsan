import { ForwardedRef, forwardRef, memo } from 'react';
import './style.scss';

const Pagination = forwardRef((props: {
  total: number;
  active: number;
  start?: number;
  onClick: (page: number) => any;
}, ref: ForwardedRef<HTMLDivElement>) => {
  const { total, active, start = 1, onClick } = props;
  if (active > total || active < start) return (<>Error active number</>)
  return (
    <>
      {[...new Array(total)].map((_, i) => (
        <div
          key={i}
          className={`page-item${active === start + i ? ' active' : ''}`}
          onClick={(e) => onClick(Number(e.currentTarget.innerHTML))}
          ref={ref}
        >
          {i + start}
        </div>
      ))}
    </>
  )
});

export default memo(Pagination);