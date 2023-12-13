<script lang="ts">
  import ExpenseComponent from '$lib/components/ExpenseComponent.svelte';

	import AuthCheck from "$lib/components/AuthCheck.svelte";
	import { expenses } from '$lib/stores/Expenses';

  $expenses

</script>


<AuthCheck>

  <div class="card w-5/6 mx-auto m-6 bg-neutral text-neutral-content">
    <div class="card-body text-center items-center">
      <h1 class="text-4xl card-title mx-auto mb-6">Expenses</h1>
      <div class="flex flex-wrap flex-row text-center items-center gap-6 w-full h-full">
        {#if $expenses}
          {#each $expenses as expense (expense.id)}
            <ExpenseComponent expense={expense}/>
          {/each}
        {/if}
        <div class="card hover:bg-base-200 hover:cursor-pointer w-2/5 h-80 mx-auto shadow-xl text-neutral-content bg-base-100 basis-72 flex-grow flex-shrink-0 max-w-[450px] max-h-[350px] border-dashed border-primary border-2">
          <div class="card-body text-center items-center ">
            <a href="/expense/add" class="text-4xl m-auto text-primary"> 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-44 w-44" fill="currentColor" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
              ADD
            </a>
          </div>
        </div>        

      </div>
    </div>
  </div>


</AuthCheck>
