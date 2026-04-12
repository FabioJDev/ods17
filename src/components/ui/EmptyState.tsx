import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

function EmptyIllustration() {
  return (
    <svg
      width="120"
      height="100"
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-4"
      aria-hidden="true"
    >
      {/* Folder body */}
      <rect x="15" y="30" width="90" height="55" rx="6" fill="#F0F4F8" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* Folder tab */}
      <path d="M15 36C15 32.686 17.686 30 21 30H45L51 22H21C17.686 22 15 24.686 15 28V36Z" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* Document lines */}
      <rect x="35" y="48" width="50" height="3" rx="1.5" fill="#D1D5DB" />
      <rect x="35" y="56" width="40" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="35" y="64" width="30" height="3" rx="1.5" fill="#E5E7EB" />
      {/* Search circle */}
      <circle cx="88" cy="25" r="14" fill="white" stroke="#00B4D8" strokeWidth="2" />
      <line x1="98" y1="35" x2="106" y2="43" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Question mark inside search */}
      <text x="88" y="30" textAnchor="middle" fill="#19486A" fontSize="14" fontWeight="700" fontFamily="Inter, system-ui">?</text>
      {/* Small decorative dots */}
      <circle cx="25" cy="18" r="2" fill="#56C02B" opacity="0.5" />
      <circle cx="110" cy="50" r="2.5" fill="#FD9D24" opacity="0.5" />
      <circle cx="10" cy="65" r="1.5" fill="#00B4D8" opacity="0.5" />
    </svg>
  );
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
      {Icon ? (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon size={28} className="text-gray-400" aria-hidden="true" />
        </div>
      ) : (
        <EmptyIllustration />
      )}
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#0D2137] transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
