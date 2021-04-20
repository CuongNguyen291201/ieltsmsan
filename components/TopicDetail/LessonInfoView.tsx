const LessonInfoView = (props: { topic: any }) => {
  const { topic } = props;
  return (
    <div className="description" dangerouslySetInnerHTML={{ __html: topic.description }}>

    </div>
  );
}

export default LessonInfoView;
