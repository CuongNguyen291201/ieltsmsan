import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import { CreateTwoTone, HeadsetTwoTone, Launch, MenuBookTwoTone, RateReview, SettingsVoiceTwoTone } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { MouseEvent, PropsWithoutRef, useCallback, useMemo, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useDispatch, useSelector } from "react-redux";
import { _Topic } from "../../../custom-types";
import { setActiveCourseModalVisibleAction } from "../../../redux/actions/course.actions";
import { prepareGoToGameAction } from "../../../redux/actions/prepareGame.actions";
import { AppState } from "../../../redux/reducers";
import { showLoginModalAction } from "../../../sub_modules/common/redux/actions/userActions";
import { showToastifyWarning } from "../../../sub_modules/common/utils/toastify";
import { GAME_STATUS_PREPARE_CONTINUE, GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from "../../../sub_modules/game/src/gameConfig";
import { getScoreByBarem } from "../../../sub_modules/game/src/services/score.services";
import {
  EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY, SKILL_TYPE_LISTENING,
  SKILL_TYPE_READING,
  SKILL_TYPE_SPEAKING,
  SKILL_TYPE_WRITING
} from "../../../sub_modules/share/constraint";
import { StudyScore } from "../../../sub_modules/share/model/studyScore";
import { StudyScoreData } from "../../../sub_modules/share/model/studyScoreData";
import { SkillSettingInfo } from "../../../sub_modules/share/model/topicSetting";
import { UserInfo } from "../../../sub_modules/share/model/user";
import { getGameSlug } from "../../../utils";
import { apiGetLatestTopicStudyScoreData } from "../../../utils/apis/topicApi";
import { canPlayTopic } from "../../../utils/permission/topic.permission";
import MarkList from "./MarkList";

const SkillInfoItem = (props: PropsWithoutRef<{
  skillInfo: SkillSettingInfo;
  studyScoreData: StudyScoreData | null;
  topic: _Topic;
  studyScore: StudyScore;
}>) => {
  const { skillInfo, studyScore, studyScoreData, topic } = props;
  const userCourse = useSelector((state: AppState) => state.courseReducer.userCourse);
  const isJoinedCourse = useSelector((state: AppState) => state.courseReducer.isJoinedCourse);
  const currentCourse = useSelector((state: AppState) => state.courseReducer.currentCourse);
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const [listStudyScoreData, setListStudyScoreData] = useState<{ data: StudyScoreData[], isLoading: boolean }>({ data: [], isLoading: true });
  const [toolEl, setToolEl] = useState<HTMLElement | null>(null);
  const [openMarkList, setOpenMarkList] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { percent, gameButtonLabel } = useMemo(() => {
    let percent = 0;
    if (skillInfo.skill?.type === SKILL_TYPE_SPEAKING || skillInfo.skill?.type === SKILL_TYPE_WRITING) {
      percent = studyScoreData?.status === EXAM_SCORE_FINISH ? 100 : 0
    } else {
      percent = studyScoreData?.totalCardNum
        ? ((studyScoreData?.correctNum || 0 + studyScoreData?.incorrectNum || 0) / studyScoreData.totalCardNum) * 100
        : 0;
    }
    return {
      percent,
      gameButtonLabel: studyScoreData?.status === EXAM_SCORE_PLAY || studyScoreData?.status === EXAM_SCORE_PAUSE
        ? 'Làm tiếp'
        : (studyScoreData?.status === EXAM_SCORE_FINISH ? 'Xem lại' : 'Làm bài')
    }
  }, [studyScoreData]);

  const { icon, isQuizSkill, colorClass } = useMemo(() => {
    switch (skillInfo.skill?.type) {
      case SKILL_TYPE_LISTENING:
        return {
          icon: <HeadsetTwoTone className="skill-icon skill-icon-aqua" />,
          isQuizSkill: true,
          colorClass: '-aqua'
        }
      case SKILL_TYPE_READING:
        return {
          icon: <MenuBookTwoTone className="skill-icon skill-icon-green" />,
          isQuizSkill: true,
          colorClass: '-green'
        }
      case SKILL_TYPE_SPEAKING:
        return {
          icon: <SettingsVoiceTwoTone className="skill-icon skill-icon-pink" />,
          isQuizSkill: false,
          colorClass: '-pink'
        }
      case SKILL_TYPE_WRITING:
        return {
          icon: <CreateTwoTone className="skill-icon skill-icon-orange" />,
          isQuizSkill: false,
          colorClass: '-orange'
        }
      default:
        return {
          icon: <></>,
          isQuizSkill: true,
          colorClass: ''
        }
    }
  }, [skillInfo]);

  const playGame = useCallback((isReplay?: boolean) => () => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (!canPlayTopic({ topic, isJoinedCourse })) {
      enqueueSnackbar('Chưa tham gia khoá học', { variant: "warning" });
      return;
    }
    const prepareStatusGame = isReplay
      ? GAME_STATUS_PREPARE_PLAY
      : (
        studyScoreData?.status === EXAM_SCORE_PLAY || studyScoreData?.status === EXAM_SCORE_PAUSE
          ? GAME_STATUS_PREPARE_CONTINUE
          : (studyScoreData?.status === EXAM_SCORE_FINISH ? GAME_STATUS_PREPARE_REVIEW : GAME_STATUS_PREPARE_PLAY)
      );

    if ((prepareStatusGame === GAME_STATUS_PREPARE_PLAY || prepareStatusGame === GAME_STATUS_PREPARE_CONTINUE) && skillInfo.skill.type === SKILL_TYPE_SPEAKING) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .catch((err) => {
          enqueueSnackbar("Your microphone is not available!", { variant: "warning" });
          console.error('Microphone error: ', err);
          return;
        })
    }

    const _studyScore = new StudyScore(studyScore);
    _studyScore.studyScoreData = studyScoreData;
    dispatch(prepareGoToGameAction({
      statusGame: prepareStatusGame,
      studyScore: _studyScore,
      skillSettingInfo: skillInfo
    }));
    router.push(getGameSlug(topic._id));
  }, [currentUser, studyScoreData, userCourse]);

  const handleOpenTool = (e: MouseEvent<HTMLButtonElement>) => {
    setToolEl(e.currentTarget);
  }

  const handleCloseTool = () => {
    setToolEl(null);
  }

  const handleClickMarkItem = () => {
    apiGetLatestTopicStudyScoreData({ topicId: topic._id, skillId: skillInfo.skillId, status: EXAM_SCORE_FINISH })
      .then((list) => {
        setListStudyScoreData({ data: list, isLoading: false });
      })
      .then(() => {
        handleCloseTool();
        setOpenMarkList(true);
      })
  }

  const handleCloseMarkList = () => {
    setListStudyScoreData({ ...listStudyScoreData, data: [], isLoading: true });
    setOpenMarkList(false);
  }

  const renderMarkListDialog = () => (
    <Dialog
      open={!!openMarkList && !listStudyScoreData.isLoading}
      onClose={handleCloseMarkList}
      keepMounted
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        Giáo viên chấm điểm
      </DialogTitle>

      <DialogContent>
        <MarkList
          listStudyScoreData={listStudyScoreData.data}
          skillSettingInfo={skillInfo}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseMarkList}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {renderMarkListDialog()}
      <div className={`title title${colorClass}`}>{skillInfo.skill.name}</div>
      <div className="progress">
        <CircularProgressbar
          value={percent}
          strokeWidth={3}
          styles={buildStyles({
            strokeLinecap: "butt",
            textSize: "16px",
            pathTransitionDuration: 0.5,
            pathColor: `#58BF80`,
            textColor: "#f88",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7"
          })}
        />

        <div className="icon-results">
          {icon}
          <div className={`result result${colorClass}`}>
            {studyScoreData && studyScoreData.status === EXAM_SCORE_FINISH && studyScoreData.score >= 0
              ? (isQuizSkill
                ? getScoreByBarem({ correct: studyScoreData.correctNum, total: studyScoreData.totalCardNum, barem: topic.topicExercise.baremScore, ieltsSkill: skillInfo?.skill?.type === SKILL_TYPE_LISTENING ? 'listening' : 'reading' })
                : studyScoreData.score
              ) : ''}
          </div>
        </div>

      </div>
      <div className="game-button-groups">
        <div className="main-game-button">
          <Button
            className={`game-button game-button${colorClass}`}
            variant="contained"
            startIcon={studyScoreData?.status === EXAM_SCORE_FINISH ? <RateReview /> : <Launch />}
            onClick={playGame()}
          >
            {gameButtonLabel}
          </Button>
          {userCourse?.isTeacher && !isQuizSkill &&
            <>
              <Button
                className={`game-button-tool game-button-tool${colorClass}`}
                variant="outlined"
                style={{ minWidth: "30px", maxWidth: "30px" }}
                onClick={handleOpenTool}
              >
                ...
              </Button>
              <Menu
                anchorEl={toolEl}
                open={!!toolEl}
                onClose={handleCloseTool}
              >
                <MenuItem onClick={handleClickMarkItem}>Chấm điểm</MenuItem>
              </Menu>
            </>
          }
        </div>
        {(studyScoreData?.status === EXAM_SCORE_FINISH && studyScoreData?.studyTime < topic.topicExercise?.replay)
          && <Button
            className={`game-button game-button${colorClass}`}
            variant="contained"
            startIcon={<Launch />}
            onClick={playGame(true)}
          >
            Làm lại
          </Button>
        }
      </div>
    </>
  )
}

export default SkillInfoItem;
