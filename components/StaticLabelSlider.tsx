import { Mark, Slider, SliderProps } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { PropsWithoutRef } from "react";

const StaticLabelSlider = (props: PropsWithoutRef<SliderProps & {
  height?: number | string, valueLabelTopPosition?: number | string
}>) => {
  const { value, min, max, marks, height = "10px", valueLabelTopPosition, valueLabelFormat } = props;

  const _Slider = withStyles({
    root: {
      borderRadius: 0,
      height,
      padding: 0
    },
    rail: {
      height
    },
    track: {
      height,
      backgroundColor: "#26C048"
    },
    mark: {
      height: 0
    },
    markLabel: {
      color: "#000",
      fontWeight: "bold",
    },
    valueLabel: {
      // left: "calc(-50% - 10px)"
      backgroundColor: "#26C048",
      borderRadius: "12px",
      width: "38px",
      top: valueLabelTopPosition
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
  })(Slider);

  return <_Slider
    value={value}
    valueLabelDisplay="on"
    max={max}
    min={min}
    marks={marks}
    valueLabelFormat={valueLabelFormat}
    disabled
  />
}

export default StaticLabelSlider;
