import { useState } from "react";
import { Box, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from "@mui/material";
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
    if (!currencyCode.trim()) return setError("Название поста обязательно");
    const body = { currencyCode};
    try {
      await fetchCreateDebitAccounts(body);
      setError("");

      setCurrencyCode("");

      onDebitCreated();

      onClose();
    } catch (e) {
      console.error("CREATE DEBIT ACCOUNT ERROR", e);
      setError("Ошибка при создании дебита");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать дебетовый счёт</DialogTitle>

      <DialogContent>
        <Box sx={{ mt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

          <Select fullWidth value={currencyCode} onChange={e=>setCurrencyCode(e.target.value as string)} sx={{ mb:2 }}>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="RUB">RUB</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>Создать</Button>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};