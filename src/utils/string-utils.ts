export function renderStringTemplate(
  template: string,
  data: Record<string, string | number>,
): string {
  if (!template) {
    return '';
  }

  return Object.entries(data).reduce((currentString, [key, value]) => {
    const placeholderRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    return currentString.replace(placeholderRegex, String(value));
  }, template);
}

export function extractText(content: string, regex: RegExp): string | null {
  const match = content.match(regex);
  return match ? match[1] : null;
}