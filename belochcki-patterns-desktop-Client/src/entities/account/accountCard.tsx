import { Card, CardContent, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Account } from "../../shared/api/account/accounts";

type Props = {
  account: Account;
};

export const AccountCard = ({ account: account }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/debitaccount/${account.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{ cursor: "pointer" }}>
      <CardContent>
        <Typography variant="h6">{account.name}</Typography>
        <Typography variant="h6">{account.balance}</Typography>
        <Typography variant="h6">{account.CurrencyCode}</Typography>
        <Typography variant="h6">{account.status}</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          {new Date(account.createdTime + account.createdDate).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const CreditAccountCard = ({ account: account }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/creditaccount/${account.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{ cursor: "pointer" }}>
      <CardContent sx={{ p: 4, width: "100%", display: "flex",  flexDirection: "column" }}>
        <Typography variant="h6">{account.name}</Typography>
        <Typography variant="h6">{account.balance}</Typography>
        <Typography variant="h6">{account.CurrencyCode}</Typography>
        <Typography variant="h6">{account.status}</Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          {new Date(account.createdTime + account.createdDate).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};