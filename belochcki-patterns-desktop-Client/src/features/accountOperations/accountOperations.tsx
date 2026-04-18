import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
} from "@mui/material";
import {
  fetchExchangeAccounts,
  fetchCloseDebitAccounts,
} from "../../shared/api/account/exchangeDebit";
import type { OperationType } from "../../shared/api/account/exchangeDebit";
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

export const OperationDebitForm = ({ open, onClose, onExchange }: Props) => {
  const [amount, setAmount] = useState("");
  const [comment] = useState("Exchange successful");
  const [operationType, setOperationType] = useState<OperationType>("deposit");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountID = useParams().accountId;

  const operationScope = useMemo(
    () => `debit-operation:${accountID}:${operationType}`,
    [accountID, operationType]
  );

  const closeScope = useMemo(() => `debit-close:${accountID}`, [accountID]);

  const handleSubmit = async () => {
    if (!accountID) {
      setError("Не найден счёт");
      return;
    }

    const normalizedAmount = Number(amount);
    if (!normalizedAmount || normalizedAmount <= 0) {
      setError("Введите сумму операции");
      return;
    }

    const body = { amount: normalizedAmount, comment };
    const fingerprint = JSON.stringify({
      accountId: accountID,
      accountType: "debit",
      operationType,
      amount: normalizedAmount,
      comment,
    });

    const idempotencyKey = getOrCreateIdempotencyKey(operationScope, fingerprint);

    setIsSubmitting(true);
    try {
      await fetchExchangeAccounts(
        body,
        accountID,
        operationType,
        "debit",
        idempotencyKey
      );

      clearIdempotencyKey(operationScope);
      setError("");
      setAmount("");
      onExchange();
      onClose();
    } catch (e: any) {
      console.error("OPERATION DEBIT ACCOUNT ERROR", e);

      if (!shouldKeepIdempotencyKey(e)) {
        clearIdempotencyKey(operationScope);
      }

      setError(
        shouldKeepIdempotencyKey(e)
          ? "Не удалось выполнить операцию :( ."
          : "Ошибка при операции дебита"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAccount = async () => {
    if (!accountID) {
      setError("Не найден счёт");
      return;
    }

    const fingerprint = JSON.stringify({
      accountId: accountID,
      operationType: "close",
    });

    const idempotencyKey = getOrCreateIdempotencyKey(closeScope, fingerprint);

    setIsSubmitting(true);
    try {
      await fetchCloseDebitAccounts(accountID, idempotencyKey);

      clearIdempotencyKey(closeScope);
      setError("");
      onExchange();
      onClose();
    } catch (e: any) {
      console.error("CLOSE DEBIT ACCOUNT ERROR", e);

      if (!shouldKeepIdempotencyKey(e)) {
        clearIdempotencyKey(closeScope);
      }

      setError(
        shouldKeepIdempotencyKey(e)
          ? "Не удалось определить результат закрытия."
          : "Ошибка при закрытии дебита"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Select
            fullWidth
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as OperationType)}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          >
            <MenuItem value="deposit">Пополнить</MenuItem>
            <MenuItem value="withdraw">Снять</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="Сумма перевода"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={closeAccount} disabled={isSubmitting}>
          {isSubmitting ? "Обработка..." : "Закрыть"}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Обработка..." : "Обработать"}
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const OperationCreditForm = ({ open, onClose, onExchange }: Props) => {
  const [amount, setAmount] = useState("");
  const [comment] = useState("Exchange successful");
  const [operationType, setOperationType] = useState<OperationType>("withdraw");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountID = useParams().accountId;

  const operationScope = useMemo(
    () => `credit-operation:${accountID}:${operationType}`,
    [accountID, operationType]
  );

  const handleSubmit = async () => {
    if (!accountID) {
      setError("Не найден счёт");
      return;
    }

    const normalizedAmount = Number(amount);
    if (!normalizedAmount || normalizedAmount <= 0) {
      setError("Введите сумму операции");
      return;
    }

    const body = { amount: normalizedAmount, comment };
    const fingerprint = JSON.stringify({
      accountId: accountID,
      accountType: "credit",
      operationType,
      amount: normalizedAmount,
      comment,
    });

    const idempotencyKey = getOrCreateIdempotencyKey(operationScope, fingerprint);

    setIsSubmitting(true);
    try {
      await fetchExchangeAccounts(
        body,
        accountID,
        operationType,
        "credit",
        idempotencyKey
      );

      clearIdempotencyKey(operationScope);
      setError("");
      setAmount("");
      onExchange();
      onClose();
    } catch (e: any) {
      console.error("OPERATION CREDIT ACCOUNT ERROR", e);

      if (!shouldKeepIdempotencyKey(e)) {
        clearIdempotencyKey(operationScope);
      }

      setError(
        shouldKeepIdempotencyKey(e)
          ? "Не удалось определить результат операции."
          : "Ошибка при операции кредитного счёта"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Пополнение и снятие</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Select
            fullWidth
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as OperationType)}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          >
            <MenuItem value="withdraw">Снять</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="Сумма перевода"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Обработка..." : "Обработать"}
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};