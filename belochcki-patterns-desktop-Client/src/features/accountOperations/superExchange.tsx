import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
} from "@mui/material";
import { fetchTransfer } from "../../shared/api/account/transfer";
import {
  clearIdempotencyKey,
  getOrCreateIdempotencyKey,
  shouldKeepIdempotencyKey,
} from "../../shared/api/idempotency";

type Props = {
  open: boolean;
  onClose: () => void;
  onExchange: () => void;
};

export const ExchangeForm = ({ open, onClose, onExchange }: Props) => {
  const [amount, setAmount] = useState("");
  const [comment] = useState("Exchange successful");
  const [toAccountId, setToAccountId] = useState("");
  const [error, setError] = useState("");
  const fromAccountId = useParams().accountId;

  const operationScope = useMemo(
    () => `debit-transfer:${fromAccountId}`,
    [fromAccountId]
  );

  const handleSubmit = async () => {
    if (!fromAccountId) {
      setError("Не найден счёт списания");
      return;
    }

    const normalizedAmount = Number(amount);
    if (!normalizedAmount || normalizedAmount <= 0) {
      setError("Введите сумму операции");
      return;
    }

    if (!toAccountId.trim()) {
      setError("Введите счёт назначения");
      return;
    }

    const body = {
      amount: normalizedAmount,
      comment,
      fromAccountId,
      toAccountId: toAccountId.trim(),
    };

    const fingerprint = JSON.stringify(body);
    const idempotencyKey = getOrCreateIdempotencyKey(operationScope, fingerprint);

    try {
      await fetchTransfer(body, idempotencyKey);

      clearIdempotencyKey(operationScope);
      setError("");
      setAmount("");
      setToAccountId("");
      onExchange();
      onClose();
    } catch (e: any) {
      console.error("OPERATION exchange ERROR", e);

      if (!shouldKeepIdempotencyKey(e)) {
        clearIdempotencyKey(operationScope);
      }

      setError(
        shouldKeepIdempotencyKey(e)
          ? "Временная ошибка. При повторе перевода будет использован тот же ключ идемпотентности."
          : "Ошибка при переводе"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Пополняемый счёт"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Сумма перевода"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          Перевести
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};