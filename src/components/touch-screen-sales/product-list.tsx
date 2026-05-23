import { TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Unstable_Grid2";

import ProductCard from "components/touch-screen-sales/product-card";
import { getCategoryList, getTouchScreenProductList } from "state/product/reducer";
import { refreshTouchScreenProductList } from "state/working-order/asyncActions";
import { TRANSITION_ANIMATION } from "utils/constants";
import { RefreshIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  button: {
    padding: "5px 15px",
    backgroundColor: theme.palette.mode === "dark" ? "rgb(144, 202, 249)" : "#08415c",
    color: theme.palette.mode === "dark" ? "#000" : "rgba(255,255,255,0.85)",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.55)",
    transition: `background-color ${TRANSITION_ANIMATION}, color ${TRANSITION_ANIMATION}`,
    minWidth: "54px",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgb(66, 165, 245)" : "#27546c",
      boxShadow: "4px 4px 6px rgba(0,0,0,0.55)",
    },
    "&:disabled": {
      backgroundColor: theme.palette.mode === "dark" ? "rgb(144, 202, 249)" : "#08415c",
      color: theme.palette.mode === "dark" ? "#000" : "rgba(255,255,255,0.85)",
      opacity: theme.palette.mode === "dark" ? 0.5 : 0.7,
    },
  },
  icon: {
    path: {
      color: "#FFF",
    },
  },
}));

interface ProductListProps {
  disabledAddProduct: boolean;
  addDetails: (value: number) => void;
  value?: number;
}

export default function ProductList({ disabledAddProduct, addDetails, value }: ProductListProps) {
  const [category, setCategory] = useState(-1);
  const [filterText, setFilterText] = useState("");
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const myRef = useRef<HTMLDivElement>(null);

  const productList = useSelector(getTouchScreenProductList);
  const categoryList = useSelector(getCategoryList);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  const handleCateboryButtonClick = (id: number) => {
    setCategory(id);
    setFilterText("");
  };

  const rows = productList
    .filter(product => category === -1 || product.IdLinea === category)
    .map(row => (
      <Grid key={row.Id} height="fit-content">
        <ProductCard
          description={row.Descripcion}
          price={row.PrecioVenta1}
          image={row.Imagen}
          action={() => !disabledAddProduct && addDetails(row.Id)}
        />
      </Grid>
    ));

  const categories = categoryList
    .filter(category =>
      filterText !== "" ? category.Descripcion.toUpperCase().startsWith(filterText.toUpperCase()) : true
    )
    .map(category => (
      <Button sx={{ maxWidth: "150px" }} key={category.Id} onClick={() => handleCateboryButtonClick(category.Id)}>
        <Typography variant="body2" noWrap>
          {category.Descripcion}
        </Typography>
      </Button>
    ));

  return (
    <Grid width="100%" container ref={myRef} justifyContent="center" spacing={1}>
      <Grid alignItems="center" maxWidth="100%" overflow="auto hidden">
        <ButtonGroup
          variant="contained"
          aria-label="Category list button group"
          sx={{ boxShadow: "none", justifyContent: "start" }}
        >
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => dispatch(refreshTouchScreenProductList())}
          >
            <RefreshIcon className={classes.icon} />
          </Button>
          <TextField
            sx={{ width: "100px" }}
            label="Filtrar"
            value={filterText}
            onChange={event => setFilterText(event.target.value)}
          />
          <Button onClick={() => handleCateboryButtonClick(-1)}>TODOS</Button>
          {categories}
        </ButtonGroup>
      </Grid>
      <Grid
        width="100%"
        height="auto"
        maxHeight="calc(100% - 50px)"
        overflow="hidden auto"
        container
        spacing={{ xs: 0, sm: 0.5 }}
        justifyContent="center"
      >
        {rows}
      </Grid>
    </Grid>
  );
}
