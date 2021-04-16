import { PropsWithChildren } from 'react';
import './style.scss';

const GridTemplate2 = (props: PropsWithChildren<{}>) => {
  return (
    <div className="grid-template-2">
      {props.children}
    </div>
  )
}

export default GridTemplate2;
