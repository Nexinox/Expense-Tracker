<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { getEmptyIncome } from '$lib/IncomeController';
	import { currentUser } from '$lib/pocketbase';
	import IncomeEditor from '../[id]/IncomeEditor.svelte';

	let editedItem = getEmptyIncome($currentUser?.id!);
</script>

<AuthCheck>
	<IncomeEditor bind:editedItem={editedItem} ></IncomeEditor>
</AuthCheck>
