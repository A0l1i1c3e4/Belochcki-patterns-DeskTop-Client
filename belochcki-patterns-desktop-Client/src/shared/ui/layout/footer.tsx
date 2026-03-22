import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        mt: "auto",
        p: 2,
        textAlign: "center",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Scum Bank
      </Typography>
    </Box>
  );
}