import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import type { AccountOperation } from "../../shared/api/account/accountOperations";

type Props = {
  operations: AccountOperation[];
};

const formatOperationDateTime = (date: string, time: string) => {
  return `${date} ${time}`;
};

const formatAmount = (amount: number, operationType: string) => {
  if (operationType === "TRANSFER_OUT" || operationType === "WITHDRAW") {
    return `- ${amount}`;
  }
  if (operationType === "TRANSFER_IN" || operationType === "DEPOSIT") {
    return `+ ${amount}`;
  }
  return `${amount}`;
};

export const AccountOperationsList = ({ operations }: Props) => {
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        История операций
      </Typography>

      {operations.length === 0 ? (
        <Typography variant="body1">Операций пока нет</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {operations.map((operation) => (
            <Card key={operation.id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700}>
                  {operation.operationType}
                </Typography>

                <Typography variant="body1">
                  Сумма: {formatAmount(operation.amount, operation.operationType)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Комментарий: {operation.comment || "—"}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="caption" display="block">
                  {formatOperationDateTime(operation.date, operation.time)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};