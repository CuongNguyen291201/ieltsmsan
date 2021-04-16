import { memo, useMemo } from 'react';
import starFullIcon from '../../public/icon/star-full.png';
import starHalfIcon from '../../public/icon/star-half.png';
import starUnratedIcon from '../../public/icon/star-unrated.png';
import './style.scss';

const Ratings = (props: { point?: number; count?: number; }) => {
  const { point = 0, count = 5 } = props;
  const { starFull, starHalf, starUnrated } = useMemo(() => {
    const starFull = Math.floor(point);
    const starHalf = Number.isInteger(point) ? 0 : 1;
    return {
      starFull, starHalf, starUnrated: count - starFull - starHalf
    }
  }, [point]);
  return (
    <div className="rating">
      {
        Array.from(Array(starFull).keys()).map((i) => (
          <div key={i} className="star-full">
            <img src={starFullIcon} alt="" />
          </div>
        ))
      }
      {
        !!starHalf && <div className="star-half">
          <img src={starHalfIcon} alt="" />
        </div>
      }
      {
        Array.from(Array(starUnrated).keys()).map((i) => (
          <div key={i} className="star-unrated">
            <img src={starUnratedIcon} alt="" />
          </div>
        ))
      }
    </div>
  )
}

export default memo(Ratings);

