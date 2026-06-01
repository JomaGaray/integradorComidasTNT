
import { ProductByCodeResponse, RawProductDetail } from "@/types/product";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

//pido solo los campos que necesito
const FIELDS = [
  'code',
  'product_name',
  'product_name_es',
  'brands',
  'image_front_url',
  'image_url',
  'nutriscore_grade',
  'nova_group',
  'ecoscore_grade',
  'ingredients_text',
  'ingredients_text_es',
  'allergens_tags',
  'nutriments',
  'nutrition_data_per',
].join(',');

export async function getProductByCode(code: string): Promise<RawProductDetail> {
  
  const url = `${BASE_URL}/v3/product/${code}`;

  //parametros de busqueda
  const params = new URLSearchParams({
    product_type: "food",
    lc: "es",
    fields: FIELDS,
    limit: "20",
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      "User-Agent": "tnt-2026-UNTDF", // OFF
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = (await response.json()) as ProductByCodeResponse;

  console.debug("Called from Producto Service: ", `${BASE_URL}?${params.toString()}`);
  
  if (data.status !== 'success' || !data.product) {
    throw new Error(`Producto ${code} no encontrado`);
  }
 
  return data.product;
}