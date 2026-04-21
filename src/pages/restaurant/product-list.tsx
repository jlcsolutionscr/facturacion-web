import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";

import ProductCard from "components/product-card";
import { getProductList, getProductListCount } from "state/product/reducer";
import { addDetails, loadMoreProductsToList } from "state/working-order/asyncActions";

interface ProductListProps {
  value?: number;
}

export default function ProductList({ value }: ProductListProps) {
  const dispatch = useDispatch();

  const myRef = useRef<HTMLDivElement>(null);
  const loader = useRef(null);

  const productList = useSelector(getProductList);
  const productListCount = useSelector(getProductListCount);

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

  const rows = productList.map(row => (
    <Grid key={row.Id} height="fit-content">
      <ProductCard
        description={row.Descripcion}
        price={row.PrecioVenta1}
        image={row.Imagen}
        action={() => dispatch(addDetails({ id: row.Id }))}
      />
    </Grid>
  ));

  return (
    <Grid
      ref={myRef}
      width="100%"
      height="auto"
      maxHeight="100%"
      overflow="hidden auto"
      container
      spacing={{ xs: 0, sm: 0.5 }}
      justifyContent="center"
    >
      {rows}
      <div ref={loader} style={{ width: "100%", height: "0" }} />
    </Grid>
  );
}
