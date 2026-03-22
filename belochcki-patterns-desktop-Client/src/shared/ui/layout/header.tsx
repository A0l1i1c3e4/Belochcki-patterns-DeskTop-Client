import { AppBar,Toolbar,Typography,Button,Box,IconButton,Switch,FormControlLabel,} from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppTheme } from "../../../app/ThemeProvider";

export default function Header() {
  const { mode, toggleTheme, isThemeLoading } = useAppTheme();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    window.location.href = "http://localhost:666/main";
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "inherit" }}>
            Scum Bank
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Button color="inherit" component={Link} to="/main">
              Главная
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "DARK"}
                onChange={toggleTheme}
                disabled={isThemeLoading}
              />
            }
            label={mode === "DARK" ? "Тёмная" : "Светлая"}
            sx={{ mr: 1 }}
          />

          <IconButton color="inherit" component={Link} to="/profile">
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}