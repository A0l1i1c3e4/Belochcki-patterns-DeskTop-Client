import { Box, Card, CardContent, Divider, Typography, Chip, Stack } from "@mui/material";
import type { AccountOperation } from "../../shared/api/account/accountOperations";

type Props = {
  operations: AccountOperation[];
};

const formatOperationDateTime = (date: string, time: string) => {
  return `${date} ${time}`;
};

const getOperationLabel = (operationType: string) => {
  switch (operationType) {
    case "TRANSFER_OUT":
      return "Перевод списание";
    case "TRANSFER_IN":
      return "Перевод зачисление";
    case "WITHDRAW":
      return "Снятие";
    case "DEPOSIT":
      return "Пополнение";
    default:
      return operationType;
  }
};

const formatAmount = (amount: number, operationType: string) => {
  if (operationType === "TRANSFER_OUT" || operationType === "WITHDRAW") {
    return `− ${amount}`;
  }
  if (operationType === "TRANSFER_IN" || operationType === "DEPOSIT") {
    return `+ ${amount}`;
  }
  return `${amount}`;
};

const getAmountColor = (operationType: string) => {
  if (operationType === "TRANSFER_OUT" || operationType === "WITHDRAW") {
    return "error.main";
  }
  if (operationType === "TRANSFER_IN" || operationType === "DEPOSIT") {
    return "success.main";
  }
  return "text.primary";
};

export const AccountOperationsList = ({ operations }: Props) => {
  return (
    <Box sx={{ mt: 4, mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          История операций
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Последние действия по счёту
        </Typography>
      </Box>

      {operations.length === 0 ? (
        <Card
          variant="outlined"
          sx={{ borderRadius: 4, boxShadow: "none", p: 2 }}
        >
          <Typography variant="body1">Операций пока нет</Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {operations.map((operation) => (
            <Card
              key={operation.id}
              variant="outlined"
              sx={(theme) => ({
                borderRadius: 4,
                boxShadow: "none",
                borderColor: theme.palette.divider,
              })}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "flex-start" }}
                  spacing={2}
                  sx={{ mb: 1.5 }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {getOperationLabel(operation.operationType)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {operation.comment || "Без комментария"}
                    </Typography>
                  </Box>

                  <Chip
                    label={operation.operationType}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: getAmountColor(operation.operationType), mb: 1.5 }}
                >
                  {formatAmount(operation.amount, operation.operationType)}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="caption" color="text.secondary">
                  {formatOperationDateTime(operation.date, operation.time)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};