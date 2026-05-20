import { CodeDescriptionType, IdDescriptionValueType, ProductDetailsType } from "types/domain";

import { getProductEntity } from "utils/domainHelper";
import { getTaxeRateFromId, roundNumber } from "utils/utilities";

export async function getNewProductItem(
  token: string,
  branchId: number,
  priceTypeId: number,
  priceIncludedTaxes: boolean,
  product: ProductDetailsType,
  taxTypeList: IdDescriptionValueType[],
  productId?: number
) {
  if (productId) {
    const productEntity = await getProductEntity(token, productId, branchId);
    const { price, taxRate } = getCustomerPrice(priceTypeId, productEntity, priceIncludedTaxes, taxTypeList);
    product = {
      ...product,
      id: productEntity.IdProducto,
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
    price: priceIncludedTaxes
      ? product.price
      : roundNumber(parseFloat(product.price) * (1 + product.taxRate / 100), 2).toString(),
    costPrice: product.costPrice,
    disccountRate: product.disccountRate,
  };
}

function getCustomerPrice(
  customerPriceType: number,
  product: CodeDescriptionType,
  priceIncludedTaxes: boolean,
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
  if (!priceIncludedTaxes) {
    customerPrice = roundNumber(customerPrice / (1 + taxRate / 100), 3);
  }
  return { taxRate, price: customerPrice };
}
