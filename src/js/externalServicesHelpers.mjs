// Normalizes fetch responses to JSON + throws on !ok so upstream can catch.
export async function convertToJson(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json();
}