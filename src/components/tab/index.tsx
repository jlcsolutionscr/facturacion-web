import React from "react";

import IconButton from "@mui/material/IconButton";

import { DeleteIcon } from "utils/iconsHelper";
import { createStyle } from "./styles";

function Tab({ title, edit, close }) {
  const classes = createStyle();
  const onButtonClick = (e) => {
    e.stopPropagation();
    close();
  };
  return (
    <div className={classes.container} onClick={edit}>
      <div className={classes.title}>
        <span>{title}</span>
      </div>
      <div className={classes.actions}>
        <IconButton
          className={classes.icon}
          component="span"
          onClick={onButtonClick}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Tab;
