import { PropsWithChildren } from 'react';
import './style.scss';

const Container2 = (props: PropsWithChildren<{ title?: string }>) => {
  const { title, children } = props;
  return (
    <div className="container-2">
      <div className="cont-header">
        {title ?? ''}
      </div>
      {children}
    </div>
  );
}

export default Container2;
