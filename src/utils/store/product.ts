import { CodeDescriptionType, IdDescriptionValueType, ProductDetailsType } from "types/domain";

import { getProductEntity } from "utils/domainHelper";
import { getTaxeRateFromId } from "utils/utilities";

export async function getNewProductItem(
  token: string,
  branchId: number,
  priceTypeId: number,
  product: ProductDetailsType,
  taxTypeList: IdDescriptionValueType[],
  productId?: number
) {
  if (productId) {
    const productEntity = await getProductEntity(token, productId, branchId);
    const { price, taxRate } = getCustomerPrice(priceTypeId, productEntity, taxTypeList);
    product = {
      ...product,
      id: productEntity.IdProducto,
      code: productEntity.Codigo,
      description: productEntity.Descripcion,
      price: price.toString(),
      taxRate: taxRate,
    };
  }
  return {
    id: product.id,
    code: product.code,
    description: product.description,
    additionalInformation: "",
    quantity: product.quantity,
    taxRate: product.taxRate,
    unit: "UND",
    price: product.price,
    costPrice: product.costPrice,
    disccountRate: product.disccountRate,
  };
}

export function getCustomerPrice(
  customerPriceType: number,
  product: CodeDescriptionType,
  taxRateTypeList: IdDescriptionValueType[]
) {
  let customerPrice = 0;
  const taxRate = getTaxeRateFromId(taxRateTypeList, product.IdImpuesto);
  switch (customerPriceType) {
    case 1:
      customerPrice = product.PrecioVenta1;
      break;
    case 2:
      customerPrice = product.PrecioVenta2;
      break;
    case 3:
      customerPrice = product.PrecioVenta3;
      break;
    case 4:
      customerPrice = product.PrecioVenta4;
      break;
    case 5:
      customerPrice = product.PrecioVenta5;
      break;
    default:
      customerPrice = product.PrecioVenta1;
  }
  return { taxRate, price: customerPrice };
}
