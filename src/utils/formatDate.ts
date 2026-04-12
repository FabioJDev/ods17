import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMM yyyy', { locale: es });
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy');
}
