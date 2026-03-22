import {Card,CardContent,Typography,CardActions,Button,Box,Chip,Divider,Stack,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Account } from "../../shared/api/account/accounts";

type Props = {
  account: Account;
  actionLabel?: string;
  onActionClick?: (accountId: string) => void;
};

const formatMoney = (value: string | number, currency: string) => {
  const numericValue = typeof value === "number" ? value : Number(value);

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: currency || "RUB",
    maximumFractionDigits: 2,
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "BLOCKED":
      return "error";
    case "LOCKED":
      return "warning";
    default:
      return "default";
  }
};

export const AccountCard = ({ account, actionLabel, onActionClick }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/debitaccount/${account.id}`);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onActionClick?.(account.id);
  };

  return (
    <Card
      onClick={handleClick}
      sx={(theme) => ({
        cursor: "pointer",
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {account.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Дебетовый счёт
            </Typography>
          </Box>

          <Chip
            label={account.status}
            color={getStatusColor(account.status) as any}
            variant="outlined"
          />
        </Stack>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 2, color: "primary.main" }}
        >
          {formatMoney(account.balance, account.CurrencyCode)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              ID счёта
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
              {account.id}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Валюта
            </Typography>
            <Typography variant="body2">{account.CurrencyCode}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Дата создания
            </Typography>
            <Typography variant="body2">
              {account.createdDate} {account.createdTime}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Тип
            </Typography>
            <Typography variant="body2">{account.type || "DEBIT"}</Typography>
          </Box>
        </Box>
      </CardContent>

      {actionLabel && onActionClick && (
        <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleActionClick}
            sx={{ borderRadius: 2 }}
          >
            {actionLabel}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export const CreditAccountCard = ({ account, actionLabel, onActionClick }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/creditaccount/${account.id}`);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onActionClick?.(account.id);
  };

  return (
    <Card
      onClick={handleClick}
      sx={(theme) => ({
        cursor: "pointer",
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${
          theme.palette.mode === "dark" ? "#1b263b" : "#f8fbff"
        } 100%)`,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {account.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Кредитный счёт
            </Typography>
          </Box>

          <Chip
            label={account.status}
            color={getStatusColor(account.status) as any}
            variant="outlined"
          />
        </Stack>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 2, color: "secondary.main" }}
        >
          {formatMoney(account.balance, account.CurrencyCode)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
            ID: {account.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Валюта: {account.CurrencyCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Создан: {account.createdDate} {account.createdTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Тип: {account.type || "CREDIT"}
          </Typography>
        </Stack>
      </CardContent>

      {actionLabel && onActionClick && (
        <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleActionClick}
            sx={{ borderRadius: 2 }}
          >
            {actionLabel}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};