<script lang="ts">
	import { amountDueInMonth } from '$lib/ExpenseUtils';
	import { calculateIncomeForMonth } from '$lib/IncomeUtils';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { IncomesTypeOptions } from '$lib/pocketbase-types';
	import { expenses } from '$lib/stores/Expenses';
	import { incomes } from '$lib/stores/Incomes';

	export let year: number;
	export let month: number;

	let totalExpenses: number = 0;
	expenses.subscribe((value) => {
		if (!value) return;
		value.forEach((expense) => {
			totalExpenses += amountDueInMonth(expense, year, month);
		});
	});
	let totalIncome: number = 0;
	incomes.subscribe((value) => {
		if (!value) return;
		value.forEach((income) => {
			const ammount = calculateIncomeForMonth(income, year, month, value);
			totalIncome += ammount;

			return;
			if(income.type === IncomesTypeOptions.MONTHLY){
				// if the month and year are before the incomeOn date, then we ignore it
				if(new Date(income.incomeOn).getFullYear() > year || (new Date(income.incomeOn).getFullYear() === year && new Date(income.incomeOn).getMonth() > month)){
					console.log('ignoring', income);
					return;
				}
				totalIncome += income.amount;
			}else if (income.type === IncomesTypeOptions.ONCE && new Date(income.incomeOn).getMonth() === month && new Date(income.incomeOn).getFullYear() === year) {
				totalIncome += income.amount;
			}else if (income.type === IncomesTypeOptions.AVERAGE_OF_GROUP){

				// if the month and year are before the incomeOn date, then we ignore it
				if(new Date(income.incomeOn).getFullYear() > year || (new Date(income.incomeOn).getFullYear() === year && new Date(income.incomeOn).getMonth() > month)){
					return;
				}

				const incomesInGroupThisMonth = value.filter((i) => i.group === income.group)
					.filter((i)=>new Date(i.incomeOn).getFullYear() === year)
					.filter((i)=>new Date(i.incomeOn).getMonth() === month)
					.filter((i) => i.type === IncomesTypeOptions.ONCE);
				if (incomesInGroupThisMonth.length === 0) {
					let total = 0;
					let members = 0;
					value.filter((i) => i.group === income.group)
						.filter((i) => i.type !== IncomesTypeOptions.AVERAGE_OF_GROUP)
						.filter((i) => new Date(i.incomeOn).getFullYear() <= year)
						.filter((i) => new Date(i.incomeOn).getMonth() <= month)
						.forEach((i) => {
							total += i.amount;
							members++;
						});
					totalIncome += total / members;
				}
			}
		});
		if (!totalIncome) {
			totalIncome = 0;
		}
	});

	function getMonthName(month: number) {
		switch (month) {
			case 0:
				return 'Januar';
			case 1:
				return 'Februar';
			case 2:
				return 'März';
			case 3:
				return 'April';
			case 4:
				return 'Mai';
			case 5:
				return 'Juni';
			case 6:
				return 'Juli';
			case 7:
				return 'August';
			case 8:
				return 'September';
			case 9:
				return 'Oktober';
			case 10:
				return 'November';
			case 11:
				return 'Dezember';
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
			<div class="flex flex-col lg:flex-row w-full text-center items-center gap-4">
				<div class="w-1/3">
					<p class="text-xl">Ausgaben:</p>
					<p class="text-2xl text-error">{roundNumber(totalExpenses)}{$currentUser?.currency}</p>
				</div>
				<div class="w-1/3">
					<p class="text-xl">Einkommen:</p>
					<p class="text-2xl text-success">{roundNumber(totalIncome)}{$currentUser?.currency}</p>
				</div>
				<div class="w-1/3">
					<p class="text-xl">Verfügbar:</p>
					<p class="text-2xl text-primary">{roundNumber(totalIncome-totalExpenses)}{$currentUser?.currency}</p>
				</div>
			</div>
		</div>
	</a>
</AuthCheck>
