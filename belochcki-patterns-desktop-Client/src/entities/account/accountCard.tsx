import { Card, CardActions, CardContent, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Account } from "../../shared/api/account/accounts";

type Props = {
  account: Account;
  actionLabel?: string;
  onActionClick?: (accountId: string) => void;
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
    <Card onClick={handleClick} sx={{ cursor: "pointer" }}>
      <CardContent>
        <Typography variant="h6">{account.name}</Typography>
        <Typography variant="h6">{account.id}</Typography>
        <Typography variant="h6">{account.balance}</Typography>
        <Typography variant="h6">{account.CurrencyCode}</Typography>
        <Typography variant="h6">{account.status}</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          {`${account.createdDate} ${account.createdTime}`}
        </Typography>
      </CardContent>

      {actionLabel && onActionClick && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button variant="outlined" size="small" onClick={handleActionClick}>
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
    <Card onClick={handleClick} sx={{ cursor: "pointer" }}>
      <CardContent
        sx={{ p: 4, width: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6">{account.name}</Typography>
        <Typography variant="h6">{account.id}</Typography>
        <Typography variant="h6">{account.balance}</Typography>
        <Typography variant="h6">{account.CurrencyCode}</Typography>
        <Typography variant="h6">{account.status}</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          {`${account.createdDate} ${account.createdTime}`}
        </Typography>
      </CardContent>

      {actionLabel && onActionClick && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button variant="outlined" size="small" onClick={handleActionClick}>
            {actionLabel}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};