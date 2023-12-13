export function translateRepeatType(repeatType: string, unitsInBetween?: number) {
  switch (repeatType) {
    case "DAILY":
      return "Täglich";
    case "WEEKLY":
      return "Wöchentlich";
    case "MONTHLY":
      return "Monatlich";
    case "YEARLY":
      return "Jährlich";
    case "EVERY_X_DAYS":
      return `Alle ${unitsInBetween ?? "X"} Tage`;
    case "EVERY_X_WEEKS":
      return `Alle ${unitsInBetween ?? "X"} Wochen`;
    case "EVERY_X_MONTHS":
      return `Alle ${unitsInBetween ?? "X"}  Monate`;
    case "EVERY_X_YEARS":
      return `Alle ${unitsInBetween ?? "X"} Jahre`;
    default:
      return "Einmalig";
  }

}