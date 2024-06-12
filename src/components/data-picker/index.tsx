import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";

export type TextFieldOnChangeEventType = {
  target: { id?: string; value: string };
};

interface CustomDatePickerProps {
  value: string | Date;
  label: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CustomDatePicker({ label, value, disabled, onChange }: CustomDatePickerProps) {
  const dateValue = typeof value === "string" ? parse(value.substring(0, 10), "yyyy-MM-dd", new Date()) : value;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        sx={{ width: "100%" }}
        label={label}
        disabled={disabled}
        format="dd/MM/yyyy"
        value={dateValue}
        slotProps={{ textField: { size: "small" } }}
        onChange={(value: Date | null) =>
          onChange(format(value !== null ? value : Date.now(), "yyyy-MM-dd") + "T23:59:59")
        }
      />
    </LocalizationProvider>
  );
}
