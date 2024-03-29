<script lang="ts">
	import { page } from '$app/stores';
	import { getEmptyExpense } from '$lib/ExpensesController';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { currentUser } from '$lib/pocketbase';
	import type { ExpensesResponse } from '$lib/pocketbase-types';
	import { expenses } from '$lib/stores/Expenses';
	import ExpenseEditor from '../../../lib/components/ExpenseEditor.svelte';

	let expenseId = $page.params.id;
	let editedItem: ExpensesResponse = getEmptyExpense($currentUser?.id!);

	expenses.subscribe((expenses) => {
		let item = expenses.find((expense) => expense.id === expenseId);
		if (!item) {
			return;
		};
		editedItem = {...item};
	});
</script>

<AuthCheck>
	<ExpenseEditor bind:editedItem={editedItem}>

	</ExpenseEditor>
</AuthCheck>
