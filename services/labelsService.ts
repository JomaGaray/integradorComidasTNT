const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getLabels(query: string = ''): Promise<string[]> {

  if (!BASE_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL. Revisá .env y reiniciá con: npx expo start -c');
  }

  const url = `${BASE_URL}/v3/taxonomy_suggestions`;

  const params = new URLSearchParams({
    tagtype: 'labels',
    lc: 'en',
    string: query,
    limit: '50',
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: { 'User-Agent': 'DigitalEpicurean/1.0 (Expo app - UNTDF TNT 2026)' },
  });

  console.debug("Called from Labels Service: ", `${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al traer etiquetas`);
  }

  const data = await response.json();
  return (data.suggestions ?? []) as string[];
}