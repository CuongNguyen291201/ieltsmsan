import { PropsWithChildren } from 'react';
import './style.scss';

const Container1 = (props: PropsWithChildren<{}>) => {
  return (
    <div className="container-1">
      {props.children}
    </div>
  )
}

export default Container1;