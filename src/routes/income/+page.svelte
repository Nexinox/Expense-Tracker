<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import IncomeComponent from '$lib/components/IncomeComponent.svelte';
	import { IncomesTypeOptions, type IncomesResponse } from '$lib/pocketbase-types';
	import { incomes } from '$lib/stores/Incomes';

	$incomes;

	const mainCards = ['NOT ONCE', 'ONCE'];

	let filter = '';
	let filteredIncomes: IncomesResponse[] = [] as IncomesResponse[];
	incomes.subscribe((incomes) => {
		if (!incomes) return;
		filteredIncomes = incomes.filter((income) =>income.name.toLowerCase().includes(filter.toLowerCase()));
	});
</script>

<AuthCheck>
	{#if $incomes}
	
	<div class="w-full mx-auto flex flex-col justify-center items-center">
		<h1 class="text-4xl lg:text-6xl text-center">Einnahmen</h1>
		<input
			class="input w-5/6 mt-12"
			placeholder="Suche..."
			type="text"
			name="filter"
			id="filter"
			bind:value={filter}
		/>
		{#each mainCards as card}
			<div class="card w-full card-compact lg:card-normal lg:w-5/6 mx-auto m-6 p-0 lg:p-6 bg-neutral text-neutral-content">
				<div class="card-body text-center items-center collapse collapse-arrow">
					<input type="checkbox" />
					<h1 class="text-2xl lg:text-4xl card-title mx-auto mb-6 collapse-title">
						{card === 'NOT ONCE' ? 'Wiederkerende Einnahmen' : 'Einmalige Einnahmen'}
						({filteredIncomes.filter(
							(income) =>
								(card === 'NOT ONCE' && income.type === IncomesTypeOptions.MONTHLY) ||
								(card === 'ONCE' && income.type !== IncomesTypeOptions.MONTHLY)
						).length})
					</h1>
					<div class="flex flex-wrap flex-row text-center items-center gap-6 w-full h-full collapse-content">
						{#each filteredIncomes as income, index (index)}
							{#if card ==='NOT ONCE' && income.type === IncomesTypeOptions.MONTHLY}
								<IncomeComponent {income} />
							{/if}
							{#if card ==='ONCE' && income.type !== IncomesTypeOptions.MONTHLY}
								<IncomeComponent {income} />
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/each}
		<a href="/income/add" class="btn btn-lg btn-primary w-5/6 text-xl">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10"
				fill="currentColor"
				viewBox="0 0 24 24"
				><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg
			>
			Hinzufügen
		</a>
	</div>
	{/if}
</AuthCheck>
