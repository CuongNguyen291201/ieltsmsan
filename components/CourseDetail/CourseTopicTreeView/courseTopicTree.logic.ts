import { _Topic } from "../../../custom-types";
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../../sub_modules/share/constraint";
import { ITopic } from "../../../sub_modules/share/model/topic";

export const getTopicShortDescription = (topic: ITopic) => {
  if (topic.type === TOPIC_TYPE_TEST && topic.topicExercise?.contentType === EXAM_TYPE_IELTS) {
    return `[Bài thi IELTS] ${topic.topicExercise?.questionsNum ?? 0} câu hỏi`;
  } else if (topic.type === TOPIC_TYPE_TEST && topic.topicExercise?.contentType === EXAM_TYPE_TOEIC) {
    return `[Bài thi TOEIC] ${topic.topicExercise?.questionsNum ?? 0} câu hỏi / ${topic.topicExercise?.duration ?? 0} phút`;
  } else if (topic.type === TOPIC_TYPE_EXERCISE && topic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
    return `${topic.topicExercise?.questionsNum} từ`
  } else {
    if (topic.type === TOPIC_TYPE_LESSON) {
      // if (topic.videoUrl) {
      //   return `${topic.}`
      // } else {
      // TODO: return topic System Info
      return topic.shortDescription
      // }
    } else if (topic.type === TOPIC_TYPE_EXERCISE) {
      return `${topic.topicExercise?.questionsNum ?? 0} câu hỏi`
    } else if (topic.type === TOPIC_TYPE_TEST) {
      return `${topic.topicExercise?.questionsNum ?? 0} câu hỏi / ${topic.topicExercise?.duration ?? 0} phút`
    }
  }
}