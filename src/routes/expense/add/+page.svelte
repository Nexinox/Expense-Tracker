<script lang="ts">
	import { getEmptyExpense } from '$lib/ExpensesController';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import ExpenseEditor from '$lib/components/ExpenseEditor.svelte';
	import { currentUser } from '$lib/pocketbase';
	import type { ExpensesResponse } from '$lib/pocketbase-types';

	let editedItem: ExpensesResponse = getEmptyExpense($currentUser?.id!);
</script>

<AuthCheck>
	<ExpenseEditor bind:editedItem={editedItem}></ExpenseEditor>
</AuthCheck>
