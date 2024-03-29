<script lang="ts">
	import OverviewComponent from './OverviewComponent.svelte';

	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { expenses } from '$lib/stores/Expenses';

	$expenses;

	const firstMonth = new Date().getMonth();
	const firstYear = new Date().getFullYear();

	class Card {
		id: number;
		month: number;
		year: number;

		constructor(id: number, month: number, year: number) {
			this.id = id;
			this.month = month;
			this.year = year;
		}
	}

	let monthsOnScreen = 12;
	let cards: Card[] = [];

	expenses.subscribe(() => {
		cards = [];
		let month = firstMonth;
		let year = firstYear;
		cards = [...cards, new Card(cards.length + 1, month, year)];
		for (let i = 1; i < monthsOnScreen; i++) {
			if (1 + month > 11) {
				year++;
				month = 0;
			} else {
				month++;
			}
			cards = [...cards, new Card(cards.length + 1, month, year)];
		}
	});

	function loadPrevious() {
		let month = cards[0].month;
		let year = cards[0].year;
		for (let i = 1; i < monthsOnScreen; i++) {
			if (month - 1 < 0) {
				year--;
				month = 11;
			} else {
				month--;
			}
			cards = [new Card(cards.length + 1, month, year), ...cards];
		}
	}

	function loadNext() {
		let month = cards[cards.length - 1].month;
		let year = cards[cards.length - 1].year;
		for (let i = 1; i < monthsOnScreen; i++) {
			if (1 + month > 11) {
				year++;
				month = 0;
			} else {
				month++;
			}
			cards = [...cards, new Card(cards.length + 1, month, year)];
		}
	}
</script>

<AuthCheck>
	<div class="w-full text-center items-center flex flex-col">
		<h1 class="text-4xl my-auto">Finanz Übersicht</h1>
		<div class="card card-compact bg-neutral w-full lg:w-4/6 mx-auto m-6">
			<div class="card-body text-center items-center">
				<button class="btn" on:click={loadPrevious}>Vorherige</button>
				{#each cards as card (card.id)}
					<OverviewComponent year={card.year} month={card.month} />
				{/each}
				<button class="btn" on:click={loadNext}>Nächste</button>
			</div>
		</div>
	</div>
</AuthCheck>
