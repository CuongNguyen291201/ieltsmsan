import { PropsWithChildren } from 'react';
import './style.scss'

const GridTemplate1 = (props: PropsWithChildren<{}>) => {
  return (
    <div className="grid-template-1">
      {props.children}
    </div>
  )
}

export default GridTemplate1;