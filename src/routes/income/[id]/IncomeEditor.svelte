<script lang="ts">
	import { goto } from '$app/navigation';
	import { createIncome, deleteIncome, updateIncome } from '$lib/IncomeController';
	import { showErrorMessage, showSuccessMessage } from '$lib/UIMessageController';
	import AutoComplete from '$lib/components/AutoComplete.svelte';
	import { IncomesTypeOptions, type IncomesResponse } from '$lib/pocketbase-types';
	import { translateRepeatType } from '$lib/repeatTypeUtils';
	import { incomes } from '$lib/stores/Incomes';

	export let editedItem: IncomesResponse;

	let groups: string[] = [];

	incomes.subscribe((incomes) => {
		if (incomes) {
			groups = incomes.map((income) => income.group).filter((value) => value !== '');
			groups = groups.filter((value, index) => groups.indexOf(value) === index);
		}
	});

	$: nameValid = editedItem.name.length > 0;
	$: amountValid = editedItem.amount > 0;
	$: serviceNameValid = editedItem.from.length > 0;
	$: dueOnValid = editedItem.incomeOn.length > 0;
	$: groupVisible = editedItem.type !== IncomesTypeOptions.MONTHLY;
	$: groupRequired = editedItem.type === IncomesTypeOptions.AVERAGE_OF_GROUP;

	async function save() {
		if (
			!nameValid ||
			!amountValid ||
			!serviceNameValid ||
			!dueOnValid ||
			(editedItem.type === IncomesTypeOptions.AVERAGE_OF_GROUP && !editedItem.group)
		) {
			showErrorMessage('Bitte alle benötigten Felder ausfüllen.');
			return;
		}

		if (editedItem.id === '') {
			await createItem();
		} else {
			await updateItem();
		}
	}

	async function createItem() {
		await createIncome(editedItem)
			.then(() => {
				showSuccessMessage('Einnahme erfolgreich erstellt.');
				goto('/income/');
			})
			.catch(() => {
				showErrorMessage('Fehler beim erstellen der Einnahme.');
			});
	}

	async function updateItem() {
		await updateIncome(editedItem)
			.then(() => {
				showSuccessMessage('Einnahme erfolgreich gespeichert.');
				goto('/income/');
			})
			.catch(() => {
				showErrorMessage('Fehler beim speichern der Einnahme.');
			});
	}

	async function deleteItem() {
		await deleteIncome(editedItem.id)
			.then(() => {
				showSuccessMessage('Einnahme erfolgreich gelöscht.');
				goto('/income/');
			})
			.catch(() => {
				showErrorMessage('Fehler beim löschen der Einnahme.');
			});
	}

	function showLeaveModal() {
		if (!document) {
			goto('/income/');
			return;
		}
		let dialog = document?.getElementById('leave_modal') as HTMLDialogElement;
		dialog.showModal();
	}

	function showDeleteModal() {
		if (!document) {
			goto('/income/');
			return;
		}
		let dialog = document?.getElementById('delete_modal') as HTMLDialogElement;
		dialog.showModal();
	}
</script>

<div class="card lg:w-4/6 w-full text-neutral-content bg-neutral m-6 mx-auto">
	<div class="card-body text-center items-center p-2 lg:p-6 pt-6">
		<h1 class="card-title lg:text-4xl text-2xl">Einahme bearbeiten</h1>
		<form class="w-5/6 form-control" on:submit|preventDefault>
			<label class="label text-base" for="name">Name*</label>
			<input
				class="input input-primary input-md"
				bind:value={editedItem.name}
				name="name"
				type="text"
			/>

			<div class="flex lg:flex-row flex-col items-center text-center lg:gap-4 gap-0">
				<div class="lg:w-1/2 w-full">
					<label class="label text-base" for="amount">Summe*</label>
					<input
						class="input input-primary w-full input-md"
						bind:value={editedItem.amount}
						name="amount"
						type="text"
					/>
				</div>
				<div class="lg:w-1/2 w-full ml-auto">
					<label class="label text-base" for="incomeOn">Eingang Am*</label>
					<input
						class="input input-primary w-full input-md"
						bind:value={editedItem.incomeOn}
						name="incomeOn"
						type="date"
					/>
				</div>
			</div>

			<div class="flex lg:flex-row flex-col items-center text-center lg:gap-4 gap-0">
				<div class="lg:w-1/3 w-full">
					<label class="label text-base" for="type">Art*</label>
					<select
						class="select select-bordered w-full border-primary select-md"
						bind:value={editedItem.type}
						name="type"
					>
						{#each Object.keys(IncomesTypeOptions) as repeatTypeOption}
							<option value={repeatTypeOption}>{translateRepeatType(repeatTypeOption)}</option>
						{/each}
					</select>
				</div>
				<div
					class:visible={groupVisible}
					class:hidden={!groupVisible}
					class="lg:w-1/2 w-full ml-auto"
				>
					<label class="label text-base" for="group"
						>Gruppe{groupRequired ? '*' : ''}</label
					>
					<AutoComplete bind:items={groups} bind:value={editedItem.group} name="group" />
				</div>
			</div>

			<div class="divider text-sm lg:text-xl mt-6">von</div>

			<div class="flex lg:flex-row flex-col items-center text-center lg:gap-4 gap-0">
				<div class="lg:w-1/2 w-full">
					<label class="label text-base" for="from">Name</label>
					<input
						class="input input-primary w-full input-md"
						bind:value={editedItem.from}
						name="from"
						type="text"
					/>
				</div>
			</div>
			<div class="card-actions mt-12 mb-6 flex flex-row justify-between">
				<button on:click={showLeaveModal} class="btn btn-secondary btn-md btn-circle btn-outline lg:btn-lg self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-6 w-6" viewBox="0 0 24 24"><title>cancel</title><path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z" /></svg>
                </button>
				<button on:click={showDeleteModal} class="btn btn-error btn-md btn-circle btn-outline lg:btn-lg self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-6 w-6" viewBox="0 0 24 24"><title>trash-can</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" /></svg>
                </button>
				<button on:click={save} class="btn btn-primary btn-md lg:btn-lg btn-circle btn-outline self-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-6 w-6" viewBox="0 0 24 24"><title>content-save</title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg>
                </button>
			</div>
		</form>

		<dialog id="leave_modal" class="modal modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Sind sie sicher?</h3>
				<p class="py-4">Alle Änderungen gehen verlohren!</p>
				<div class="modal-action">
					<form method="dialog">
						<!-- if there is a button in form, it will close the modal -->
						<button class="btn btn-success">Bleiben</button>
						<button on:click={() => goto('/income/')} class="btn btn-error"
							>Änderungen verwerfen</button
						>
					</form>
				</div>
			</div>
		</dialog>

		<dialog id="delete_modal" class="modal modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Sind sie sicher?</h3>
				<p class="py-4">Die Einahme wird unwiderruflich gelöscht!</p>
				<div class="modal-action">
					<form method="dialog">
						<!-- if there is a button in form, it will close the modal -->
						<button class="btn btn-success">Abbrechen</button>
						<button on:click={() => deleteItem()} class="btn btn-error">Löschen</button>
					</form>
				</div>
			</div>
		</dialog>
	</div>
</div>
