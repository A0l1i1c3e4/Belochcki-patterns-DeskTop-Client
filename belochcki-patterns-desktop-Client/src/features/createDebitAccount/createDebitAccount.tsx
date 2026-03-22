import { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Box,Alert,FormControl,InputLabel,Select,MenuItem,Typography,Stack,} from "@mui/material";
import { fetchCreateDebitAccounts } from "../../shared/api/account/createDebitAccount";

type Props = {
  open: boolean;
  onClose: () => void;
  onDebitCreated: () => void;
};

export const CreateDebitForm = ({ open, onClose, onDebitCreated }: Props) => {
  const [currencyCode, setCurrencyCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!currencyCode.trim()) {
      return setError("Выберите валюту счёта");
    }

    const body = { currencyCode };

    try {
      await fetchCreateDebitAccounts(body);
      setError("");
      setCurrencyCode("");
      onDebitCreated();
      onClose();
    } catch (e) {
      console.error("CREATE DEBIT ACCOUNT ERROR", e);
      setError("Ошибка при создании дебетового счёта");
    }
  };

  const handleClose = () => {
    setError("");
    setCurrencyCode("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          Создать дебетовый счёт
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Выберите валюту для нового счёта
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl fullWidth>
            <InputLabel id="currency-label">Валюта</InputLabel>
            <Select
              labelId="currency-label"
              value={currencyCode}
              label="Валюта"
              onChange={(e) => setCurrencyCode(e.target.value as string)}
            >
              <MenuItem value="USD">USD — Доллар США</MenuItem>
              <MenuItem value="RUB">RUB — Российский рубль</MenuItem>
              <MenuItem value="EUR">EUR — Евро</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(144, 202, 249, 0.08)"
                  : "rgba(25, 118, 210, 0.06)",
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <Typography variant="body2" color="text.secondary">
              После создания счёт появится в списке ваших дебетовых счетов.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleClose} sx={{ borderRadius: 3 }}>
          Отмена
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 3 }}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};