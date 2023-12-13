<script lang="ts">
	import { translateRepeatType } from '$lib/repeatTypeUtils';
	import {
		Collections,
		ExpensesRepeatTypeOptions,
		type ExpensesResponse
	} from '$lib/pocketbase-types';
	import { page } from '$app/stores';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { expenses } from '$lib/stores/Expenses';
	import { pb } from '$lib/pocketbase.js';
	import { currentUIMessages } from '$lib/stores/UIMessages';
	import { UIMessage } from '$lib/models/UIMessage';
	import { goto } from '$app/navigation';

	let expenseId = $page.params.id;
	let expense: ExpensesResponse | undefined;

	let name = '';
	let amount = 0;
	let serviceName = '';
	let serviceUrl = '';
	let serviceIconUrl = '';
	let repeatType = ExpensesRepeatTypeOptions.MONTHLY;
	let unitsInBetween: number = 0;
	let dueOn: string = '';

	expenses.subscribe((expenses) => {
		expense = expenses.find((expense) => expense.id === expenseId);

		if (!expense) {
			return;
		}

		const date = new Date(expense!.dueOn);
		const dateString = `${date.getFullYear()}-${date.getMonth() < 10 ? '0' : ''}${
			date.getMonth() + 1
		}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;

		name = expense!.name;
		amount = expense!.amount;
		serviceName = expense!.serviceName;
		serviceUrl = expense!.serviceUrl;
		serviceIconUrl = expense!.serviceIconUrl;
		repeatType = expense!.repeatType;
		unitsInBetween = expense!.unitsInBetween;
		dueOn = dateString;
	});

	$: unitsInBetweenVisible =
		repeatType === ExpensesRepeatTypeOptions.EVERY_X_DAYS ||
		repeatType === ExpensesRepeatTypeOptions.EVERY_X_MONTHS ||
		repeatType === ExpensesRepeatTypeOptions.EVERY_X_YEARS ||
		repeatType === ExpensesRepeatTypeOptions.EVERY_X_WEEKS;

	$: nameValid = name.length > 0;
	$: amountValid = amount > 0;
	$: serviceNameValid = serviceName.length > 0;
	$: dueOnValid = dueOn.length > 0;
	$: unitsInBetweenValid = (unitsInBetweenVisible && unitsInBetween > 0) || !unitsInBetweenVisible;

	async function save() {
		if (!nameValid || !amountValid || !serviceNameValid || !dueOnValid || !unitsInBetweenValid) {
			currentUIMessages.update((messages) => [
				...messages,
				new UIMessage({
					type: 'error',
					message: 'Please fill out all required fields'
				})
			]);
			return;
		}

		await pb
			.collection(Collections.Expenses)
			.update(expenseId, {
				name,
				amount,
				serviceName,
				serviceUrl,
				serviceIconUrl,
				repeatType,
				unitsInBetween,
				dueOn
			})
			.then(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'success',
						message: 'Expense saved successfully'
					})
				]);
				goto('/expense/');
			})
			.catch((error) => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'error',
						message: 'Error while saving Expense: ' + error.message
					})
				]);
			});
	}

	async function deletee() {
		await pb
			.collection(Collections.Expenses)
			.delete(expenseId)
			.then(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'success',
						message: 'Expense deleted successfully'
					})
				]);
				goto('/expense/');
			})
			.catch((error) => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'error',
						message: 'Error while deleting Expense: ' + error.message
					})
				]);
			});
	}

	function showLeaveModal() {
		if (!document) {
			goto('/expense/');
			return;
		}
		let dialog = document?.getElementById('leave_modal') as HTMLDialogElement;
		dialog.showModal();
	}

	function showDeleteModal() {
		let dialog = document?.getElementById('delete_modal') as HTMLDialogElement;
		dialog.showModal();
	}
</script>

<AuthCheck>
	<div class="card lg:w-4/6 w-full text-neutral-content bg-neutral m-6 mx-auto">
		<div class="card-body text-center items-center">
			<h1 class="card-title lg:text-4xl text-2xl">Edit Expense</h1>
			<form class="w-5/6 form-control" on:submit|preventDefault>
				<label class="label text-xs lg:text-base" for="name">Name</label>
				<input
					class="input input-primary input-xs lg:input-md"
					bind:value={name}
					name="name"
					type="text"
				/>

				<div class="flex lg:flex-row flex-col items-center text-center gap-4">
					<div class="lg:w-1/2 w-full">
						<label class="label text-xs lg:text-base" for="amount">Amount</label>
						<input
							class="input input-primary w-full input-xs lg:input-md"
							bind:value={amount}
							name="amount"
							type="text"
						/>
					</div>
					<div class="lg:w-1/2 w-full ml-auto">
						<label class="label text-xs lg:text-base" for="dueOn">Due On</label>
						<input
							class="input input-primary w-full input-xs lg:input-md"
							on:change={() => console.log(dueOn)}
							bind:value={dueOn}
							name="dueOn"
							type="date"
						/>
					</div>
				</div>

				<div class="flex lg:flex-row flex-col items-center text-center gap-4">
					<div class="lg:w-1/3 w-full">
						<label class="label text-xs lg:text-base" for="repeatType">Repeat Type</label>
						<select
							class="select select-bordered w-full border-primary select-xs lg:select-md"
							bind:value={repeatType}
							name="repeatType"
						>
							{#each Object.keys(ExpensesRepeatTypeOptions) as repeatTypeOption}
								<option value={repeatTypeOption}>{translateRepeatType(repeatTypeOption)}</option>
							{/each}
						</select>
					</div>
					<div
						class:visible={unitsInBetweenVisible}
						class:hidden={!unitsInBetweenVisible}
						class="lg:w-2/3 w-full ml-auto"
					>
						<label class="label text-xs lg:text-base" for="unitsInBetween">Units In Between</label>
						<input
							class="input input-primary w-full input-xs lg:input-md"
							bind:value={unitsInBetween}
							name="unitsInBetween"
							type="number"
						/>
					</div>
				</div>

				<div class="divider text-sm lg:text-xl lg:mt-6">bei</div>

				<div class="flex lg:flex-row flex-col items-center text-center lg:gap-4">
					<div class="lg:w-1/2 w-full">
						<label class="label text-xs lg:text-base" for="serviceName">Service Name</label>
						<input
							class="input input-primary w-full input-xs lg:input-md"
							bind:value={serviceName}
							name="serviceName"
							type="text"
						/>
					</div>
					<div class="lg:w-1/2 w-full ml-auto">
						<label class="label text-xs lg:text-base" for="serviceUrl">Service URL</label>
						<input
							class="input input-primary w-full input-xs lg:input-md"
							bind:value={serviceUrl}
							name="serviceUrl"
							type="text"
						/>
					</div>
				</div>

				<div class="flex flex-row gap-4">
					<div>
						<label class="label text-xs lg:text-base" for="serviceIconUrl">Service Icon URL</label>
						<input
							class="input input-primary w-full input-xs lg:input-md"
							bind:value={serviceIconUrl}
							name="serviceIconUrl"
							type="text"
						/>
					</div>
					<div class="mx-auto w-f">
						<label class="label text-xs lg:text-base" for="icon">Preview</label>
						<img
							id="icon"
							src={serviceIconUrl}
							class="w-6 h-6 lg:w-10 lg:h-10 mt-2 my-auto mx-auto"
							alt=""
						/>
					</div>
				</div>
				<button on:click={showDeleteModal} class="btn btn-error btn-xs lg:btn-md w-1/4 mt-10">Delete Expense</button>
				<div class="card-actions mt-12">
					<button on:click={showLeaveModal} class="btn btn-secondary btn-md lg:btn-lg">Cancel</button>
					<button on:click={save} class="btn btn-primary btn-md lg:btn-lg ml-auto">Save</button>
				</div>
			</form>

			<dialog id="leave_modal" class="modal modal-bottom modal-middle">
				<div class="modal-box">
					<h3 class="font-bold text-lg">Are you Shure?</h3>
					<p class="py-4">All changes will be lost!</p>
					<div class="modal-action">
						<form method="dialog">
							<!-- if there is a button in form, it will close the modal -->
							<button class="btn btn-success">Stay</button>
							<button on:click={() => goto('/expense/')} class="btn btn-error">Leave</button>
						</form>
					</div>
				</div>
			</dialog>

			<dialog id="delete_modal" class="modal modal-bottom modal-middle">
				<div class="modal-box">
					<h3 class="font-bold text-lg">Are you Shure?</h3>
					<p class="py-4">The Expense will be delete permanently!</p>
					<div class="modal-action">
						<form method="dialog">
							<!-- if there is a button in form, it will close the modal -->
							<button class="btn btn-success">Cancel</button>
							<button on:click={() => deletee()} class="btn btn-error">I am Shure</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	</div>
</AuthCheck>
