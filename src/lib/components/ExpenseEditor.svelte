<script lang="ts">
	import { goto } from '$app/navigation';
	import { createExpense, deleteExpense, updateExpense } from '$lib/ExpensesController';
	import { showErrorMessage, showSuccessMessage } from '$lib/UIMessageController';
	import { ExpensesRecurringTypeOptions, type ExpensesResponse } from '$lib/pocketbase-types';
	import { translateRepeatType } from '$lib/repeatTypeUtils';

    export let editedItem: ExpensesResponse;

	$: nameValid = editedItem.name.length > 0;
	$: amountValid = editedItem.amount > 0;
	$: serviceNameValid = editedItem.serviceName.length > 0;
	$: dueOnValid = editedItem.dueOn.length > 0;
	$: intervalValid = editedItem.interval > 0;
	
	$: intervalVisible = editedItem.recurringType !== ExpensesRecurringTypeOptions.ONCE;

	$: formValid = nameValid && amountValid && serviceNameValid && dueOnValid && intervalValid;

	$: deleteVisible = editedItem.id !== '';

	async function save() {
		if (editedItem.id === '') {
			await createItem();
		} else {
			await updateItem();
		}
	}

	async function createItem() {
		if (!formValid) {
			showErrorMessage('Bitte füllen sie alle benötigten Felder aus');
			return;
		}
		await createExpense(editedItem)
			.then(() => {
				showSuccessMessage('Ausgabe erfolgreich erstellt');
				goto('/expense/');
			})
			.catch((error) => showErrorMessage('Fehler beim erstellen der Ausgabe.'));
	}

	async function updateItem() {
		if (!formValid) {
			showErrorMessage('Bitte füllen sie alle benötigten Felder aus');
			return;
		}

		await updateExpense(editedItem)
			.then(() => {
				showSuccessMessage('Ausgabe erfolgreich gespeichert.');
				goto('/expense/');
			})
			.catch(() => showErrorMessage('Fehler beim speichern der Ausgabe.'));
	}

	async function deleteItem() {
		await deleteExpense(editedItem.id)
		.then(() => {
            showSuccessMessage('Ausgabe erfolgreich gelöscht.');
			goto('/expense/');
        })
        .catch(() => showErrorMessage('Fehler beim löschen der Ausgabe.'));
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
		if (!document) {
			goto('/expense/');
			return;
		}
		let dialog = document?.getElementById('delete_modal') as HTMLDialogElement;
		dialog.showModal();
	}
</script>

	<div class="card m-6 lg:w-4/6 w-full text-neutral-content bg-neutral mx-auto">
		<div class="card-body text-center items-center p-3 pt-6 lg:p-6">
			<h1 class="card-title lg:text-4xl text-2xl">Ausgabe {editedItem.id != '' ? "Bearbeiten" : "Erstellen"}</h1>
			<form class="w-full lg:w-5/6 form-control" on:submit|preventDefault>
				<label class="label text-md lg:text-base" for="name">Name*</label>
				<input
					class="input input-primary input-md"
					bind:value={editedItem.name}
					name="name"
					type="text"
				/>

				<div class="flex lg:flex-row flex-col items-center text-center gap-0 lg:gap-4gap-0 lg:gap-4">
					<div class="lg:w-1/2 w-full">
						<label class="label text-md lg:text-base" for="amount">Summe*</label>
						<input
							class="input input-primary w-full input-md"
							bind:value={editedItem.amount}
							name="amount"
							type="number"
						/>
					</div>
					<div class="lg:w-1/2 w-full ml-auto">
						<label class="label text-base" for="dueOn">Fälligkeitsdatum*</label>
						<input
							class="input input-primary w-full input-md"
							bind:value={editedItem.dueOn}
							name="dueOn"
							type="date"
						/>
					</div>
				</div>

				<div class="flex lg:flex-row flex-col items-center text-center gap-0 lg:gap-4">
					<div class="lg:w-1/3 w-full">
						<label class="label text-base" for="recurringType">Wiederholungsart*</label>
						<select
							class="select select-bordered w-full border-primary select-md"
							bind:value={editedItem.recurringType}
							name="recurringType"
						>
							{#each Object.keys(ExpensesRecurringTypeOptions) as repeatTypeOption}
								<option value={repeatTypeOption}>{translateRepeatType(repeatTypeOption)}</option>
							{/each}
						</select>
					</div>
					<div
						class="lg:w-2/3 w-full ml-auto"
						class:visible={intervalVisible}
						class:hidden={!intervalVisible}
					>
						<label class="label text-base" for="interval">Interval*</label>
						<input
							class="input input-primary w-full input-md"
							bind:value={editedItem.interval}
							name="interval"
							type="number"
						/>
					</div>
				</div>

				<div class="divider text-md lg:text-xl mt-6">bei</div>

				<div class="flex lg:flex-row flex-col items-center text-center gap-0 lg:gap-4">
					<div class="lg:w-1/2 w-full">
						<label class="label text-base" for="serviceName">Name*</label>
						<input
							class="input input-primary w-full input-md"
							bind:value={editedItem.serviceName}
							name="serviceName"
							type="text"
						/>
					</div>
					<div class="lg:w-1/2 w-full ml-auto">
						<label class="label text-base" for="serviceUrl">Adresse</label>
						<input
							class="input input-primary w-full input-md"
							bind:value={editedItem.serviceUrl}
							name="serviceUrl"
							type="text"
						/>
					</div>
				</div>

				<div class="flex flex-row gap-0 lg:gap-4">
					<div>
						<label class="label text-base" for="serviceIconUrl">Icon Adresse</label>
						<input
							class="input input-primary w-full input-md"
							bind:value={editedItem.serviceIconUrl}
							name="serviceIconUrl"
							type="text"
						/>
					</div>
					<div class="mx-auto w-f">
						<label class="label text-base" for="icon">Icon Vorschau</label>
						<img
							id="icon"
							src={editedItem.serviceIconUrl}
							class="w-6 h-6 lg:w-10 lg:h-10 mt-2 my-auto mx-auto"
							alt=""
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
					<h3 class="font-bold text-lg">Sind sie Sicher?</h3>
					<p class="py-4">Alle änderungen gehen verlohren!</p>
					<div class="modal-action">
						<form method="dialog">
							<button class="btn btn-success">Bleiben</button>
							<button on:click={() => goto('/expense/')} class="btn btn-error">Änderungen verwerfen</button>
						</form>
					</div>
				</div>
			</dialog>

			<dialog id="delete_modal" class="modal modal-middle">
				<div class="modal-box">
					<h3 class="font-bold text-lg">Sind sie sicher?</h3>
					<p class="py-4">Die Ausgabe wird unwiderruflich gelöscht!</p>
					<div class="modal-action">
						<form method="dialog">
							<button class="btn btn-success">Abbrechen</button>
							<button on:click={() => deleteItem()} class="btn btn-error">Löschen</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	</div>

