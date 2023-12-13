<script lang="ts">
  import OverviewComponent from './OverviewComponent.svelte';

  import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { expenses } from '$lib/stores/Expenses';

  $expenses

  const firstMonth = new Date().getMonth() + 1;
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
  
  let monthsOnScreen = 10;
  let cards: Card[] = [];

  expenses.subscribe(() => {
    let month = firstMonth;
    let year = firstYear;
    cards = [...cards, new Card(cards.length+1, month, year)];
    for (let i = 1; i < monthsOnScreen; i++) {
      if (1+month > 12) {
        year++;
        month = 1;
      }else{
        month++;
      }
      cards = [...cards,new Card(cards.length+1, month, year)];
    }
  });
</script>

<AuthCheck>
  <div class="card card-compact bg-neutral w-full lg:w-4/6 mx-auto m-6">
    <div class="card-body text-center items-center">
      <h1 class="text-4xl">Fund Overview </h1>
      {#each cards as card (card.id)}
        <OverviewComponent year={card.year} month={card.month}></OverviewComponent>
      {/each}
    </div> 
  </div>
</AuthCheck>