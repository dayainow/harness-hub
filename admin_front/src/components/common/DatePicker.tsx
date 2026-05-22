interface DatePickerProps {
  selectedDate?: string; // Format: "2024-01-01"
  onDateChange: (date: string) => void;
  label?: string;
}

export function DatePicker({
  selectedDate,
  onDateChange,
}: DatePickerProps) {
  const handleChange = (date: string) => {
    if (!date) return;
    onDateChange(date);
  };

  return (
    <div>
      <input
        type="date"
        value={selectedDate || ''}
        onChange={(e) => handleChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}