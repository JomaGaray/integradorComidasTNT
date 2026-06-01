export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'E';

export type NutritionRow = {
  label: string;
  value: string;
  indented?: boolean;
};

export type Product = {
  id: string; // codigo de barras Code
  brand: string;
  name: string;
  imageUrl?: string;
  heroColor: string;
  nutriScore?: string;
  novaGroup?: number;
  ecoScore?: string;
  highlights: { label: string; value: string }[];
  ingredients: string;
  allergens?: string;
  nutrition: {
    perLabel: string;
    rows: NutritionRow[];
  };
};


export type ProductSearchResponse = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: RawProductDetail[];
}

export type RawProductDetail = {
  code?: string;
  product_name?: string;
  product_name_es?: string;
  brands?: string;
  image_front_small_url?: string
  image_front_url?: string;
  image_url?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
  ingredients_text?: string;
  ingredients_text_es?: string;
  allergens_tags?: string[];
  nutriments?: Record<string, number | string>;
  nutrition_data_per?: string;
}


export type  ProductByCodeResponse = {
  product?: RawProductDetail;
  status?: string; // "success" | "failure"
  status_verbose?: string;
}