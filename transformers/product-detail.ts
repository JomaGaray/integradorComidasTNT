import { Product, RawProductDetail } from '../types/product';

function formatGrade(grade?: string): string | undefined {
  if (!grade) return undefined;
  const g = grade.toLowerCase();
  if (g === 'unknown' || g === 'not-applicable') return undefined;
  return g.replace('-plus', '+').toUpperCase();
}

export function transformProductDetail(raw: RawProductDetail): Product {
  const num = (k: string): number | undefined => {
    const v = raw.nutriments?.[k];
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '') return Number(v);
    return undefined;
  };
  const fmt = (v: number) => String(Math.round(v * 100) / 100);
  const grams = (k: string) => {
    const v = num(k);
    return v === undefined ? undefined : `${fmt(v)}g`;
  };

  const kcal = num('energy-kcal_100g');
  const kj = num('energy-kj_100g');
  let energyTable: string | undefined;
  if (kcal !== undefined && kj !== undefined) energyTable = `${fmt(kcal)} kcal / ${fmt(kj)} kJ`;
  else if (kcal !== undefined) energyTable = `${fmt(kcal)} kcal`;
  else if (kj !== undefined) energyTable = `${fmt(kj)} kJ`;

  const highlights: { label: string; value: string }[] = [];
  if (kj !== undefined) highlights.push({ label: 'ENERGY', value: `${fmt(kj)} kJ` });
  else if (kcal !== undefined) highlights.push({ label: 'ENERGY', value: `${fmt(kcal)} kcal` });
  const fatH = grams('fat_100g');
  if (fatH) highlights.push({ label: 'FAT', value: fatH });
  const protH = grams('proteins_100g');
  if (protH) highlights.push({ label: 'PROTEIN', value: protH });
  const sugH = grams('sugars_100g');
  if (sugH) highlights.push({ label: 'SUGARS', value: sugH });

  const rows: Product['nutrition']['rows'] = [];
  if (energyTable) rows.push({ label: 'Energy', value: energyTable });
  const fat = grams('fat_100g');
  if (fat) rows.push({ label: 'Fat', value: fat });
  const sat = grams('saturated-fat_100g');
  if (sat) rows.push({ label: 'saturates', value: sat, indented: true });
  const carbs = grams('carbohydrates_100g');
  if (carbs) rows.push({ label: 'Carbohydrate', value: carbs });
  const sugars = grams('sugars_100g');
  if (sugars) rows.push({ label: 'sugars', value: sugars, indented: true });
  const fiber = grams('fiber_100g');
  if (fiber) rows.push({ label: 'Fibre', value: fiber });
  const prot = grams('proteins_100g');
  if (prot) rows.push({ label: 'Protein', value: prot });
  const salt = grams('salt_100g');
  if (salt) rows.push({ label: 'Salt', value: salt });

  const allergens =
    raw.allergens_tags && raw.allergens_tags.length
      ? raw.allergens_tags.map((t) => t.split(':').pop()).join(', ')
      : undefined;

  return {
    id: raw.code ?? '',
    brand: (raw.brands?.split(',')[0] ?? '').trim(),
    name: (raw.product_name_es || raw.product_name || 'Producto sin nombre').trim(),
    imageUrl: raw.image_front_url || raw.image_url,
    heroColor: '#F26B5E',
    nutriScore: formatGrade(raw.nutriscore_grade),
    novaGroup: raw.nova_group,
    ecoScore: formatGrade(raw.ecoscore_grade),
    highlights,
    ingredients: (raw.ingredients_text_es || raw.ingredients_text || '—').trim(),
    allergens,
    nutrition: {
      perLabel: `per ${raw.nutrition_data_per ?? '100g'}`,
      rows,
    },
  };
}