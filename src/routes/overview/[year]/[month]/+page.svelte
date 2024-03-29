<script lang="ts">
  import DayOverviewComponent from './DayOverviewComponent.svelte';

	import { page } from '$app/stores';
	import { getExpensesInDay, getExpensesInMonth } from '$lib/ExpenseUtils';
	import { getIncomesInMonth, getIncomessInDay } from '$lib/IncomeUtils';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import type {
		ExpensesResponse,
		IncomesResponse
	} from '$lib/pocketbase-types';
	import { expenses } from '$lib/stores/Expenses';
	import { incomes } from '$lib/stores/Incomes';

	let year: number = Number($page.params.year);
	let month: number = Number($page.params.month);

	let incomesThisMonth: IncomesResponse[] = [];
	let expensesThisMonth: ExpensesResponse[] = [];

	incomes.subscribe((value: IncomesResponse[]) => {
		if (!value) return;
		incomesThisMonth = [];
		getIncomesInMonth(value, year, month).forEach((incomeInMonth) => {
			incomesThisMonth.push(incomeInMonth);
		});
	});

	expenses.subscribe((value: ExpensesResponse[]) => {
		if (!value) return;
		expensesThisMonth = [];
		getExpensesInMonth(value, year, month).forEach((expenseInMonth) => {
			expensesThisMonth.push(expenseInMonth);
		});
	});

	class Day {
		date: number = 0;
		incomes: IncomesResponse[] = [];
		expenses: ExpensesResponse[] = [];
	}

	let daysInMonth = new Date(year, month+1, 0).getDate();
	let daysInMonthAsArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	$: importantDays = daysInMonthAsArray.map((day) => {
		let dayObj = new Day();
		dayObj.date = day;
		dayObj.incomes = getIncomessInDay($incomes, year, month, day);
		dayObj.expenses = getExpensesInDay($expenses, year, month, day);
		if (dayObj.incomes.length === 0 && dayObj.expenses.length === 0) return ;
		return dayObj;
	}).filter((day) => day !== undefined) as Day[]; 

</script>

<AuthCheck>
	<div class="flex flex-col w-full gap-6">
		<div class="flex flex-row mt-6 ml-2">
			<a href="/overview" class="btn btn-circle  btn-primary lg:hidden visible">
				<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 24 24"><title>keyboard-backspace</title><path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" /></svg>
			</a>
			<h1 class="text-2xl lg:text-4xl text-center mt-2 mx-auto"> Übersicht {month + 1 < 10 ? '0' + (month + 1) : month + 1}.{year}</h1>
		</div>

        {#each importantDays as day}
			<DayOverviewComponent {day} {year} {month} />
		{/each}
	</div>
</AuthCheck>