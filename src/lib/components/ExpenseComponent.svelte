<script lang="ts">
	import { currentUser } from "$lib/pocketbase";
	import type { ExpensesResponse } from "$lib/pocketbase-types";
	import { translateRepeatType } from "$lib/repeatTypeUtils";

  export let expense: ExpensesResponse;

  // Einahmen, wie viel über ist

</script>

<a href={"/expense/"+expense.id} aria-roledescription="Go to editor for this Expense" class="card group w-2/5 h-80 hover:bg-base-200 hover:cursor-pointer mx-auto shadow-xl text-neutral-content bg-base-100 basis-72 flex-grow flex-shrink-0 max-w-[450px] max-h-[350px]">
  <div class="card-body text-center items-center">
    <div class="flex flex-row">
      <h1 class="text-4xl card-title mb-6">
        {expense.name}
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-10 h-10 fill-primary hidden group-hover:block" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>  
      </h1>
    </div>
    <p class="text-2xl">{translateRepeatType(expense.repeatType, expense.unitsInBetween)}</p>
    <p class="text-2xl">{`${expense.amount}${$currentUser?.currency}`}</p>
    <div class="divider text-xl">bei</div>
    <div class="flex flex-row">
      {#if expense.serviceIconUrl}
        <img src={expense.serviceIconUrl} class="w-10 h-10" alt={`${expense.serviceName} Icon`}>
      {/if}
      {#if expense.serviceUrl}
        <a class="text-primary my-auto flex-row flex ml-2 text-xl" href={expense.serviceUrl}>{expense.serviceName}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 my-auto" fill="currentColor" viewBox="0 0 24 24"><title>open-in-new</title><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" /></svg>
        </a>
      {:else}
        <p class="text-xl my-auto ml-2">{expense.serviceName}</p>
      {/if}

    </div>
  </div>
</a>

