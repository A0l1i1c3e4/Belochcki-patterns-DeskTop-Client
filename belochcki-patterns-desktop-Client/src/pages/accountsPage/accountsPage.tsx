import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Pagination, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Account, AccountsResponse } from "../../shared/api/account/accounts";
import { fetchDebitAccounts, fetchCreditAccounts } from "../../shared/api/account/accounts";
import { AccountCard, CreditAccountCard } from "../../entities/account/accountCard";
import { CreateDebitForm } from "../../features/createDebitAccount/createDebitAccount";
import {
  getOrCreateUserSettings,
  updateHiddenAccounts,
} from "../../shared/api/userSettings/userSettings";

export const AccountsPage = () => {
  const [debitAccounts, setDebitAccounts] = useState<Account[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<Account[]>([]);
  const [hiddenAccountIds, setHiddenAccountIds] = useState<string[]>([]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openForm, setOpenForm] = useState(false);

  const pageSize = 200;
  const navigate = useNavigate();

  const handleRequestError = (err: any) => {
    const status = err.response?.status;
    if (status === 401) navigate("/login");
    else if (status === 500) navigate("/error-500");
    else console.error("Неизвестная ошибка", err);
  };

  const loadDebitAccounts = async () => {
    try {
      const data: Account[] = await fetchDebitAccounts();
      setDebitAccounts(data);
    } catch (err: any) {
      handleRequestError(err);
    }
  };

  const loadCreditAccounts = async () => {
    try {
      const data: Account[] = await fetchCreditAccounts();
      setCreditAccounts(data);
    } catch (err: any) {
      handleRequestError(err);
    }
  };

  const loadUserSettings = async () => {
    try {
      const settings = await getOrCreateUserSettings();
      setHiddenAccountIds(settings.hiddenAccountIds ?? []);
    } catch (err: any) {
      handleRequestError(err);
    } finally {
      setSettingsLoaded(true);
    }
  };

  useEffect(() => {
    loadUserSettings();
  }, []);

  useEffect(() => {
    loadDebitAccounts();
    loadCreditAccounts();
  }, [page]);

  const hiddenAccounts = useMemo(
    () => [...debitAccounts, ...creditAccounts].filter((account) => hiddenAccountIds.includes(account.id)),
    [debitAccounts, creditAccounts, hiddenAccountIds]
  );

  const visibleDebitAccounts = useMemo(
    () => debitAccounts.filter((account) => !hiddenAccountIds.includes(account.id)),
    [debitAccounts, hiddenAccountIds]
  );

  const visibleCreditAccounts = useMemo(
    () => creditAccounts.filter((account) => !hiddenAccountIds.includes(account.id)),
    [creditAccounts, hiddenAccountIds]
  );

  const hiddenDebitOnPage = debitAccounts.length - visibleDebitAccounts.length;
  const totalPages = Math.max(1, Math.ceil((total - hiddenDebitOnPage) / pageSize));

  const hideAccount = async (accountId: string) => {
    const nextHiddenIds = Array.from(new Set([...hiddenAccountIds, accountId]));

    try {
      const response = await updateHiddenAccounts(nextHiddenIds);
      setHiddenAccountIds(response.hiddenAccountIds ?? nextHiddenIds);
    } catch (err: any) {
      handleRequestError(err);
    }
  };

  const restoreAccount = async (accountId: string) => {
    const nextHiddenIds = hiddenAccountIds.filter((id) => id !== accountId);

    try {
      const response = await updateHiddenAccounts(nextHiddenIds);
      setHiddenAccountIds(response.hiddenAccountIds ?? nextHiddenIds);
    } catch (err: any) {
      handleRequestError(err);
    }
  };

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
      <Button
        variant="contained"
        sx={{ width: "50%" }}
        fullWidth
        onClick={() => setOpenForm(true)}
      >
        Открыть новый дебетовый счёт
      </Button>

      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Дебетовые счета
          </Typography>

          {!settingsLoaded ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              Загрузка настроек...
            </Typography>
          ) : visibleDebitAccounts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              Дебетовые счета не найдены
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {visibleDebitAccounts.map((account) => (
                <Grid size={{ xs: 12 }} key={account.id}>
                  <AccountCard
                    account={account}
                    actionLabel="Скрыть"
                    onActionClick={hideAccount}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                page={Math.min(page, totalPages)}
                count={totalPages}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Кредитные счета
          </Typography>

          {visibleCreditAccounts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              У вас нет доступных кредитных счетов.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {visibleCreditAccounts.map((account) => (
                <Grid size={{ xs: 12 }} key={account.id}>
                  <CreditAccountCard
                    account={account}
                    actionLabel="Скрыть"
                    onActionClick={hideAccount}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" sx={{ mb: 2 }}>
            Скрытые счета
          </Typography>

          {hiddenAccounts.length === 0 ? (
            <Typography variant="body2">Скрытых счетов пока нет.</Typography>
          ) : (
            <Grid container spacing={2}>
              {hiddenAccounts.map((account) => {
                const CardComponent =
                  account.type === "CREDIT" ? CreditAccountCard : AccountCard;

                return (
                  <Grid size={{ xs: 12 }} key={account.id}>
                    <CardComponent
                      account={account}
                      actionLabel="Вернуть"
                      onActionClick={restoreAccount}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        <CreateDebitForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onDebitCreated={loadDebitAccounts}
        />
      </Box>
    </Box>
  );
};