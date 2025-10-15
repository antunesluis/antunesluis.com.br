import {
  format,
  formatDistanceToNow as dateFnsFormatDistanceToNow,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatFullDateTime(rawDate: string): string {
  const date = new Date(rawDate);
  return format(date, "dd/MM/yyyy 'às' HH'h'mm", { locale: ptBR });
}

export function formatShortDate(rawDate: string): string {
  const date = new Date(rawDate);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDistanceToNow(rawDate: string): string {
  const date = new Date(rawDate);
  return dateFnsFormatDistanceToNow(date, { locale: ptBR, addSuffix: true });
}

export function getYearFromDate(rawDate: string): number {
  return new Date(rawDate).getFullYear();
}
