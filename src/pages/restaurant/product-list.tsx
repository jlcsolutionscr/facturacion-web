import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Unstable_Grid2";

import ProductCard from "pages/restaurant/components/product-card";
import { getCategoryList, getProductList, getProductListCount } from "state/product/reducer";
import { addDetails, loadMoreProductsToList } from "state/working-order/asyncActions";

interface ProductListProps {
  value?: number;
}

export default function ProductList({ value }: ProductListProps) {
  const dispatch = useDispatch();

  const [category, setCategory] = useState(-1);

  const myRef = useRef<HTMLDivElement>(null);
  const loader = useRef(null);

  const productList = useSelector(getProductList);
  const productListCount = useSelector(getProductListCount);
  const categoryList = useSelector(getCategoryList);

  useEffect(() => {
    myRef.current?.scrollTo(0, 0);
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (productListCount > productList.length) dispatch(loadMoreProductsToList());
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [dispatch, productList.length, productListCount]);

  const rows = productList
    .filter(product => category === -1 || product.IdLinea === category)
    .map(row => (
      <Grid key={row.Id} height="fit-content">
        <ProductCard
          description={row.Descripcion}
          price={row.PrecioVenta1}
          image={row.Imagen}
          action={() => dispatch(addDetails({ id: row.Id }))}
        />
      </Grid>
    ));

  const categories = categoryList.map(category => (
    <Button key={category.Id} onClick={() => setCategory(category.Id)}>
      {category.Descripcion}
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
      <div ref={loader} style={{ width: "100%", height: "0" }} />
    </Grid>
  );
}
