export async function generateEAN13(): Promise<string> {
  let ean = '';

  for (let i = 0; i < 13; i++) {
    ean += Math.floor(Math.random() * 10);
  }

  const exists = await this.booksRepository.findOne({
    where: { code: ean },
  });

  if (exists) return this.generateEAN13();

  return ean;
}