export async function generateEAN13(): Promise<string> {
  let ean = '';

  for (let i = 0; i < 13; i++) {
    ean += Math.floor(Math.random() * 10);
  }

  return ean;
}