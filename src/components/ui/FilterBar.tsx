import { Search } from 'lucide-react';

interface FilterOption { value: string; label: string; }
interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  filters?: { label: string; value: string; options: FilterOption[]; onChange: (v: string) => void }[];
  placeholder?: string;
}

export default function FilterBar({ search, onSearch, filters = [], placeholder = 'Buscar...' }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="relative flex-1 min-w-0">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="input-field pl-10"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="input-field !w-auto min-w-[120px] cursor-pointer"
            aria-label={`Filtrar por ${f.label}`}
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
