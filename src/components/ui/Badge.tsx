type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

const VARIANTS: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  error:   'bg-red-100 text-red-800',
  warning: 'bg-orange-100 text-orange-800',
  info:    'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]} ${className}`}>
      {label}
    </span>
  );
}

export function estadoBadge(estado: string) {
  const map: Record<string, BadgeVariant> = {
    Activo: 'success', Inactivo: 'neutral',
    Disponible: 'success', Asignado: 'info', 'En proceso': 'warning',
  };
  return <Badge label={estado} variant={map[estado] ?? 'neutral'} />;
}

export function tipoBadge(tipo: string) {
  const map: Record<string, BadgeVariant> = {
    Gobierno: 'info', ONG: 'success', Empresa: 'warning', 'Organismo Internacional': 'info',
    'Donación': 'success', 'Préstamo': 'warning', 'Inversión': 'info',
  };
  return <Badge label={tipo} variant={map[tipo] ?? 'neutral'} />;
}
