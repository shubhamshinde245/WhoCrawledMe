'use client';

interface TimeRangeFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const timeRanges = [
  { value: '24h', label: 'Last 24 Hours', icon: '🕐' },
  { value: '7d', label: 'Last 7 Days', icon: '📅' },
  { value: '30d', label: 'Last 30 Days', icon: '📊' },
];

export default function TimeRangeFilter({ selectedRange, onRangeChange }: TimeRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${
              selectedRange === range.value
                ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <span className="text-base">{range.icon}</span>
          <span>{range.label}</span>
        </button>
      ))}
    </div>
  );
}