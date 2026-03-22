import { useEffect, useMemo, useState } from "react";
import {Box,Grid,Pagination,Typography,Button,Paper,Divider,Chip,Stack,} from "@mui/material";
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
        width: "100%",
        maxWidth: "1440px",
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          mb: 4,
        })}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Мои счета
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Управление дебетовыми, кредитными и скрытыми счетами
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => setOpenForm(true)}
            sx={{ borderRadius: 3, px: 3, alignSelf: { xs: "stretch", md: "auto" } }}
          >
            Открыть новый дебетовый счёт
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              height: "100%",
            })}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Дебетовые счета
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Основные счета для ежедневных операций
                </Typography>
              </Box>

              <Chip
                label={`Видимых: ${visibleDebitAccounts.length}`}
                color="primary"
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {!settingsLoaded ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  Загрузка настроек...
                </Typography>
              </Box>
            ) : visibleDebitAccounts.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Дебетовые счета не найдены
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  У вас пока нет доступных дебетовых счетов на этой странице.
                </Typography>
              </Box>
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
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={(theme) => ({
                p: 3,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              })}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Кредитные счета
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Доступные кредитные продукты
                  </Typography>
                </Box>

                <Chip
                  label={`Видимых: ${visibleCreditAccounts.length}`}
                  color="secondary"
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {visibleCreditAccounts.length === 0 ? (
                <Box sx={{ py: 5, textAlign: "center" }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Нет доступных кредитных счетов
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Все кредитные счета скрыты или отсутствуют.
                  </Typography>
                </Box>
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
            </Paper>

            <Paper
              elevation={0}
              sx={(theme) => ({
                p: 3,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              })}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Скрытые счета
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Здесь можно вернуть скрытые счета обратно
                  </Typography>
                </Box>

                <Chip
                  label={`Скрыто: ${hiddenAccounts.length}`}
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {hiddenAccounts.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Скрытых счетов пока нет.
                  </Typography>
                </Box>
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
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <CreateDebitForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onDebitCreated={loadDebitAccounts}
      />
    </Box>
  );
};