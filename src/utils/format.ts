/**
 * Format a number as FCFA (West African CFA franc)
 * e.g. 1500000 → "1 500 000 FCFA"
 */
export function formatFCFA(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  );
}

/**
 * Compact format for KPI display
 * e.g. 1500000 → "1,5M FCFA"  |  750000 → "750K FCFA"
 */
export function formatFCFACompact(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  if (Math.abs(amount) >= 1_000_000) {
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(amount / 1_000_000) + "M FCFA"
    );
  }
  if (Math.abs(amount) >= 1_000) {
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(amount / 1_000) + "K FCFA"
    );
  }
  return formatFCFA(amount);
}
