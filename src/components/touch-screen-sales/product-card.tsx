import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";

import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(() => ({
  container: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    backgroundColor: "#FFF",
    color: "black",
    cursor: "pointer",
    padding: "5px 1px",
    border: "solid 1px lightgray",
    borderRadius: "5px",
    width: "160px",
    height: "auto",
    fontFamily: "Helvetica",
    transform: "scale(1)",
    transition: "all .2s ease-in-out",
    gap: "10px",
    "&:active": {
      transform: "scale(0.98)",
      transition: ".1s",
    },
    "@media screen and (min-width:414px)": {
      width: "140px",
    },
  },
  imageContainer: {
    display: "flex",
    width: "95%",
    height: "80px",
    justifyContent: "center",
    alignItems: "center",
    "@media screen and (min-width:414px)": {
      height: "70px",
    },
  },
  image: {
    display: "flex",
    justifyContent: "center",
    width: "auto",
    height: "100%",
  },
  descriptionContainer: {
    display: "flex",
    height: "auto",
    maxHeight: "42px",
    width: "95%",
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    display: "flex",
    overflow: "hidden",
    fontSize: "16px",
    fontWeight: "bold",
    whiteSpace: "no-wrap",
    textOverflow: "ellipsis",
  },
  price: {
    height: "16px",
    fontSize: "16px",
    fontWeight: "bold",
  },
}));

interface ProductVardProps {
  description: string;
  price: number;
  image: string;
  action: () => void;
}

function ProductCard({ description, price, image, action }: ProductVardProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.container} onClick={action}>
      <div className={classes.imageContainer}>
        {image !== "" && (
          <Box className={classes.image}>
            <Box
              sx={{ width: "inherit", height: "inherit" }}
              component="img"
              alt="Comapny logo image."
              src={`data:image/png;base64,${image}`}
            />
          </Box>
        )}
      </div>
      <div className={classes.descriptionContainer}>
        <p className={classes.description}>{description}</p>
      </div>
      <span className={classes.price}>{formatCurrency(price, 2)}</span>
    </div>
  );
}

export default ProductCard;
