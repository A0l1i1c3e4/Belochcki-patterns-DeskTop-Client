import { useEffect, useState} from "react";
import { useNavigate, Link, useParams} from "react-router-dom";
import { Box, Grid, Typography, Button} from "@mui/material";
import type {Account} from "../../shared/api/account/accounts";
import { fetchDebitAccount } from "../../shared/api/account/accounts";
import { AccountCard} from "../../entities/account/accountCard";
import { OperationDebitForm } from "../../features/accountOperations/accountOperations";

export const DebitAccountPage = () => {
  const [debitAccount, setDebitAccount] = useState<Account | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const accountID = useParams().accountId;
  
  const navigate = useNavigate();
  
  const loadDebitAccount = async () => {
    try {
      const data: Account = await fetchDebitAccount(accountID);

      setDebitAccount(data);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) navigate("/login");
      else if (status === 500) navigate("/error-500");
      else console.error("Неизвестная ошибка при загрузке постов", err);
    }
  };

  useEffect(() => {
    loadDebitAccount();
  }, []);
  

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" , flexDirection: "column", width: "70%"}}>
        <Link to={`/accounts`} >
            ← Вернутся к всем счетам
        </Link>
      <Box sx={{ p: 4, display: "flex",  flexDirection: "row" }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
                <Box sx={{ flex: 1 }}>
                    {!debitAccount ? (
                    
                    <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
                    Загрузка...
                    </Typography>
                ) : (
                    
                    <AccountCard account={debitAccount} />
                )}
                </Box>
                <Button
                    variant="contained"
                    sx={{ width: "50%"}}
                    fullWidth
                    onClick={() => setOpenForm(true)}
                    > Операции
                </Button>
            </Box>
          </Grid>
        </Grid>
        <OperationDebitForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onExchange={loadDebitAccount}
        />
      </Box>
    </Box>
  );
};

