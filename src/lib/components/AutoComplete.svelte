<script lang="ts">
	export let items: string[] = [];
	export let value: string = '';
    export let name: string = '';
    export let placeholder: string = '';

	$: inputVal = value || '';

	function onItemClicked(item: string) {
        if (document.activeElement instanceof HTMLElement )(document.activeElement as HTMLElement).blur()
		value = item
		inputVal = item;
	}

	$: filteredItems = items.filter(function(item) {
		return item.toLowerCase().includes(inputVal.toLowerCase())
	})
</script>


<div class="dropdown w-full">
    <input 
        class="input input-primary w-full input-xs lg:input-md" 
        name={name}
        placeholder={placeholder}
        bind:value={inputVal}
        on:input={() => { value = inputVal}}
        />
    <ul tabindex="-1" class="dropdown-content z-[1] w-full menu p-2 shadow bg-base-100 rounded-box max-h-80 flex-nowrap overflow-auto">
        {#if filteredItems.length === 0}
            <li>
                <button type="button" disabled>Neu</button>
            </li>
        {:else}
            {#each filteredItems as item}
                <li>
                    <button type="button" on:click|preventDefault={() => onItemClicked(item)}>{item}</button>
                </li>
            {/each}
        {/if}
    </ul>
</div>