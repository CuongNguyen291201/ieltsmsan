import { PropsWithChildren } from 'react';
import './style.scss';

const PanelContainer = (props: PropsWithChildren<{ title: string; }>) => {
  const { title, children } = props;
  return (
    <div className="panel-container">
      <div className="panel-header">
        {title}
      </div>
      {children}
    </div>
  );
}

export default PanelContainer;