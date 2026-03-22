import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import DataTable from "../../entities/DataTable";
import CreditTariffForm from "../../entities/tariffs/CreditTariffForm";
import { creditTariffUseCase } from "../../useCases/CreditTariffUseCase";


export default function CreditTariffsPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const res = await creditTariffUseCase.getTariffs();
    setData(res);
  };

  const filtered = data.filter((u) => {
    const searchValue = search.toLowerCase();

    return (
      (u.id && u.id.toLowerCase().includes(searchValue)) ||
      (u.name && u.name.toLowerCase().includes(searchValue))
    );
  });

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (tariff: any) => {
    if (creating) await creditTariffUseCase.create(tariff);
    else await creditTariffUseCase.update(editing.id, tariff);

    setEditing(null);
    setCreating(false);
    load();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Кредитные тарифы</Typography>

      <Box sx={{ display: "flex", gap: 2, my: 2, alignItems: "center" }}>
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