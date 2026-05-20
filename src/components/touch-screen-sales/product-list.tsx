import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Unstable_Grid2";

import ProductCard from "components/touch-screen-sales/product-card";
import { getCategoryList, getProductList } from "state/product/reducer";

interface ProductListProps {
  disabledAddProduct: boolean;
  addDetails: (value: number) => void;
  value?: number;
}

export default function ProductList({ disabledAddProduct, addDetails, value }: ProductListProps) {
  const [category, setCategory] = useState(-1);

  const myRef = useRef<HTMLDivElement>(null);

  const productList = useSelector(getProductList);
  const categoryList = useSelector(getCategoryList);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

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

  const categories = categoryList.map(category => (
    <Button sx={{ maxWidth: "150px" }} key={category.Id} onClick={() => setCategory(category.Id)}>
      <Typography variant="body2" noWrap>
        {category.Descripcion}
      </Typography>
    </Button>
  ));

  return (
    <Grid width="100%" container ref={myRef} justifyContent="center" spacing={1}>
      <Grid alignItems="center" maxWidth="100%" overflow="auto hidden">
        <ButtonGroup variant="contained" aria-label="Basic button group" sx={{ boxShadow: "none" }}>
          <Button onClick={() => setCategory(-1)}>TODOS</Button>
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
