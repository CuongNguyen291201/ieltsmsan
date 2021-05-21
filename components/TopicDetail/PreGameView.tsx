
import { useRouter } from 'next/router';
import { MutableRefObject, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { ROUTER_GAME } from '../../utils/router';
import PanelContainer from '../containers/PanelContainer';
import './pre-game.scss';
import { TopicInfoCommonView } from './TopicWidget';

const PreGameView = (props: { topic: any }) => {
  const { topic } = props;
  const mainGameViewPanel = useRef<HTMLDivElement>();
  // const [cardOption, setCardOption] = useState({ cards: [], loading: true });
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentTopic } = useSelector((state: AppState) => state.topicReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  function renderMath(mainView: MutableRefObject<HTMLDivElement>) {
    window['MathJax'].Hub.Config({ //config is undefined 
      jax: ["input/TeX", "output/SVG"],
      extensions: ["tex2jax.js"],
      showProcessingMessages: false,
      messageStyle: "none",
      showMathMenu: false,
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        processEscapes: true
      },
      TeX: { extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"] },
      SVG: { linebreaks: { automatic: true } },
      "HTML-CSS": { linebreaks: { automatic: true } }
    })
    window['MathJax'].Hub.Queue([
      "Typeset",
      window['MathJax'].Hub,
      mainGameViewPanel.current
    ], (_: any) => {
      // console.log('mathjax render succecss ')
    })
  }

  function playGame() {
    if (currentUser) {
      // if (isPermissionPlayGame(currentUserUpdate, category)) {
      router.push({
        pathname: ROUTER_GAME,
        query: { id: currentTopic._id }
      })
      // } else {
      // showToastifyWarning('Bạn hết thời gian học thử, vui lòng mua khoá học để học tiếp')
      // }
    } else {
      dispatch(showLoginModalAction(true))
    }
  }

  // useEffect(() => {
  //   const getCardByTopicId = async () => {
  //     // const cards = await getCardByTopicIdApi(topic._id, LIMIT)
  //     // setCardOption({ cards: cards, loading: false })
  //     if (window['MathJax']) {
  //       renderMath(mainGameViewPanel)
  //     } else {
  //       setTimeout(() => {
  //         renderMath(mainGameViewPanel)
  //       }, 1500)
  //     }
  //   }
  //   getCardByTopicId()
  // }, [])
  return (
    <div className="topic-test-view">
      <TopicInfoCommonView currentTopic={currentTopic} />
      <div className="pre-game-start" onClick={playGame}>
        <div className="start-game-btn">
          Làm bài
        </div>
      </div>
    </div>
  )
}

export default PreGameView;