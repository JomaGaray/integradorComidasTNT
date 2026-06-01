const BASE_URL = process.env.EXPO_PUBLIC_API_URL;


export async function getAllCategories(query: string = ''): Promise<string[]> {
  
  if (!BASE_URL) {
    throw new Error(
      'Falta EXPO_PUBLIC_API_URL. Revisá el archivo .env y reiniciá con: npx expo start -c',
    );
  }

  const url = `${BASE_URL}/v3/taxonomy_suggestions`;

  // parametros de busqueda
  const params = new URLSearchParams({
    tagtype: 'categories',
    lc: 'es',
    string: query,
    limit: '20',
  });

  console.debug("Called from Category Service: ", `${url}?${params.toString()}`);

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      'User-Agent': 'DigitalEpicurean/1.0 (Expo app - UNTDF TNT 2026)',
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al traer categorías`);
  }

  const data = await response.json();


  return (data.suggestions ?? []) as string[];
}