import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setExamMapSkillTypeValuesAction } from "../../redux/actions/exam.action";
import { EXAM_TYPE_TOEIC, TOPIC_TYPE_TEST } from "../../sub_modules/share/constraint";
import Skill from "../../sub_modules/share/model/skill";
import Topic from "../../sub_modules/share/model/topic";
import { apiGetListSkills } from "../../utils/apis/skill";
import ExerciseInfoView from "./ExerciseInfoView";
import TestInfoView from "./TestInfoView";

const ExamTOEICView = (props: { topic: Topic }) => {
  const { topic } = props;
  const dispatch = useDispatch();
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    apiGetListSkills({ examType: EXAM_TYPE_TOEIC })
      .then((skills) => {
        dispatch(setExamMapSkillTypeValuesAction(skills));
        
        const flattenSkillsArray: Skill[] = [];
        skills.forEach((skill) => {
          flattenSkillsArray.push(skill, ...skill.childSkills);
        });
        setSkills(flattenSkillsArray);
      })
  }, []);

  return topic.type === TOPIC_TYPE_TEST
    ? <TestInfoView topic={topic} toeicStats skills={skills} />
    : <ExerciseInfoView topic={topic} />
}

export default ExamTOEICView;