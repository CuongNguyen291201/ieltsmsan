import { PropsWithChildren } from 'react';
import './style.scss';

const PanelContainer = (props: PropsWithChildren<{ title: string; }>) => {
  const { title, children } = props;
  return (
    <div className="panel-container">
      <div className="wraper-panel-header">
        <div className="panel-header">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

export default PanelContainer;