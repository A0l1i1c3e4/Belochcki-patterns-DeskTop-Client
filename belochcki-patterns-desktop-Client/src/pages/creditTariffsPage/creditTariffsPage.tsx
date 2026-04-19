import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import DataTable from "../../entities/DataTable";
import CreditTariffForm from "../../entities/tariffs/CreditTariffForm";
import { apiRequest } from "../../shared/api/ApiClient";
import { SERVICES } from "../../types/Services";

export default function CreditTariffsPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const handleError = (err: any) => {
    if (err?.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (err?.status === 503) {
      console.warn("TARIFFS circuit open");
      return;
    }

    console.error("Tariffs error", err);
  };

  const load = async () => {
    try {
      const res = await apiRequest<any[]>(
        SERVICES.CREDITS,
        `/tariffs/credit`
      );
      setData(res ?? []);
    } catch (err: any) {
      handleError(err);
    }
  };

  const handleSubmit = async (tariff: any) => {
    try {
      if (creating) {
        await apiRequest(
          SERVICES.CREDITS,
          `/tariffs/credit`,
          { method: "POST", body: tariff }
        );
      } else {
        await apiRequest(
          SERVICES.CREDITS,
          `/tariffs/credit/${editing.id}`,
          { method: "PUT", body: tariff }
        );
      }

      setEditing(null);
      setCreating(false);
      load();
    } catch (err: any) {
      handleError(err);
    }
  };

  const filtered = data.filter((u) => {
    const s = search.toLowerCase();
    return (
      (u.id && u.id.toLowerCase().includes(s)) ||
      (u.name && u.name.toLowerCase().includes(s))
    );
  });

  useEffect(() => {
    load();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Кредитные тарифы</Typography>

      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <TextField
          label="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Button variant="contained" sx={{ my: 2 }} onClick={() => setCreating(true)}>
        Взять кредит
      </Button>

      {(creating || editing) && (
        <CreditTariffForm
          initialData={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <DataTable
        data={filtered}
        columns={[
          { field: "id", label: "id" },
          { field: "name", label: "Название" },
          { field: "description", label: "Описание" },
          { field: "amountFrom", label: "Цена от" },
          { field: "amountTo", label: "Цена до" },
          { field: "interestRate", label: "Процент %" },
        ]}
      />
    </Box>
  );
}