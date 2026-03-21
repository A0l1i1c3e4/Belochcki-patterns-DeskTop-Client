import { useState } from "react";
import { useParams} from "react-router-dom";
import { Box, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, Alert, TextField } from "@mui/material";
import { fetchExchangeDebitAccounts } from "../../shared/api/account/exchangeDebit";
import type { OperationType } from "../../shared/api/account/exchangeDebit";
type Props = {
  open: boolean;
  onClose: () => void;
  onExchange: () => void;
};

export const OperationDebitForm = ({ open, onClose, onExchange: onDebitCreated }: Props) => {
    const [amount, setAmount] = useState(0);
    const [comment] = useState("Exchange successful");
    const [operationType, setOperationType] = useState<OperationType>("withdraw");
    const [error, setError] = useState("");
    const accountID = useParams().accountId;
    
    const handleSubmit = async () => {
        if (amount == 0) return setError("Введите сумму операции");
        const body = { amount, comment};
        try {
        await fetchExchangeDebitAccounts(body, accountID, operationType);
        setError("");

        setAmount(0);

        onDebitCreated();

        onClose();
        } catch (e) {
        console.error("CREATE DEBIT ACCOUNT ERROR", e);
        setError("Ошибка при создании дебита");
        }
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>

      <DialogContent>
        <Box sx={{ mt:1 }}>
          {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

          <Select fullWidth value={operationType} onChange={e=>setOperationType(e.target.value as OperationType)} sx={{ mb:2 }}>
            <MenuItem value="withdraw">Пополнить</MenuItem>
            <MenuItem value="deposit">Снять</MenuItem>
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