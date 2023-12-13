<script lang="ts">
	import type { UIMessage } from "$lib/models/UIMessage";
	import { currentUIMessages } from "$lib/stores/UIMessages";
	import { onMount } from "svelte";

  export let message: UIMessage;

  onMount(() => {
    if (message.timeout) {
      setTimeout(() => {
        currentUIMessages.update((messages) => {
          return messages!.filter((m) => m.id !== message.id);
        });
      }, message.timeout!);
    }
  });

  async function invokeCallback() {
    if (message.callback) {
      message.callback();
    }

    currentUIMessages.update((messages) => {
      return messages.filter((m) => m.id !== message.id);
    });
  }


</script>
<div 
  class="alert my-2"
  class:alert-info={message.type === "info"}
  class:alert-success={message.type === "success"}
  class:alert-warning={message.type === "warning"}
  class:alert-error={message.type === "error"}>
  {#if message.type === "info"}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  {:else if  message.type === "success"}
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  {:else if  message.type === "warning"}
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  {:else if message.type === "error"}
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  {/if}
  <span>{message.message}</span>
  {#if message.btnText}
    <button class="btn btn-sm btn-primary" on:click={()=>invokeCallback()}>{message.btnText}</button>
  {/if}
</div>
