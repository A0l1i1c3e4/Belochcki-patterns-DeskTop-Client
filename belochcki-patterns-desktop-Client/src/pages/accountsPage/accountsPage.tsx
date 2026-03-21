import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { Box, Grid, Pagination, Typography} from "@mui/material";
import type {Account, AccountsResponse} from "../../shared/api/accounts";
import { fetchDebitAccounts } from "../../shared/api/accounts";

export const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 6;
  const navigate = useNavigate();
  
  const loadAccounts = async () => {
    try {
      const data: AccountsResponse = await fetchDebitAccounts(page, pageSize);

      setAccounts(data?.content ?? []);
      setTotal(data.totalPages);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) navigate("/login");
      else if (status === 500) navigate("/error-500");
      else console.error("Неизвестная ошибка при загрузке постов", err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [page]);
  
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" , flexDirection: "column", width: "70%"}}>
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
              <Box sx={{ flex: 1 }}>
                {accounts.length === 0 ? (
                  <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
                    Дебетовые счета не найдены
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {accounts.map(account => (
                      <Grid size={{ xs: 12 }} key={account.id}>
                        <AccountCard account={account} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
              {totalPages > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    page={page}
                    count={totalPages}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

