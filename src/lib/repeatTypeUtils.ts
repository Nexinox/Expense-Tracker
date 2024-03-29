export function translateRepeatType(repeatType: string, interval?: number) {
  switch (repeatType) {
    case "DAILY":
      if (interval && interval > 1) return `Alle ${interval} Tage`;	
      return "Täglich";
    case "WEEKLY":
      if (interval && interval > 1) return `Alle ${interval} Wochen`;
      return "Wöchentlich";
    case "MONTHLY":
      if (interval && interval > 1) return `Alle ${interval} Monate`;
      return "Monatlich";
    case "YEARLY":
      if (interval && interval > 1) return `Alle ${interval} Jahre`;
      return "Jährlich";
    case "AVERAGE_OF_GROUP":
      return "Durchschnitt der Gruppe";
    default:
      return "Einmalig";
  }

}