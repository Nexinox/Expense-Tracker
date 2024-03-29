<script lang="ts">
	import ExpenseComponent from '$lib/components/ExpenseComponent.svelte';

	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { ExpensesRecurringTypeOptions, type ExpensesResponse } from '$lib/pocketbase-types';
	import { expenses } from '$lib/stores/Expenses';

	$expenses;

	const mainCards = ['NOT ONCE', 'ONCE'];

	let filter = '';
	let filteredExpenses: ExpensesResponse[] = [] as ExpensesResponse[];
	expenses.subscribe((expense) => {
		if (!expense) return;
		filteredExpenses = expense.filter((expense) =>expense.name.toLowerCase().includes(filter.toLowerCase()));
	});

</script>


<AuthCheck>
	<div class="w-full mx-auto flex flex-col justify-center items-center">
		<h1 class="text-4xl lg:text-6xl text-center">Ausgaben</h1>
		<input
			class="input w-5/6 mt-12"
			placeholder="Suche..."
			type="text"
			name="filter"
			id="filter"
			bind:value={filter}
		/>
		{#if $expenses}
			{#each mainCards as item}
				<div
					class="card card-compact lg:card-normal w-full lg:w-5/6 mx-auto my-6 lg:m-6 bg-neutral text-neutral-content"
				>
					<div class="card-body text-center items-center collapse collapse-arrow">
						<input type="checkbox" />
						<h1 class=" text-2xl lg:text-4xl card-title mx-auto lg:mb-6 collapse-title">
							{item === 'NOT ONCE' ? 'Wiederkerende Ausgaben' : 'Einmalige Ausgaben'}
							({filteredExpenses.filter(
								(expense) =>
									(item === 'NOT ONCE' &&
										expense.recurringType !== ExpensesRecurringTypeOptions.ONCE) ||
									(item === 'ONCE' && expense.recurringType === ExpensesRecurringTypeOptions.ONCE)
							).length})
						</h1>
						<div
							class="flex flex-wrap flex-col lg:flex-row text-center items-center gap-6 w-full h-full collapse-content"
						>
							{#each filteredExpenses as expense, index (index)}
								{#if item === 'NOT ONCE' && expense.recurringType !== ExpensesRecurringTypeOptions.ONCE}
									<ExpenseComponent {expense} />
								{/if}
								{#if item === 'ONCE' && expense.recurringType === ExpensesRecurringTypeOptions.ONCE}
									<ExpenseComponent {expense} />
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/each}
			<a href="/expense/add" class="btn btn-lg btn-primary w-5/6 text-xl">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-10"
					fill="currentColor"
					viewBox="0 0 24 24"
					><title>plus</title><path
						d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
					/></svg
				>
				Hinzufügen
			</a>

		{/if}
	</div>
</AuthCheck>