import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Box, Grid, Typography, Button } from "@mui/material";

import type { Account } from "../../shared/api/account/accounts";
import type { AccountOperation } from "../../shared/api/account/accountOperations";

import { AccountCard } from "../../entities/account/accountCard";
import { AccountOperationsList } from "../../entities/account/accountOperationsList";

import { OperationDebitForm } from "../../features/accountOperations/accountOperations";
import { ExchangeForm } from "../../features/accountOperations/superExchange";

import { apiRequest } from "../../shared/api/ApiClient";
import { SERVICES } from "../../types/Services";
import { connectAccountOperationsWs } from "../../shared/api/ws/accountOperationsWs";

export const DebitAccountPage = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [operations, setOperations] = useState<AccountOperation[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openForm2, setOpenForm2] = useState(false);

  const { accountId } = useParams();
  const navigate = useNavigate();

  const handleError = (err: any) => {
    if (err?.status === 401) {
      navigate("/login");
      return;
    }

    if (err?.status === 503) {
      console.warn("CORE circuit open");
      return;
    }

    console.error("Debit error", err);
  };

  const loadAccount = useCallback(async () => {
    try {
      if (!accountId) return;

      const data = await apiRequest<Account>(
        SERVICES.CORE,
        `/accounts/debit/${accountId}`
      );

      setAccount(data);
    } catch (err: any) {
      handleError(err);
    }
  }, [accountId]);

  const loadOperations = useCallback(async () => {
    try {
      if (!accountId) return;

      const data = await apiRequest<any>(
        SERVICES.CORE,
        `/accounts/debit/${accountId}/operations?page=1&size=20`
      );

      setOperations(data?.content ?? []);
    } catch (err: any) {
      handleError(err);
    }
  }, [accountId]);

  const reload = useCallback(async () => {
    await Promise.all([loadAccount(), loadOperations()]);
  }, [loadAccount, loadOperations]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!accountId) return;

    const disconnect = connectAccountOperationsWs({
      accountId,
      onInvalidated: () => loadOperations(),
      onError: (m) => console.error(m),
    });

    return () => disconnect();
  }, [accountId, loadOperations]);

  return (
    <Box sx={{ width: "70%", mx: "auto", mt: 4 }}>
      <Link to="/accounts">← Назад</Link>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          {account?.status === "OPEN" && (
            <>
              <Button onClick={() => setOpenForm(true)}>Операции</Button>
              <Button onClick={() => setOpenForm2(true)}>Переводы</Button>
            </>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          {!account ? (
            <Typography>Загрузка...</Typography>
          ) : (
            <>
              <AccountCard account={account} />
              <AccountOperationsList operations={operations} />
            </>
          )}
        </Grid>
      </Grid>

      <OperationDebitForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onExchange={reload}
      />

      <ExchangeForm
        open={openForm2}
        onClose={() => setOpenForm2(false)}
        onExchange={reload}
      />
    </Box>
  );
};