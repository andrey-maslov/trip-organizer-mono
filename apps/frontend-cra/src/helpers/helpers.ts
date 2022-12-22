export const convertArrayToObject = <T>(
  array: T[],
  key: string
): Record<string, T> => {
  // if (!array || !Array.isArray(array)) {
  //   return null;
  // }

  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key as keyof typeof obj]]: item,
    };
  }, initialValue);
};
