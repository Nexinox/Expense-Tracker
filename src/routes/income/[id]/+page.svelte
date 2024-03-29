<script lang="ts">
	import IncomeEditor from './IncomeEditor.svelte';

	import { page } from '$app/stores';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { getEmptyIncome } from '$lib/IncomeController';
	import type { IncomesResponse } from '$lib/pocketbase-types';
	import { currentUser } from '$lib/pocketbase.js';
	import { incomes } from '$lib/stores/Incomes';

	let incomeId = $page.params.id;
	let editedItem: IncomesResponse = getEmptyIncome($currentUser?.id!);

	incomes.subscribe((incomes) => {
		const income = incomes.find((income) => income.id === incomeId);

		if (!income) {
			return;
		}

		editedItem = { ...income };
	});
</script>

<AuthCheck>
	<IncomeEditor bind:editedItem />
</AuthCheck>
