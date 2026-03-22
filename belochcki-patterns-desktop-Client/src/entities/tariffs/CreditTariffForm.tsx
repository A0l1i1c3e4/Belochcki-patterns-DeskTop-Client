import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import type { CreditRequest } from "../types/CreditTariff";

interface Props {
  initialData?: CreditRequest;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CreditTariffForm({ initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    id: initialData?.id || "",
    amount: initialData?.amount || 0,
  });

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField label="Tariff ID" value={form.id} onChange={(e) => handleChange("name", e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Amount" type="number" value={form.amount} onChange={(e) => handleChange("amountFrom", Number(e.target.value))} fullWidth sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => onSubmit(form)}>Взять</Button>
        <Button variant="outlined" onClick={onCancel}>Закрыть</Button>
      </Box>
    </Box>
  );
}