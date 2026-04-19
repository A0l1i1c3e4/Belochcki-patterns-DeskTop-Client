import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Box, Grid, Typography, Button, Paper } from "@mui/material";
import type { Account } from "../../shared/api/account/accounts";
import { CreditAccountCard } from "../../entities/account/accountCard";
import { OperationCreditForm } from "../../features/accountOperations/accountOperations";
import { apiRequest } from "../../shared/api/ApiClient";
import { SERVICES } from "../../types/Services";

export const CreditAccountPage = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const { accountId } = useParams();
  const navigate = useNavigate();

  const handleError = (err: any) => {
    if (err?.status === 401) {
      navigate("/login");
      return;
    }

    if (err?.status === 503) {
      console.warn("CREDITS circuit open");
      return;
    }

    console.error("Credit account error", err);
  };

  const loadAccount = async () => {
    try {
      const data = await apiRequest<Account>(
        SERVICES.CREDITS,
        `/accounts/credit/${accountId}`
      );

      setAccount(data);
    } catch (err: any) {
      handleError(err);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      <Link to="/accounts">← Назад</Link>

      <Paper sx={{ p: 4, mt: 2, borderRadius: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            {account && account.balance !== "0" && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenForm(true)}
              >
                Операции
              </Button>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            {!account ? (
              <Typography>Загрузка...</Typography>
            ) : (
              <CreditAccountCard account={account} />
            )}
          </Grid>
        </Grid>
      </Paper>

      <OperationCreditForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onExchange={loadAccount}
      />
    </Box>
  );
};