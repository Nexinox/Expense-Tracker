import { type IncomesResponse, IncomesTypeOptions } from "./pocketbase-types";

// a function that calculates the ammount recieved in a month for a given income
// income: the income to calculate of type IncomesResponse
// year: the year to calculate for as a number
// month: the month to calculate for as a number 
// incomes: a list of all incomes of type IncomesResponse[]
// returns: the amount recieved in the month

// there are 3 types of incomes
// ONCE: the income is recieved once on a specific date
// MONTHLY: the income is recieved every month on a specific date
// AVERAGE_OF_GROUP: is the average of all incomes in the group, 

// income has the following fields
// type: the type of income is of type IncomesTypeOptions wich is an enum with the values ONCE, MONTHLY, AVERAGE_OF_GROUP
// amount: the amount of the income as a number that is greater than 0 and may be a decimal
// incomeOn: the date the income is recieved is a string in the format "YYYY-MM-DD"
// group: the group the income belongs to is a string

// if the incomes incomeOn date is before the month, it should return 0
// if the income type is AVERAGE_OF_GROUP, it should return 0 if there are already incomes in the group for the month
// if the income type is AVERAGE_OF_GROUP, it should return the average of all incomes in the group for the month
// if the income type is ONCE, it should return the amount if the income is recieved in the month
// if the income type is MONTHLY, and the month and year are after the incomeOn date, it should return the amount

export function calculateIncomeForMonth(income: IncomesResponse, year: number, month: number, incomes: IncomesResponse[]): number {

    // get the month and year of the income
    const incomeDate = new Date(income.incomeOn);
    const incomeYear = incomeDate.getFullYear();
    const incomeMonth = incomeDate.getMonth();
    // if the income is before the month, return 0
    if (incomeYear > year || (year === incomeYear && incomeMonth  > month)) {
        return 0;
    }
    // if the income is of type AVERAGE_OF_GROUP
    if (income.type === IncomesTypeOptions.AVERAGE_OF_GROUP) {
        // get all incomes in the group
        const groupIncomes = incomes.filter((x) => x.group === income.group && x.type !== IncomesTypeOptions.AVERAGE_OF_GROUP);
        // if there are already incomes in the group for the month, return 0
        if (groupIncomes.some((x) => new Date(x.incomeOn).getFullYear() === year && new Date(x.incomeOn).getMonth() === month)) {
            return 0;
        }
        // return the average of all incomes in the group
        return groupIncomes.reduce((acc, x) => acc + x.amount, 0) / groupIncomes.length;
    }

    // if the income is of type ONCE
    if (income.type === IncomesTypeOptions.ONCE) {
        // if the income is recieved in the month, return the amount
        if (year === incomeYear && month === incomeMonth) {
            return income.amount;
        }
    }

    // if the income is of type MONTHLY
    if (income.type === IncomesTypeOptions.MONTHLY) {
        // if the month and year are after the incomeOn date, return the amount
        if (year > incomeYear || (year === incomeYear && month >= incomeMonth)) {
            return income.amount;
        }
    }

    return 0;

}

// function that does the same as calculateIncomeForMonth but for days
// takes an extra parameter day wich is a number

export function calculateIncomeForDay(income: IncomesResponse, year: number, month: number, day: number, incomes: IncomesResponse[]): number {
    // get the month and year of the income
    const incomeDate = new Date(income.incomeOn);
    const incomeYear = incomeDate.getFullYear();
    const incomeMonth = incomeDate.getMonth();
    const incomeDay = incomeDate.getDate()
    // if the income is before the month, return 0
    if (incomeYear > year || (incomeYear === year&& incomeMonth > month) || (incomeYear === year && incomeMonth === month && incomeDay > day)) {
        return 0;
    }

    // if the income is of type AVERAGE_OF_GROUP
    if (income.type === IncomesTypeOptions.AVERAGE_OF_GROUP) {
        if (incomeDay === day) {
            // get all incomes in the group
            const groupIncomes = incomes.filter((x) => x.group === income.group && x.type !== IncomesTypeOptions.AVERAGE_OF_GROUP);
            // if there are already incomes in the group for the month, return 0
            if (groupIncomes.some((x) => new Date(x.incomeOn).getFullYear() === year && new Date(x.incomeOn).getMonth() === month)) {
                return 0;
            }
            // return the average of all incomes in the group
            return groupIncomes.reduce((acc, x) => acc + x.amount, 0) / groupIncomes.length;
        }
        return 0;
    }

    // if the income is of type ONCE
    if (income.type === IncomesTypeOptions.ONCE) {
        // if the income is recieved in the month, return the amount
        if (year === incomeYear && month === incomeMonth && day === incomeDay) {
            return income.amount;
        }
    }

    // if the income is of type MONTHLY
    if (income.type === IncomesTypeOptions.MONTHLY) {
        // if the month and year are after the incomeOn date, return the amount
        if (day == incomeDay) {
            return income.amount;
        }
    }

    return 0;

}

export function getIncomesInMonth(incomes: IncomesResponse[], year: number, month: number): IncomesResponse[] {
    const result: IncomesResponse[]= [];
    incomes.forEach(income => {
        const tempIncome = { ...income };
        const sum = calculateIncomeForMonth(income, year, month, incomes);
        if (sum === 0) return;
        if (income.type === IncomesTypeOptions.AVERAGE_OF_GROUP) tempIncome.amount = sum;
        result.push(tempIncome);
    });
    return result;
}

export function getIncomessInDay(incomes: IncomesResponse[], year: number, month: number, day: number): IncomesResponse[] {
    const result: IncomesResponse[]= [];
    incomes.forEach(income => {
        const tempIncome = { ...income };
        const sum = calculateIncomeForDay(income, year, month, day, incomes);
        if (sum === 0) return;
        if (income.type === IncomesTypeOptions.AVERAGE_OF_GROUP) tempIncome.amount = sum;
        result.push(tempIncome);
    });
    return result;
}