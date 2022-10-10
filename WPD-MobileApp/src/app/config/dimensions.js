import { Dimensions } from "react-native";

const screen_width = Dimensions.get("window").width;
const screen_height = Dimensions.get("window").height;

const dimensions = {
  text: {
    header: 24,
    secondary: 18,
    default: 16,
    tertiary: 14,
  },

  spacing: {
    big_padding: 30,
    normal_padding: 10,
    minimal_padding: 5,
  },
};

/* imageScaleToSize (iw, ih, scale_w)
 * function for scaling images dinamically based on screen width
 *
 * iw: actual image width,
 * ih: actual image height,
 * scale_w: scale ratio of the image width.
 *
 * if scale_w is 50, then the returned value for width would
 * be 50% of the screen width
 *
 * returns:
 *
 */
function scaleDimsFromWidth(iw, ih, scale_w) {
  const sw = (scale_w / 100.0) * screen_width;
  const sh = ih * (sw / iw);
  return { width: sw, height: sh };
}

export { screen_width, screen_height, scaleDimsFromWidth, dimensions };
