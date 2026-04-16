import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import ProductCard from "components/ProductCard";
import { getProductList } from "state/product/reducer";
import { addDetails } from "state/working-order/asyncActions";
import { TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(() => ({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#d0ccd0",
    padding: "20px",
    width: "calc(100% - 40px)",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      padding: "15px",
      width: "calc(100% - 30px)",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
      width: "calc(100% - 20px)",
    },
    "@media screen and (max-width:429px)": {
      padding: "10px 5px 5px 5px",
      width: "calc(100% - 10px)",
    },
  },
  content: {
    display: "flex",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    padding: "0 5px",
  },
}));

interface StepOneScreenProps {
  index: number;
  value: number;
  className?: string;
}

export default function StepOneScreen({ index, value, className }: StepOneScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const myRef = useRef<HTMLDivElement>(null);

  const productList = useSelector(getProductList);
  //const productListPage = useSelector(getProductListPage);
  //const productListCount = useSelector(getProductListCount);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  const rows = productList.map(row => (
    <Grid item key={row.Id} xs={6} sm={4} md={3} justifyItems="center">
      <ProductCard
        description={row.Descripcion}
        price={row.PrecioVenta1}
        image={row.Imagen}
        action={() => dispatch(addDetails({ id: row.Id }))}
      />
    </Grid>
  ));

  const display = value !== index ? "none" : "flex";

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} style={{ display: display }}>
      <div className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center">
          {rows}
        </Grid>
      </div>
    </div>
  );
}
