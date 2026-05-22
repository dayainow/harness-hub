interface MonthPickerProps {
  selectedMonth?: string; // Format: "2024-01"
  onMonthChange: (month: string, minDate: string, maxDate: string) => void;
  label?: string;
}

export function MonthPicker({
  selectedMonth,
  onMonthChange,
}: MonthPickerProps) {
  const handleChange = (month: string) => {
    if (!month) return;

    const [year, monthNum] = month.split('-');
    const firstDay = `${year}-${monthNum}-01`;

    // Day 0 of the next month = last day of the current month
    const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const lastDayStr = `${year}-${monthNum}-${String(lastDay).padStart(2, '0')}`;

    onMonthChange(month, firstDay, lastDayStr);
  };

  return (
    <div>
      <input
        type="month"
        value={selectedMonth || ''}
        onChange={(e) => handleChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}