import { useState } from "react";
import { useParams} from "react-router-dom";
import { Box, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, Alert, TextField } from "@mui/material";
import { fetchExchangeAccounts, fetchCloseDebitAccounts} from "../../shared/api/account/exchangeDebit";
import type { OperationType } from "../../shared/api/account/exchangeDebit";
type Props = {
  open: boolean;
  onClose: () => void;
  onExchange: () => void;
};

export const OperationDebitForm = ({ open, onClose, onExchange: onExchange }: Props) => {
  const [amount, setAmount] = useState(0);
  const [comment] = useState("Exchange successful");
  const [operationType, setOperationType] = useState<OperationType>("deposit");
  const [error, setError] = useState("");
  const accountID = useParams().accountId;
  
  const handleSubmit = async () => {
    if (amount == 0) return setError("Введите сумму операции");
    const body = { amount, comment};
    try {
    await fetchExchangeAccounts(body, accountID, operationType, "debit");
    setError("");

    setAmount(0);

    onExchange();

    onClose();
    } catch (e) {
    console.error("OPERATION DEBIT ACCOUNT ERROR", e);
    setError("Ошибка при операции дебита");
    }
  };

  const closeAccount = async () => {
    try {
    await fetchCloseDebitAccounts(accountID);
    setError("");
    onClose();
    } catch (e) {
    console.error("CLOSE DEBIT ACCOUNT ERROR", e);
    setError("Ошибка при закрытии дебита");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>
      <DialogContent>
        <Box sx={{ mt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

          <Select fullWidth value={operationType} onChange={e=>setOperationType(e.target.value as OperationType)} sx={{ mb:2 }}>
            <MenuItem value="deposit">Пополнить</MenuItem>
            <MenuItem value="withdraw">Снять</MenuItem>
          </Select>
          <TextField fullWidth label="Сумма перевода"  type="number" value={amount} onChange={e=>setAmount(e.target.value)} sx={{ mb:2 }} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={closeAccount}>Закрыть</Button>
        <Button variant="contained" onClick={handleSubmit}>Обработать</Button>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};


export const OperationCreditForm = ({ open, onClose, onExchange: onExchange }: Props) => {
  const [amount, setAmount] = useState(0);
  const [comment] = useState("Exchange successful");
  const [operationType, setOperationType] = useState<OperationType>("withdraw");
  const [error, setError] = useState("");
  const accountID = useParams().accountId;
  
  const handleSubmit = async () => {
    if (amount == 0) return setError("Введите сумму операции");
    const body = { amount, comment};
    try {
    await fetchExchangeAccounts(body, accountID, operationType, "credit");
    setError("");
    setAmount(0);

    onExchange();

    onClose();
    } catch (e) {
    console.error("OPERATION CREDIT ACCOUNT ERROR", e);
    setError("Ошибка при операции кредитного счёта");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>
      <DialogContent>
        <Box sx={{ mt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

          <Select fullWidth value={operationType} onChange={e=>setOperationType(e.target.value as OperationType)} sx={{ mb:2 }}>
            <MenuItem value="withdraw">Снять</MenuItem>
          </Select>
          <TextField fullWidth label="Сумма перевода"  type="number" value={amount} onChange={e=>setAmount(e.target.value)} sx={{ mb:2 }} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>Обработать</Button>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};