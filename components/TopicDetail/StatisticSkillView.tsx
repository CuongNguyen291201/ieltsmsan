import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import ChartBar from "../../sub_modules/common/components/chart/ChartBar";
import Skill from "../../sub_modules/share/model/skill";

const StatisticSkillView = (props: { skills: Skill[] }) => {
  const { skills } = props;
  const { studyScore } = useSelector((state: AppState) => state.topicReducer);
  const mapSkillValueCard = studyScore?.studyScoreData?.statistics?.mapSkillValueCard || {};
  const data = useMemo(() => {
    const _skills = skills
      .filter((skill) => typeof mapSkillValueCard[skill.value] !== 'undefined')
      .sort((a, b) => a.name.localeCompare(b.name));
    const labels: string[] = [];
    const dataCorrect: number[] = [];
    const dataIncorrect: number[] = [];
    _skills.forEach((skill) => {
      labels.push(skill.name);
      dataCorrect.push(mapSkillValueCard[skill.value].correctNum);
      dataIncorrect.push(mapSkillValueCard[skill.value].totalCardNum - mapSkillValueCard[skill.value].correctNum);
    })

    return {
      labels, dataCorrect, dataIncorrect
    };
  }, [studyScore, skills]);

  return <div id="statistic-skills-view" style={{ padding: "16px" }}>
    <Box textAlign="center">
      <Typography component="h3">THỐNG KÊ KỸ NĂNG</Typography>
    </Box>

    <ChartBar
      data={{
        labels: data.labels,
        datasets: [
          { label: 'Correct', data: data.dataCorrect, backgroundColor: 'rgb(54, 162, 235)' },
          { label: 'Incorrect', data: data.dataIncorrect, backgroundColor: 'rgb(255, 99, 132)' },
        ]
      }}
      height={undefined}
    />
  </div>
}

export default StatisticSkillView;
