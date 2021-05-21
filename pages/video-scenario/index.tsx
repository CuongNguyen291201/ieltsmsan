import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { AppState } from '../../redux/reducers';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import ScenarioInfo from '../../sub_modules/share/model/scenarioInfo';
import scenario from './scenario.json';
const ScenarioGame = dynamic(import('../../sub_modules/scenario/src/components/ScenarioGame'), { ssr: false });

const VideoScenario = () => {
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const scenarioInfo = new ScenarioInfo(scenario);
  const isClient = typeof window !== 'undefined';

  return isClient ? (
    <Layout addMathJax={true}>
      <ScenarioGame currentUser={currentUser} scenarioInfo={scenarioInfo} />
    </Layout>
  ) : <></>;
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  } else {
    removeCookie(TOKEN);
  }
  return {
    props: {}
  };
});

export default VideoScenario;
