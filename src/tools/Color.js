export const PorcentajeL = ['94', '96', '45', '70'];

export function GetHSL(ColorRGBDecimal) {
  // let ColorRGBHexadecimal = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(`#${ColorPrincipal(ColorRGBDecimal)}`);
  let ColorRGBHexadecimal = '00000' + ColorRGBDecimal.toString(16);
  ColorRGBHexadecimal = ColorRGBHexadecimal.substr(ColorRGBHexadecimal.length - 6, 6);

  let R = parseInt(ColorRGBHexadecimal.substr(0, 2), 16) / 255;
  let G = parseInt(ColorRGBHexadecimal.substr(2, 2), 16) / 255;
  let B = parseInt(ColorRGBHexadecimal.substr(4, 2), 16) / 255;

  let max = Math.max(R, G, B),
    min = Math.min(R, G, B);
  let H,
    S,
    L = (max + min) / 2;
  if (max == min) {
    H = S = 0; // achromatic
  } else {
    let d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case R:
        H = (G - B) / d + (G < B ? 6 : 0);
        break;
      case G:
        H = (B - R) / d + 2;
        break;
      case B:
        H = (R - G) / d + 4;
        break;
    }
    H /= 6;
  }

  H = Math.round(H * 360);
  S = Math.round(S * 100);
  L = Math.round(L * 100);

  return [H, S, L];
}

// Color RGB de decimal a hexadecimal
export function ColorRGB(ColorRGBDecimal) {
  let ColorRGBHexadecimal = '00000' + ColorRGBDecimal.toString(16);
  ColorRGBHexadecimal = ColorRGBHexadecimal.substr(ColorRGBHexadecimal.length - 6, 6);
  return `#${ColorRGBHexadecimal}`;
}

// Color Registro Opción
export function ColorRegistroOpcion(Color) {
  let HSL = GetHSL(Color);
  return `hsl(${HSL[0]},${HSL[1]}%,${PorcentajeL[0]}%)`;
}
