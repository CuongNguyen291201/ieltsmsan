import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import bookmarkAnswerIcon from '../../public/icon/bookmark-answer-icon.svg';
import correctAnswerIcon from '../../public/icon/correct-answer-icon.svg';
import incorrectAnswerIcon from '../../public/icon/incorrect-answer-icon.svg';
import notAnswerIcon from '../../public/icon/not-answer-icon.svg';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NO_ANSWER, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { genUnitScore, getGameSlug } from '../../utils';
// TOPIC INFO COMMON VIEW
export const TopicInfoCommonView = (props: { currentTopic: any, studyScore?: StudyScore | null }) => {
  const { currentTopic, studyScore } = props;
  let questionsNum = 0;
  let pass = 0;
  let data: { title: string; number: any }[] = [];
  if (currentTopic) {
    questionsNum = currentTopic.topicExercise?.questionsNum ?? 0;
    pass = currentTopic.topicExercise?.pass ?? 0;
    if (currentTopic.type === TOPIC_TYPE_TEST) {
      const duration = currentTopic.topicExercise?.duration ?? 0;
      let pauseTimes: string | number = 0;
      let replay: string | number = 0;
      if (currentTopic.topicExercise) {
        pauseTimes = currentTopic.topicExercise.pauseTimes;
        replay = currentTopic.topicExercise.replay;
      }
      if (studyScore) {
        if (pauseTimes > 0 && studyScore.studyScoreData) {
          pauseTimes = studyScore.studyScoreData.pauseTimeNum + '/' + pauseTimes
        }
        if (replay && studyScore.studyScoreData) {
          replay = studyScore.studyScoreData.studyTime + '/' + replay
        }
      }
      data = [
        { title: 'Tổng số câu hỏi', number: questionsNum },
        { title: 'Điều kiện qua ', number: `${pass}${genUnitScore(currentTopic.topicExercise?.baremScore)}` },
        { title: 'Thời gian làm bài', number: `${duration}p` },
        { title: 'Số lần làm lại', number: replay },
        { title: 'Số lần tạm dừng', number: pauseTimes },
      ]
    } else {
      data = [
        { title: 'Tổng số câu hỏi', number: questionsNum },
        { title: 'Số câu ở mỗi lần luyện tập', number: currentTopic.topicExercise?.questionsPlayNum ?? 0 }
      ]
    }
  }

  return (
    <div className="section1">
      <div className="title">{currentTopic?.name}</div>
      <div className={`${currentTopic?.type != TOPIC_TYPE_TEST ? 'list-exercise' : ""} list`}>
        {data.map((e, index) => {
          return (
            <div className="list-item" key={index}>
              <div className="number">{e.number}</div>
              <div className="text">{e.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


// MY CARD DATA VIEW
function getNumCardBox(myCardData: MyCardData, currentTopic: Topic) {
  let cardCorrectArr: string[] = [];
  let cardIncorrectArr: string[] = [];
  let numCardNotAnswer = 0;
  let cardBookMark: string[] = []
  if (currentTopic?.topicExercise) {
    numCardNotAnswer = currentTopic.topicExercise.questionsNum;
  }
  if (myCardData) {
    const mapBoxNum: { [x: number]: string[] } = {};
    Object.keys(myCardData.boxCard).map((e: string) => {
      const boxNum = myCardData.boxCard[e] > 0 ? 1 : 0;
      mapBoxNum[boxNum] = [...mapBoxNum[boxNum] || [], e];
    });
    cardCorrectArr = mapBoxNum[1] ? mapBoxNum[1] : [];
    cardIncorrectArr = mapBoxNum[0] ? mapBoxNum[0] : [];
    numCardNotAnswer = numCardNotAnswer - cardCorrectArr.length - cardIncorrectArr.length;
    if (numCardNotAnswer < 0) {
      numCardNotAnswer = 0;
    }
    cardBookMark = myCardData.cardBookmarks ?? [];
  }
  return { cardCorrectArr, cardIncorrectArr, numCardNotAnswer, cardBookMark }
}

export const MyCardDataView = (props: { currentTopic: Topic; studyScore?: StudyScore | null, myCardData: MyCardData }) => {
  const { currentTopic, studyScore, myCardData } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { cardCorrectArr, cardIncorrectArr, numCardNotAnswer, cardBookMark } = getNumCardBox(myCardData, currentTopic);

  const onClick = (box: number) => {
    dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore, boxGame: box }));
    router.push(getGameSlug(currentTopic._id));
  }

  return (
    <>
      {
        myCardData && <div className="section3">
          <CardDataBoxView
            text="Câu trả lời sai"
            numCard={cardIncorrectArr.length}
            url={incorrectAnswerIcon}
            onClick={() => {
              if (cardIncorrectArr.length) {
                onClick(CARD_BOX_ANSWER_INCORRECT)
              } else {
                showToastifyWarning('Không có câu trả lời sai hiển thị')
              }
            }}
          />

          <CardDataBoxView
            text="Câu chưa trả lời"
            numCard={numCardNotAnswer}
            url={notAnswerIcon}
            onClick={() => {
              if (numCardNotAnswer) {
                onClick(CARD_BOX_NO_ANSWER)
              } else {
                showToastifyWarning('Không có câu chưa trả lời hiển thị')
              }
            }}
          />

          <CardDataBoxView
            text="Câu trả lời đúng"
            numCard={cardCorrectArr.length}
            url={correctAnswerIcon}
            onClick={() => {
              if (cardCorrectArr.length) {
                onClick(CARD_BOX_ANSWER_CORRECT)
              } else {
                showToastifyWarning('Không có câu trả lời đúng hiển thị')
              }
            }}
          />

          <CardDataBoxView
            text="Câu trả cân nhắc"
            numCard={cardBookMark.length}
            url={bookmarkAnswerIcon}
            onClick={() => {
              if (cardBookMark.length) {
                onClick(CARD_BOX_ANSWER_BOOKMARK)
              } else {
                showToastifyWarning('Không có câu cân nhắc hiển thị')
              }
            }}
          />
        </div>
      }
    </>
  )
}

// MY CARD BOX

const CardDataBoxSkeleton = () => (
  <>
    <div className="section3-box">
      <div className="head"><Skeleton /></div>
      <div className="content">
        <div className="image skeleton">
          <Skeleton />
        </div>
        <div className="sentence-wrap">
          <div className="sentence-number skeleton"><Skeleton /></div>
          <div className="sentence-text skeleton"><Skeleton /></div>
        </div>
      </div>
    </div>
  </>
)

const CardDataBoxView = (props: { text: string; numCard: number; url: string; onClick: () => any }) => (
  <>
    <div className="section3-box"
      onClick={() => props.onClick()}
    >
      <div className="head">{props.text}</div>
      <div className="content">
        <div className="image">
          <img src={props.url} alt="" />
        </div>
        <div className="sentence-wrap">
          <div className="sentence-number">{props.numCard}</div>
          <div className="sentence-text">câu</div>
        </div>
      </div>
    </div>
  </>
);

export const MyCardDataSkeleton = () => (
  <div className="section3">
    <CardDataBoxSkeleton />
    <CardDataBoxSkeleton />
    <CardDataBoxSkeleton />
    <CardDataBoxSkeleton />
  </div>
);

// STATIC SKILL
export const StatisticSkillSkeleton = () => <Skeleton height={200} />
