import { useDispatch, useSelector } from 'react-redux';
import { actDecrement, actIncrement, actSetValueAsync } from '../../redux/actions/demo.actions';
import { AppState } from '../../redux/reducers';
import './style.scss';

const Demo = () => {
  const value = useSelector((state: AppState) => state.demoReducer.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>{`Value: ${value}`}</div>
      <div className="btn-group">
        <div className="button" onClick={() => dispatch(actIncrement())}>Increment</div>
        <div className="button" onClick={() => dispatch(actDecrement())}>Decrement</div>
        <div className="button" onClick={() => dispatch(actSetValueAsync(1000))}>Set to 1000</div>
      </div>
    </div>
  )
}

export default Demo;
