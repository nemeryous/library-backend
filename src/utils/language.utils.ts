export enum Language {
  EN = 'en',
  VI = 'vi',
}

export function languageFromCode(code?: string): Language {
  return code?.toLowerCase().startsWith('vi') ? Language.VI : Language.EN;
}

export function languageFromCodeOrUndefined(code?: string): Language | undefined {
  if (!code) return undefined;
  const lower = code.toLowerCase();
  if (lower.startsWith('en')) return Language.EN;
  if (lower.startsWith('vi')) return Language.VI;
  return undefined;
}