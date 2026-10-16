import { makeTheme } from "dripsy";
export const theme = makeTheme({
  colors: {
    $bgPrimary: "#202024",
    $bgSecondary: "#29292E",
    $bgTerciary: "#121214",
    $lighGreen: "#00B37E",
    $green: "#00875F",
    $grey: "#E1E1E6",
    $darkGrey: "#7C7C8A",
    $white: "#FFFFFF",
  },
  space: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 16,
    $4: 24,
    $5: 32,
    $6: 64,
    $7: 128,
  },
  fontSizes: {
    $0: 10,
    $1: 14,
    $2: 16,
    $3: 18,
    $4: 24,
  },
  customFonts: {
    Roboto: {
      default: "Roboto_400Regular",
      400: "Roboto_400Regular",
      700: "Roboto_700Bold",
      bold: "Roboto_700Bold",
    },
  },
  fonts: {
    root: "Roboto",
  },
  text: {
    h1: { fontSize: "$4", fontWeight: "400" },
    h2: { fontSize: "$3", fontWeight: "400" },
    paragraph: { fontSize: "$2", fontWeight: "400" },
    paragraphBold: { fontSize: "$2", fontWeight: "700" },
    span: { fontSize: "$1", fontWeight: "400" },
    small: { fontSize: "$0", fontWeight: "400" },
  },
});
