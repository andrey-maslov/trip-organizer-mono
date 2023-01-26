export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const safelyParseJSON = <T>(json: unknown): T | null => {
  if (typeof json !== 'string') {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const safelyStringifyJSON = <T>(data: T): string => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return '{}';
  }
};
