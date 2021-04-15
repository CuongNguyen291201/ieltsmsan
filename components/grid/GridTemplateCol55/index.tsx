import { PropsWithChildren } from 'react';
import './style.scss';

const GridTemplateCol55 = (props: PropsWithChildren<{}>) => {
  return (
    <div className="grid-col-5-5">
      {props.children}
    </div>
  )
}

export default GridTemplateCol55;