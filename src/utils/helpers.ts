export function generateEAN13(): string {
  let ean = '';

  for (let i = 0; i < 12; i++) {
    ean += Math.floor(Math.random() * 10);
  }

  ean += calculateEAN13CheckDigit(ean);

  return ean;
}

function calculateEAN13CheckDigit(ean12: string): number {
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = parseInt(ean12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  return (10 - (sum % 10)) % 10;
}

export function isNil(value: any): boolean {
  return value === null || value === undefined;
}
