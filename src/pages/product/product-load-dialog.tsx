import { Button, DataGrid, Select, TextField } from "jlc-component-library";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import { getCategoryList as getCategoryListAction, saveProductWithEntity } from "state/product/asyncActions";
import { getCategoryList } from "state/product/reducer";
import { getCompanyId } from "state/session/reducer";

type ProductLoadDialogProps = {
  setDialogOpen: (value: boolean) => void;
};

export default function ProductLoadDialog({ setDialogOpen }: ProductLoadDialogProps) {
  const [productList, setProductList] = useState<{ description: string; price: number; image: string }[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [codeInit, setCodeInit] = useState<string>("");

  const dispatch = useDispatch();
  const companyId = useSelector(getCompanyId);
  const categoryList = useSelector(getCategoryList);

  const folderFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categoryList.length === 0) {
      dispatch(getCategoryListAction());
    }
  }, [dispatch, categoryList.length]);

  const handleFolderSelect = (event: { preventDefault: () => void; target: { files: FileList | null } }) => {
    event.preventDefault();
    if (event.target.files !== null) {
      const imageFiles = Array.from(event.target.files).filter(
        file => file.type.startsWith("image/") || file.name.match(/\.(jpg|jpeg|png|gif)$/i)
      );
      imageFiles.forEach(file => {
        const reader: FileReader = new FileReader();
        const productDescription = file.name.substring(0, file.name.lastIndexOf(" ")) || file.name;
        const productPrice = parseFloat(file.name.substring(file.name.lastIndexOf(" ") + 1)) || 0;
        reader.onloadend = () => {
          const logoBase64 = (reader.result as string).substring((reader.result as string).indexOf(",") + 1);
          setProductList(prevList => [
            ...prevList,
            { description: productDescription, price: productPrice, image: logoBase64 },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleUpdate = async () => {
    const productDataList = [];
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      const code = `${codeInit.trim().toUpperCase()}-${i + 1}`;
      const productData = {
        IdProducto: 0,
        IdEmpresa: companyId,
        Tipo: 3,
        IdLinea: categoryId ? parseInt(categoryId) : 0,
        Codigo: code,
        CodigoProveedor: code,
        CodigoClasificacion: "",
        Imagen: product.image,
        IdImpuesto: 8,
        Descripcion: product.description,
        PrecioCosto: 0,
        PrecioVenta1: product.price,
        PrecioVenta2: product.price,
        PrecioVenta3: product.price,
        PrecioVenta4: product.price,
        PrecioVenta5: product.price,
        Observacion: "",
        Marca: "",
        Activo: true,
        PorcDescuento: 0,
        ModificaPrecio: false,
        IndExistencia: 0,
      };
      productDataList.push(productData);
    }
    dispatch(saveProductWithEntity({ list: productDataList }));
  };

  const handleClean = () => {
    setProductList([]);
    setCategoryId("");
    setCodeInit("");
  };

  const rows = productList.map(row => ({
    description: row.description,
    price: row.price,
  }));

  const columns = [
    { field: "description", width: "235px", headerName: "Nombre" },
    { field: "price", width: "75px", headerName: "Precio" },
  ];

  const disabled = productList.length === 0 || categoryId === "" || codeInit.trim() === "";

  const categories = categoryList.map(item => (
    <MenuItem key={item.Id} value={item.Id}>
      {item.Descripcion}
    </MenuItem>
  ));

  return (
    <>
      <DialogTitle>Actualizar producto</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <input
              style={{ display: "none" }}
              id="logo-image-upload-button-input"
              ref={folderFileRef}
              type="file"
              /* @ts-expect-error */
              webkitdirectory=""
              // eslint-disable-next-line react/no-unknown-property
              directory=""
              onChange={handleFolderSelect}
            />
            <Button label="Cargar" onClick={() => folderFileRef.current?.click()} />
          </Grid>
          <Grid item>
            <Select
              id="id-linea-select-id"
              label="Seleccione la línea del producto"
              value={categoryId}
              onChange={event => {
                setCategoryId(event.target.value);
              }}
            >
              {categories}
            </Select>
          </Grid>
          <Grid item>
            <TextField
              label="Siglas iniciales del código"
              value={codeInit}
              onChange={event => setCodeInit(event.target.value)}
            />
          </Grid>
          <Grid item>
            <div style={{ height: "calc(100vh - 251px)", overflowY: "auto" }}>
              <DataGrid showHeader dense columns={columns} rows={rows} rowsPerPage={rows.length} />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ margin: "0 20px 10px 20px" }}>
        <Button disabled={disabled} label="Importar" autoFocus onClick={handleUpdate} />
        <Button disabled={disabled} label="Limpiar" autoFocus onClick={handleClean} />
        <Button negative label="Cerrar" onClick={() => setDialogOpen(false)} />
      </DialogActions>
    </>
  );
}
