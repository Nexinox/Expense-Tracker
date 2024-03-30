import type { ExpensesResponse } from "$lib/pocketbase-types";
import { ExpensesRecurringTypeOptions } from "$lib/pocketbase-types";

export function amountDueInMonth(expense: ExpensesResponse, year: number, month: number): number {
    
    const dueDate = new Date(expense.dueOn);
    const dueYear = dueDate.getFullYear();
    const dueMonth = dueDate.getMonth();
    const dueDay = dueDate.getDate();

    let amountDue = 0;

    if ((year < dueYear) || (year === dueYear && month < dueMonth)) return amountDue;

    // If the expense is a one-time expense and the start date is in the given month, the amount is due
    if (expense.recurringType === ExpensesRecurringTypeOptions.ONCE && dueYear === year && dueMonth === month) {
        amountDue = expense.amount;
    }

    // If the expense is a daily expense, calculate the amount due based on the number of days in the month
    else if (expense.recurringType === ExpensesRecurringTypeOptions.DAILY) {
        const daysInMonth = new Date(year, month+1, 0).getDate();
        if (new Date(year, month).getMonth() == dueMonth && new Date(year, month).getFullYear() == dueYear) {
            amountDue = expense.amount * Math.floor((daysInMonth - dueDay + 1) / expense.interval);
        }else{
            amountDue = expense.amount * Math.floor(daysInMonth / expense.interval);
        }
    }

    // If the expense is a weekly expense, calculate the amount due based on the number of weeks in the month
    else if (expense.recurringType === ExpensesRecurringTypeOptions.WEEKLY) {
        const weeksInMonth = getWeeksInMonth(year, month);
        if (new Date(year, month).getMonth() == dueMonth && new Date(year, month).getFullYear() == dueYear) {
            amountDue = expense.amount * Math.floor((weeksInMonth - Math.floor(dueDay / 7)-1) / expense.interval);
        }else{
            amountDue = expense.amount * (Math.floor(weeksInMonth / expense.interval) > 4 ? 4 : Math.floor(weeksInMonth / expense.interval));
        }
    }

    // If the expense is a monthly expense and the start date is before the given month, the amount is due
    else if (expense.recurringType === ExpensesRecurringTypeOptions.MONTHLY) {
        const monthsSinceStart = (year - dueYear) * 12 + month - dueMonth;
        if (monthsSinceStart >= 0 && monthsSinceStart % expense.interval === 0) {
            amountDue = expense.amount;
        }
    }

    // If the expense is a yearly expense and the start date is in the given month, the amount is due
    else if (expense.recurringType === ExpensesRecurringTypeOptions.YEARLY && dueMonth === month) {
        const yearsSinceStart = year - dueYear;
        if (yearsSinceStart % expense.interval === 0) {
            amountDue = expense.amount;
        }
    }

    return amountDue;
}

// Method to calculate the amount due in a certain day of a year
export function amountDueInDay(expense: ExpensesResponse, year: number, month: number, day: number): number {
    const dueDate = new Date(expense.dueOn);
    const dueYear = dueDate.getFullYear();
    const dueMonth = dueDate.getMonth();
    const dueDay = dueDate.getDate();
    const dueTime = dueDate.getTime();

    let amountDue = 0;
    if ((year < dueYear ) ||
        (year == dueYear && month < dueMonth) ||
        (year == dueYear && month == dueMonth && day < dueDay)) return amountDue;
    // If the expense is a one-time expense and the start date is on the given day, the amount is due
    if (expense.recurringType === ExpensesRecurringTypeOptions.ONCE && dueYear === year && dueMonth === month && dueDay === day) {
        amountDue = expense.amount;
    }

    // If the expense is a daily expense, the amount is due
    else if (expense.recurringType === ExpensesRecurringTypeOptions.DAILY) {
        const daysSinceStart = Math.floor((new Date(year, month, day).getTime() - dueTime) / (1000 * 60 * 60 * 24));
        if ((daysSinceStart - 1) % expense.interval === 0) {
            amountDue = expense.amount;
        }
    }

    // If the expense is a weekly expense and the start date is before the given day, the amount is due
    else if (expense.recurringType === ExpensesRecurringTypeOptions.WEEKLY) {
        const weeksSinceStart = Math.floor((new Date(year, month, day).getTime() - dueTime) / (1000 * 60 * 60 * 24 * 7));
        if ((weeksSinceStart - 1) % expense.interval === 0) {
            amountDue = expense.amount;
        }
    }

    // If the expense is a monthly expense and the start date is on the given day, the amount is due
    else if (expense.recurringType === ExpensesRecurringTypeOptions.MONTHLY && dueDay === day) {
        const monthsSinceStart = (year - dueYear) * 12 + month - dueMonth;
        if (monthsSinceStart % expense.interval === 0) {
            amountDue = expense.amount;
        }
    }

    // If the expense is a yearly expense and the start date is on the given day, the amount is due
    else if (expense.recurringType === ExpensesRecurringTypeOptions.YEARLY && dueMonth === month && dueDay === day) {
        const yearsSinceStart = year - dueYear;
        if (yearsSinceStart % expense.interval === 0) {
            amountDue = expense.amount;
        }
    }

    return amountDue;
}

export function getExpensesInMonth(expenses: ExpensesResponse[], year: number, month: number): ExpensesResponse[] {
    return expenses.filter(expense => amountDueInMonth(expense, year, month) > 0);
}

export function getExpensesInDay(expenses: ExpensesResponse[], year: number, month: number, day: number): ExpensesResponse[] {
    return expenses.filter(expense => amountDueInDay(expense, year, month, day) > 0);
}

// Helper method to calculate the number of weeks in a month
function getWeeksInMonth(year: number, month: number): number {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate the number of weeks in the month
    const weeksInMonth = Math.ceil((firstDayOfMonth + daysInMonth) / 7);

    return weeksInMonth;
}

export function dateToIsoString(date: Date): string {
    return `${date.getDate() < 10 ? "0"+date.getDate() : date.getDate()}.${(date.getMonth() + 1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1}.${date.getFullYear()}`;
}