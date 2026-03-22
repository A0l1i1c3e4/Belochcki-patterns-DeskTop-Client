import { Box, Typography, Paper } from "@mui/material";

const team = [
  {
    name: "Носов Михаил",
    username: "@gde_yya",
  },
  {
    name: "Воронин Валентин",
    username: "@vallvoron",
  },
  {
    name: "Алимов Константин",
    username: "@MyBeautifuIMadness",
  },
  {
    name: "Петров Василий",
    username: "@Magnus_40",
  },
];

export const AbountUsPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Наша команда
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 3,
        }}
      >
        {team.map((member) => (
          <Paper
            key={member.username}
            elevation={3}
            sx={(theme) => ({
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              transition: "all 0.25s ease",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[6],
              },
            })}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {member.name}
            </Typography>

            <Typography
              variant="body2"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
              })}
            >
              {member.username}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};