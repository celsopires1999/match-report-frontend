import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
// import { ptBR } from "@mui/x-date-pickers";

// Create a theme instance.
export const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#556cd6",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: red.A400,
      },
    },
  },
  //   ptBR
);

// temas do curso - inicio
export const darkTheme = createTheme(
  {
    palette: {
      background: {
        default: "#222222",
      },
      mode: "dark",
      primary: { main: "#f5f5f1" },
      secondary: { main: "#e50914" },
      text: { primary: "#f5f5f1" },
    },
  },
  //   ptBR
);

export const lightTheme = createTheme(
  {
    palette: {
      background: {
        default: "#f5f5f1",
      },
      mode: "light",
      primary: { main: "#222222" },
      secondary: { main: "#e50914" },
      text: { primary: "#222222" },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            background: "#f5f5f1",
          },
        },
      },
    },
  },
  //   ptBR
);

// temas do curso - fim

// export default theme;
