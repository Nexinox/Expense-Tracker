<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { ExpensesRepeatTypeOptions, type ExpensesResponse } from '$lib/pocketbase-types';
	import { expenses } from '$lib/stores/Expenses';

	export let year: number;
	export let month: number;

	let expensesThisMonth: ExpensesResponse[] = [];
	expenses.subscribe((value) => {
		const daysInMonth = new Date(year, month, 0).getDate();
		if (!value) return;
		expensesThisMonth = [];
		value.forEach((expense) => {
			const dueOnDate = new Date(expense.dueOn);
			const dueOnMonth = dueOnDate.getMonth() + 1; // getMonth() returns 0-11
			const dueOnYear = dueOnDate.getFullYear();

			if (dueOnYear < year || (dueOnYear === year && dueOnMonth <= month)) {
				switch (expense.repeatType) {
					case ExpensesRepeatTypeOptions.DAILY:
						for (let i = 0; i < daysInMonth; i++) {
							expensesThisMonth = [...expensesThisMonth, expense];
						}
						break;
					case ExpensesRepeatTypeOptions.WEEKLY:
						for (let i = 0; i < daysInMonth; i += 7) {
							expensesThisMonth = [...expensesThisMonth, expense];
						}
						break;
					case ExpensesRepeatTypeOptions.MONTHLY:
						expensesThisMonth = [...expensesThisMonth, expense];
						break;
					case ExpensesRepeatTypeOptions.YEARLY:
						if (dueOnMonth === month) {
							expensesThisMonth = [...expensesThisMonth, expense];
						}
						break;
					case ExpensesRepeatTypeOptions.ONCE:
						if (dueOnMonth === month && dueOnYear === year) {
							expensesThisMonth = [...expensesThisMonth, expense];
						}
						break;
					case ExpensesRepeatTypeOptions.EVERY_X_DAYS:
						const unitsInBetweenDays = expense.unitsInBetween || 1;
						let dateCursor = new Date(dueOnDate);
						while (
							dateCursor.getFullYear() < year ||
							(dateCursor.getFullYear() === year && dateCursor.getMonth() + 1 <= month)
						) {
							if (dateCursor.getFullYear() === year && dateCursor.getMonth() + 1 === month) {
								expensesThisMonth = [
									...expensesThisMonth,
									{ ...expense, dueOn: dateCursor.toISOString() }
								];
							}
							dateCursor.setDate(dateCursor.getDate() + unitsInBetweenDays);
						}
						break;
					case ExpensesRepeatTypeOptions.EVERY_X_WEEKS:
						const unitsInBetweenWeeks = expense.unitsInBetween || 1;
						let dateCursorWeeks = new Date(dueOnDate);
						while (
							dateCursorWeeks.getFullYear() < year ||
							(dateCursorWeeks.getFullYear() === year && dateCursorWeeks.getMonth() + 1 <= month)
						) {
							if (
								dateCursorWeeks.getFullYear() === year &&
								dateCursorWeeks.getMonth() + 1 === month
							) {
								expensesThisMonth = [
									...expensesThisMonth,
									{ ...expense, dueOn: dateCursorWeeks.toISOString() }
								];
							}
							dateCursorWeeks.setDate(dateCursorWeeks.getDate() + unitsInBetweenWeeks * 7);
						}
						break;
					case ExpensesRepeatTypeOptions.EVERY_X_MONTHS:
						const unitsInBetweenMonths = expense.unitsInBetween || 1;
						let dateCursorMonths = new Date(dueOnDate);
						while (
							dateCursorMonths.getFullYear() < year ||
							(dateCursorMonths.getFullYear() === year && dateCursorMonths.getMonth() + 1 <= month)
						) {
							if (
								dateCursorMonths.getFullYear() === year &&
								dateCursorMonths.getMonth() + 1 === month
							) {
								expensesThisMonth = [
									...expensesThisMonth,
									{ ...expense, dueOn: dateCursorMonths.toISOString() }
								];
							}
							dateCursorMonths.setMonth(dateCursorMonths.getMonth() + unitsInBetweenMonths);
						}
						break;
					case ExpensesRepeatTypeOptions.EVERY_X_YEARS:
						const unitsInBetween = expense.unitsInBetween || 1;
						const timeDifference =
							expense.repeatType === ExpensesRepeatTypeOptions.EVERY_X_YEARS
								? year - dueOnYear
								: month - dueOnMonth;
						if (timeDifference % unitsInBetween === 0) {
							expensesThisMonth = [...expensesThisMonth, expense];
						}
						break;
				}
			}
		});
	});

	$: totalExpenses = expensesThisMonth.reduce((acc, expense) => acc + expense.amount, 0);

	function getMonthName(month: number) {
		switch (month) {
			case 1:
				return 'January';
			case 2:
				return 'Febuary';
			case 3:
				return 'March';
			case 4:
				return 'April';
			case 5:
				return 'May';
			case 6:
				return 'June';
			case 7:
				return 'July';
			case 8:
				return 'August';
			case 9:
				return 'September';
			case 10:
				return 'Oktober';
			case 11:
				return 'November';
			case 12:
				return 'December';
			default:
				return 'Error';
		}
	}

	function roundNumber(num: number) {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	}
</script>

<AuthCheck>
	<a
		href={`/overview/${year}/${month}`}
		class="card card-compact bg-base-100 m-6 w-full hover:bg-base-200"
	>
		<div class="flex flex-col card-body gap-6">
			<h1 class="text-3xl">{getMonthName(month)} {year}</h1>
			<div class="flex flex-row w-full">
				<div class="w-1/3">
					<p class="text-xl">Total Expenses:</p>
					<p class="text-2xl text-error">{roundNumber(totalExpenses)}{$currentUser?.currency}</p>
				</div>
				<div class="w-1/3">
					<p class="text-xl">Total Income:</p>
					<p class="text-2xl text-success">2000€</p>
				</div>
				<div class="w-1/3">
					<p class="text-xl">Funds left:</p>
					<p class="text-2xl text-primary">1000€</p>
				</div>
			</div>
		</div>
	</a>
</AuthCheck>
