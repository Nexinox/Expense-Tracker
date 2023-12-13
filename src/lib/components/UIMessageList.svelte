<script lang="ts">
	import { currentUIMessages } from "$lib/stores/UIMessages";
  import UiMessageComponent from "./UIMessageComponent.svelte";

  $currentUIMessages

</script>

<div class="sticky bottom-0 w-4/6 m-auto mb-4">
  {#each $currentUIMessages as message (message.id)}
    <UiMessageComponent message={message} />
  {/each}
</div>
