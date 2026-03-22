import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Box, Grid, Typography, Button } from "@mui/material";

import type { Account } from "../../shared/api/account/accounts";
import { fetchDebitAccount } from "../../shared/api/account/accounts";
import { AccountCard } from "../../entities/account/accountCard";


import type {AccountOperation} from "../../shared/api/account/accountOperations"
import { fetchDebitAccountOperations } from "../../shared/api/account/accountOperations";
import { connectAccountOperationsWs } from "../../shared/api/ws/accountOperationsWs";
import { AccountOperationsList } from "../../entities/account/accountOperationsList";
import {OperationDebitForm} from "../../features/accountOperations/accountOperations"

export const DebitAccountPage = () => {
  const [debitAccount, setDebitAccount] = useState<Account | null>(null);
  const [operations, setOperations] = useState<AccountOperation[]>([]);
  const [openForm, setOpenForm] = useState(false);

  const accountID = useParams().accountId;
  const navigate = useNavigate();

  const loadDebitAccount = useCallback(async () => {
    try {
      if (!accountID) return;
      const data: Account = await fetchDebitAccount(accountID);
      setDebitAccount(data);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) navigate("/login");
      else if (status === 500) navigate("/error-500");
      else console.error("Ошибка при загрузке счёта", err);
    }
  }, [accountID, navigate]);

  const loadOperations = useCallback(async () => {
    try {
      if (!accountID) return;
      const data = await fetchDebitAccountOperations(accountID, 1, 20);
      setOperations(data.content);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) navigate("/login");
      else if (status === 500) navigate("/error-500");
      else console.error("Ошибка при загрузке операций", err);
    }
  }, [accountID, navigate]);

  const reloadPageData = useCallback(async () => {
    await Promise.all([loadDebitAccount(), loadOperations()]);
  }, [loadDebitAccount, loadOperations]);

  useEffect(() => {
    reloadPageData();
  }, [reloadPageData]);

  useEffect(() => {
    if (!accountID) return;

    const disconnect = connectAccountOperationsWs({
      accountId: accountID,
      onInvalidated: () => {
        loadOperations();
      },
      onError: (message) => {
        console.error("WS error:", message);
      },
    });

    return () => {
      disconnect();
    };
  }, [accountID, loadOperations]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexDirection: "column",
        width: "70%",
      }}
    >
      <Link to={`/accounts`}>← Вернутся к всем счетам</Link>

      <Box sx={{ p: 4, display: "flex", flexDirection: "row", width: "100%" }}>
        <Grid container spacing={4} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
              <Button
                variant="contained"
                sx={{ width: "50%" }}
                fullWidth
                onClick={() => setOpenForm(true)}
              >
                Операции
              </Button>
              <Box sx={{ flex: 1 }}>
                {!debitAccount ? (
                  <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
                    Загрузка...
                  </Typography>
                ) : (
                  <>
                    <AccountCard account={debitAccount} />
                    <AccountOperationsList operations={operations} />
                  </>
                )}
              </Box>

              
            </Box>
          </Grid>
        </Grid>

        <OperationDebitForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onExchange={reloadPageData}
        />
      </Box>
    </Box>
  );
};