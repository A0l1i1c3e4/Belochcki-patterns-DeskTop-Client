import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "inherit" }}>
            Scum Bank
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Button color="inherit" component={Link} to="/course">
              Главная
            </Button>
            <Button color="inherit" component={Link} to="/students">
              Студенты
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
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