import { ForwardedRef, forwardRef, memo } from 'react';
import SearchIcon from '../../public/images/home/search-icon.png';
import './style.scss';

const SearchBox = forwardRef((
  props: {
    onClickSearch?: (...args: any[]) => any;
  },
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="search-box">
      <div className="icon" onClick={props.onClickSearch}>
        <img src={SearchIcon} alt="search-icon" />
      </div>
      <input className="input" type="text" placeholder="Tìm kiếm" ref={ref} />
    </div>
  )
})

export default memo(SearchBox);