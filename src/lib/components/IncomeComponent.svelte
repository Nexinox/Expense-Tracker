<script lang="ts">
	import { dateToIsoString } from "$lib/ExpenseUtils";
	import { currentUser } from "$lib/pocketbase";
	import { IncomesTypeOptions, type IncomesResponse } from "$lib/pocketbase-types";
	import { translateRepeatType } from "$lib/repeatTypeUtils";
  export let income: IncomesResponse;

</script>

<a href={"/income/"+income.id} aria-roledescription="Go to editor for this Income" class="card group w-full lg:w-2/5 h-60 lg:h-80 hover:bg-base-200 hover:cursor-pointer mx-auto shadow-xl text-neutral-content bg-base-100 basis-72 lg:flex-grow lg:flex-shrink-0 lg:max-w-[450px] lg:max-h-[350px]">
  <div class="card-body text-center items-center flex-grow-0 lg:flex-grow">
    <div class="flex flex-row">
      <h1 class="text-2xl lg:text-4xl card-title mb-6">
        {income.name}
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-10 h-10 fill-primary hidden group-hover:block" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>  
      </h1>
    </div>
    <p class="text-xl lg:text-2xl">{
      translateRepeatType(income.type, undefined)} 
      {income.type === IncomesTypeOptions.ONCE ? `am ${dateToIsoString(new Date(income.incomeOn))}`:""} 
      {income.type === IncomesTypeOptions.AVERAGE_OF_GROUP ? income.group: ""}
    </p>
    <p class="text-xl lg:text-2xl">{`${income.amount}${$currentUser?.currency}`}</p>
    <div class="divider text-sm lg:text-xl">von</div>
    <div class="flex flex-row">
      <p class="text-xl my-auto ml-2">{income.from}</p>
    </div>
  </div>
</a>

