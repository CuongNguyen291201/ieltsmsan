import { Box, Grid, Paper, Slider } from "@mui/material";
import { makeStyles, withStyles }  from "@mui/styles"
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import { SKILL_TYPE_LISTENING, SKILL_TYPE_READING } from "../../sub_modules/share/constraint";

const useStyles = makeStyles((_) => ({
  toeicScorePanel: {
    padding: "16px"
  },
  toeicScoreLabelWrap: {
    display: "flex"
  },
  toeicScoreLabel: {
    backgroundColor: "#52af77",
    maxWidth: "120px",
    padding: "8px 16px",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  toeicScoreTotalPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  toeicScoreTotal: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "120px",
    border: "2px solid #000",
    borderRadius: "50%",
    fontSize: "24px",
    fontWeight: "bold"
  },
  toeicSkillCard: {
    border: "1px solid #52af77",
    borderLeft: "none",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    fontWeight: "bold"
  }
}))

const ExamTOEICResutls = () => {
  const { studyScore } = useSelector((state: AppState) => state.topicReducer);
  const classes = useStyles();
  const {
    listeningScore, readingScore,
    listeningCards, readingCards
  } = useMemo(() => {
    const statistics = studyScore?.studyScoreData?.statistics;
    return {
      listeningScore: (statistics?.mapSkillTypeScore || {})[SKILL_TYPE_LISTENING] ?? 5,
      readingScore: (statistics?.mapSkillTypeScore || {})[SKILL_TYPE_READING] ?? 5,
      listeningCards: (statistics?.mapSkillTypeCard || {})[SKILL_TYPE_LISTENING],
      readingCards: (statistics?.mapSkillTypeCard || {})[SKILL_TYPE_READING]
    }
  }, [studyScore]);

  const ScoreSlider = withStyles((_) => ({
    root: {
      marginTop: "50px"
    },
    rail: {
      height: "10px"
    },
    track: {
      height: "10px"
    },
    mark: {
      height: 0
    },
    markLabel: {
      color: "#000",
      fontWeight: "bold"
    },
    valueLabel: {
      left: "calc(-50% - 10px)"
    },
    disabled: {
      color: "#52af77"
    },
    thumb: {
      "&.Mui-disabled": {
        width: 0,
        height: 0
      }
    }
  }))(Slider);

  const renderScoreSlider = (args: { value: number }) => {
    const { value } = args;
    return <ScoreSlider
      value={value}
      valueLabelDisplay="on"
      max={495}
      min={5}
      marks={[
        { value: 5, label: <>5</> }, { value: 495, label: <>495</> }
      ]}
      disabled
    />
  }

  return <div id="toeic-results-view">
    <Grid container className="toeic-scores">
      <Grid item xs={12} sm={8}>
        <Grid container>
          <Grid item xs={12} component={Paper} variant="outlined" className={classes.toeicScorePanel}>
            <Box className={classes.toeicScoreLabelWrap}>
              <Box className={classes.toeicScoreLabel}>
                Listening
              </Box>
              <Box className={classes.toeicSkillCard}>
                {listeningCards?.correctNum ?? 0}/{listeningCards?.totalCardNum ?? 0}
              </Box>
            </Box>
            {renderScoreSlider({ value: listeningScore })}
          </Grid>

          <Grid item xs={12} component={Paper} variant="outlined" className={classes.toeicScorePanel}>
            <Box className={classes.toeicScoreLabelWrap}>
              <Box className={classes.toeicScoreLabel}>
                Reading
              </Box>
              <Box className={classes.toeicSkillCard}>
                {readingCards?.correctNum ?? 0}/{readingCards?.totalCardNum ?? 0}
              </Box>
            </Box>
            {renderScoreSlider({ value: readingScore })}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={4} component={Paper} variant="outlined" className={classes.toeicScoreTotalPanel}>
        <Box display="flex" flexDirection="column">
          <Box className={classes.toeicScoreLabel}>Total Score</Box>
          <Box className={classes.toeicScoreTotal}>
            {studyScore?.score ?? 0}
          </Box>
        </Box>
      </Grid>
    </Grid>
  </div>
}

export default ExamTOEICResutls;
