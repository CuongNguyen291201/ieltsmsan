import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setExamMapSkillTypeValuesAction } from "../../redux/actions/exam.action";
import { EXAM_TYPE_TOEIC, TOPIC_TYPE_TEST } from "../../sub_modules/share/constraint";
import Topic from "../../sub_modules/share/model/topic";
import { apiGetListSkills } from "../../utils/apis/skill";
import ExerciseInfoView from "./ExerciseInfoView";
import TestInfoView from "./TestInfoView";

const ExamTOEICView = (props: { topic: Topic }) => {
  const { topic } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetListSkills({ examType: EXAM_TYPE_TOEIC })
      .then((skills) => {
        dispatch(setExamMapSkillTypeValuesAction(skills));
      })
  }, []);

  return topic.type === TOPIC_TYPE_TEST
    ? <TestInfoView topic={topic} />
    : <ExerciseInfoView topic={topic} />
}

export default ExamTOEICView;