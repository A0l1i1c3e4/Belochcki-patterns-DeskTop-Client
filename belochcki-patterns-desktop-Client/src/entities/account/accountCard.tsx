import { Card, CardContent, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Account } from "../../shared/api/accounts";

type Props = {
  account: Account;
};

export const AccountCard = ({ account: account }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/account/${account.id}`);
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
          {new Date(account.createdDate).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};