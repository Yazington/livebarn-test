export const createColorFromNumbers = (target: number[]) => {
  return `rgb(${target[0]}, ${target[1]}, ${target[2]})`;
};

export const rgbStringToNumberString = (target: string) => {
  return target.replace("rgb(", "").replace(")", "");
};

export const rgbStringToNumbers = (target: string) => {
  return rgbStringToNumberString(target)
    .split(",")
    .map((rgbNumberString: string) => parseInt(rgbNumberString));
};

export const calculateColorDifference = (
  targetColor: number[],
  currentColor: number[]
) => {
  if (!targetColor) return 0;
  return (
    (1 / 255) *
    (1 / Math.sqrt(3)) *
    Math.sqrt(
      Math.pow(targetColor[0] - currentColor[0], 2) +
        Math.pow(targetColor[1] - currentColor[1], 2) +
        Math.pow(targetColor[2] - currentColor[2], 2)
    )
  );
};
