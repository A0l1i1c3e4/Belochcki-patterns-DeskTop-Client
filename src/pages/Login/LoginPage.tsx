import type { SyntheticEvent } from "react";
import { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";

interface LoginResponse {
  token: string;
}

export default function LoginPage() {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"CLIENT" | "EMPLOYEE">("CLIENT");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8085/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password, role }),
      });

      if (!response.ok) {
        throw new Error("Неверный логин или пароль");
      }

      const data: LoginResponse = await response.json();
      const token = data.token;
      alert(token);
      localStorage.setItem("token", data.token);
      if (role === "CLIENT") {
      window.location.href = `http://localhost:3001?token=${token}`;
      } else {
      window.location.href = `http://localhost:3002?token=${token}`;
      }
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#ef4444";
    toast.style.color = "white";
    toast.style.padding = "12px 16px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 2
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: { xs: '100%', sm: '400px' },
          padding: 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" component="h2">
          Login
        </Typography>

        <TextField
          label="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'CLIENT' | 'EMPLOYEE')}
        >
          <MenuItem value="CLIENT">CLIENT</MenuItem>
          <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
}
