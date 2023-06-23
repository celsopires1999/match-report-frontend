import { Theme } from "@mui/material";
import { AppBar, Box, Container } from "@mui/material";
import { Header } from "./Header";

export type LayoutProps = {
  children: React.ReactNode;
  currentTheme: Theme;
  toggle: () => void;
};

export function Layout({ children, currentTheme, toggle }: LayoutProps) {
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          color="inherit"
          sx={{
            width: { sm: `400px)` },
            ml: { sm: `5px` },
          }}
        >
          <Header
            handleDrawerToggle={() => {}}
            toggle={toggle}
            mode={currentTheme.palette.mode === "dark" ? "dark" : "light"}
          />
        </AppBar>
        <Container maxWidth="lg" sx={{ color: "inherit", my: 12 }}>
          {children}
        </Container>
      </Box>
    </div>
  );
}
