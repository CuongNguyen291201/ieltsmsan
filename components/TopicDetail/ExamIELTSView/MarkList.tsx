import { Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import { withStyles } from "@mui/styles"
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { prepareGoToGameAction } from "../../../redux/actions/prepareGame.actions";
import { formatTime } from "../../../sub_modules/common/utils/timeFormat";
import { GAME_STATUS_PREPARE_REVIEW } from "../../../sub_modules/game/src/gameConfig";
import { StudyScore } from "../../../sub_modules/share/model/studyScore";
import { StudyScoreData } from "../../../sub_modules/share/model/studyScoreData";
import { SkillSettingInfo } from "../../../sub_modules/share/model/topicSetting";
import { getGameSlug } from "../../../utils";

const MarkList = (props: PropsWithoutRef<{
  listStudyScoreData: StudyScoreData[];
  skillSettingInfo: SkillSettingInfo;
}>) => {
  const { listStudyScoreData, skillSettingInfo } = props;
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const _listStudyScoreData = useMemo(() => {
    return listStudyScoreData.filter((e) => tab === 0 ? e.score < 0 : e.score >= 0);
  }, [tab, listStudyScoreData]);

  const handleMark = (studyScoreData: StudyScoreData) => {
    const studyScore = new StudyScore(studyScoreData.studyScore);
    studyScore.studyScoreData = studyScoreData;
    dispatch(prepareGoToGameAction({
      statusGame: GAME_STATUS_PREPARE_REVIEW,
      skillSettingInfo,
      studyScore,
      userIdReview: studyScoreData.userInfo?._id ?? null,
      userNameReview: studyScoreData.userInfo?.name
    }));
    router.push(getGameSlug(studyScoreData.topicId));
  }

  const CTableCell = withStyles({
    root: {
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      hyphens: 'auto',
      padding: '12px'
    }
  })(TableCell);

  return (
    <div className="mark-view">
      <Tabs value={tab} centered variant="fullWidth" onChange={(_, newValue) => {
        setTab(newValue);
      }}>
        <Tab label="Chưa chấm" />
        <Tab label="Đã chấm" />
      </Tabs>

      <div className="mark-table">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <CTableCell align="center">STT</CTableCell>
                <CTableCell>Tài khoản</CTableCell>
                <CTableCell>Họ tên</CTableCell>
                <CTableCell>Thời gian nộp bài</CTableCell>
                <CTableCell>Điểm</CTableCell>
                <CTableCell align="center">Hành động</CTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {_listStudyScoreData.map((e, i) => (
                <TableRow key={i}>
                  <CTableCell align="center">{i + 1}</CTableCell>
                  <CTableCell>{e.userInfo?.account}</CTableCell>
                  <CTableCell>{e.userInfo?.name}</CTableCell>
                  <CTableCell>{formatTime(e.lastUpdate, "HH:mm:ss DD-MM-YYYY")}</CTableCell>
                  <CTableCell>{e.score >= 0 ? e.score : 'Chưa chấm'}</CTableCell>
                  <CTableCell align="center">
                    <Button variant="outlined"
                      onClick={() => {
                        handleMark(e)
                      }}
                    >
                      {e.score >= 0 ? 'Chấm lại' : 'Chấm bài'}
                    </Button>
                  </CTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  )
}

export default MarkList;
