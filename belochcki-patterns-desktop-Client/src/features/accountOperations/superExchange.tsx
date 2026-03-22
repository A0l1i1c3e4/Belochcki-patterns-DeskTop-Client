import { useState } from "react";
import { useParams} from "react-router-dom";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, TextField } from "@mui/material";
import { fetchTransfer} from "../../shared/api/account/transfer";

type Props = {
  open: boolean;
  onClose: () => void;
  onExchange: () => void;
};

export const ExchangeForm = ({ open, onClose, onExchange: onExchange }: Props) => {
  const [amount, setAmount] = useState(0);
  const [comment] = useState("Exchange successful");
  const [toAccountId, setToAccountId] =  useState("");
  const [error, setError] = useState("");
  const fromAccountId = useParams().accountId;
  
  const handleSubmit = async () => {
    if (amount == 0) return setError("Введите сумму операции");
    const body = { amount, comment, fromAccountId, toAccountId};
    try {
    await fetchTransfer(body);
    setError("");

    setAmount(0);

    onExchange();

    onClose();
    } catch (e) {
    console.error("OPERATION exchange ERROR", e);
    setError("Ошибка при переводе");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>
      <DialogContent>
        <Box sx={{ mt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

          <TextField fullWidth label="Пополняемый счёт" value={toAccountId} onChange={e=>setToAccountId(e.target.value)} sx={{ mb:2 }} />
          <TextField fullWidth label="Сумма перевода"  type="number" value={amount} onChange={e=>setAmount(e.target.value)} sx={{ mb:2 }} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>Перевести</Button>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};