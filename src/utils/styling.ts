const colorPalette = [
  "#FFDF81",
  "#C990C0",
  "#F79767",
  "#56C7E4",
  "#F16767",
  "#D8C7AE",
  "#8DCC93",
  "#ECB4C9",
  "#4D8DDA",
  "#FFC354",
  "#DA7294",
  "#579380",
];

const labelColorMap = new Map();
let colorIndex = 0;

export const getUniqueColorForLabel = (label: string) => {
  if (!labelColorMap.has(label)) {
    const color = colorPalette[colorIndex % colorPalette.length];
    labelColorMap.set(label, color);
    colorIndex++;
  }
  return labelColorMap.get(label);
};
