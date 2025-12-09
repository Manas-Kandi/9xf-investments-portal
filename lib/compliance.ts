export function getNextAnnualReportDue(fiscalYearEnd: string = '12-31'): Date {
  const [month, day] = fiscalYearEnd.split('-').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // 1. Check if we are still waiting for the due date from the Previous Year's FYE
  // e.g. Today is Feb 2025. Last FYE was Dec 31, 2024. Due April 30, 2025.
  const prevYearFye = new Date(currentYear - 1, month - 1, day);
  const prevYearDue = new Date(prevYearFye);
  prevYearDue.setDate(prevYearDue.getDate() + 120);
  
  if (prevYearDue > now) {
    return prevYearDue;
  }
  
  // 2. Check if we are waiting for due date from Current Year's FYE
  // e.g. Today is May 2025. Last FYE was Dec 31, 2024 (Due date passed).
  // Current FYE is Dec 31, 2025. Due April 30, 2026.
  
  // Or: Today is Feb 2025. FYE is Jan 31.
  // Current FYE Jan 31, 2025. Due May 31, 2025.
  const currYearFye = new Date(currentYear, month - 1, day);
  const currYearDue = new Date(currYearFye);
  currYearDue.setDate(currYearDue.getDate() + 120);
  
  if (currYearDue > now) {
    return currYearDue;
  }
  
  // 3. Fallback to Next Year's FYE
  const nextYearFye = new Date(currentYear + 1, month - 1, day);
  const nextYearDue = new Date(nextYearFye);
  nextYearDue.setDate(nextYearDue.getDate() + 120);
  
  return nextYearDue;
}

export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
