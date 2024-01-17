import React from "react";
import TablePagination from "@mui/material/TablePagination";

import { useStyles } from "./styles";
import { TablePaginationActions } from "components/data-grid";

export type ListDropdownOnChangeEventType = React.ChangeEvent<HTMLInputElement>;

interface ListDropdownProps {
  page: number;
  rowsCount: number;
  rowsPerPage: number;
  rows: any[];
  label: string;
  value: string;
  disabled: boolean;
  onChange: (event: ListDropdownOnChangeEventType) => void;
  onPageChange: (page: number) => void;
  onItemSelected: (row: any) => void;
}

export default function ListDropdown({
  page,
  rowsCount,
  rowsPerPage,
  rows,
  label,
  value,
  disabled,
  onChange,
  onPageChange,
  onItemSelected,
}: ListDropdownProps) {
  const { classes } = useStyles();
  const [open, setOpen] = React.useState(false);

  const outsideClickHandler = () => {
    removeClickOutSide();
    setOpen(false);
  };

  const removeClickOutSide = () => {
    document.removeEventListener("click", outsideClickHandler);
  };

  const handleOnClick = (item: any) => {
    outsideClickHandler();
    onItemSelected(item);
  };

  const onFocus = () => {
    document.addEventListener("click", outsideClickHandler);
    !open && setOpen(true);
  };
  const listItems = rows.map((item, index) => (
    <div key={index} id={`${index}_id`} onClick={() => handleOnClick(item)}>
      <span key={index} className={`${classes.item} ${classes.font}`}>
        {item.Descripcion}
      </span>
    </div>
  ));
  return (
    <div id="main-container" tabIndex={1} className={classes.container} onClick={e => e.stopPropagation()}>
      <div id="input-container" className={classes.root}>
        <input
          disabled={disabled}
          id={`input-field-${label}`}
          className={`${classes.input} ${classes.font} ${open && classes.inputOutline}`}
          value={value}
          onClick={onFocus}
          onChange={onChange}
        />
        <label id="main-container" className={`${classes.label} ${classes.font} ${open && classes.labelOutline}`}>
          {label}
        </label>
      </div>
      <div id="items-container" className={classes.listContainer} style={{ display: open ? "block" : "none" }}>
        <div style={{ width: "100%", height: `${rowsPerPage * 32}px` }}>{listItems}</div>
        {rowsCount > rowsPerPage && (
          <div style={{ width: "100%" }}>
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={rowsCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_event, newPage) => onPageChange(newPage)}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
