import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";

import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFF",
    color: "black",
    cursor: "pointer",
    padding: "10px",
    border: "solid 1px lightgray",
    borderRadius: "5px",
    width: "120px",
    height: "auto",
    fontFamily: "Helvetica",
    transform: "scale(1)",
    transition: "all .2s ease-in-out",
    gap: "10px",
    "&:active": {
      transform: "scale(0.98)",
      transition: ".1s",
    },
  },
  imageContainer: {
    display: "flex",
    height: "120px",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    display: "flex",
    justifyContent: "center",
    width: "stretch",
    height: "stretch",
  },
  descriptionContainer: {
    display: "flex",
    height: "35px",
    overflow: "hidden",
  },
  description: {
    fontSize: "13px",
    whiteSpace: "wrap",
    textOverflow: "ellipsis",
  },
  price: {
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
        <span className={classes.description}>{description}</span>
      </div>
      <span className={classes.price}>{formatCurrency(price, 2)}</span>
    </div>
  );
}

export default ProductCard;
