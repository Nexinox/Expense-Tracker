<script lang="ts">
    import type { ExpensesResponse, IncomesResponse } from '$lib/pocketbase-types';

	export let day: Day;
	export let year: number;
	export let month: number;

	class Day {
		date: number = 0;
		incomes: IncomesResponse[] = [];
		expenses: ExpensesResponse[] = [];
	}

	function dateToWeekDayGerman(date: Date): string {
		switch (date.getDay()) {
			case 0:
				return 'Sonntag';
			case 1:
				return 'Montag';
			case 2:
				return 'Dienstag';
			case 3:
				return 'Mittwoch';
			case 4:
				return 'Donnerstag';
			case 5:
				return 'Freitag';
			case 6:
				return 'Samstag';
			default:
				return '';
		}
	}
</script>

{#if day.incomes.length > 0 || day.expenses.length > 0}
	<div class="card card-compact bg-base-100 p-6 w-full lg:w-2/3 m-auto">
		<div class="m-auto">
			<h1 class="card-title text-2xl lg:text-4xl">
				{dateToWeekDayGerman(new Date(year, month, day.date))}
				{day.date < 10 ? '0' + day.date : day.date}.{month + 1 < 10
					? '0' + (month + 1)
					: month + 1}.{year}
			</h1>
		</div>
		<div class="card-body">
			<div class="flex flex-col gap-6">
				{#if day.incomes.length > 0}
					<div class="w-full text-center">
						<h2 class="text-2xl">Einnahmen</h2>
						{#each day.incomes as income}
							<a
								class="card card-compact bg-base-300 mt-6 w-full hover:bg-base-200 text-center"
								href={`/income/${income.id}`}
							>
								<div class="m-auto mt-2">
									<h1 class="card-title text-2xl">{income.name}</h1>
								</div>
								<div class="card-body">
									<p class="text-center text-xl text-green-600">{income.amount}€</p>
								</div>
							</a>
						{/each}
					</div>
				{/if}
				{#if day.incomes.length > 0 && day.expenses.length > 0}
					<div class="divider divider-vertical divider-primary" />
				{/if}
				{#if day.expenses.length > 0}
					<div class="w-full text-center">
						<h2 class="text-2xl">Ausgaben</h2>
						{#each day.expenses as expense}
							<a
								class="card card-compact bg-base-300 mt-6 w-full hover:bg-base-200 card-bordered"
								href="/expense/{expense.id}"
							>
								<div class="m-auto mt-2">
									<h1 class="card-title text-2xl">{expense.name}</h1>
								</div>
								<div class="card-body">
									<p class="text-center text-xl text-red-600">{expense.amount}€</p>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
