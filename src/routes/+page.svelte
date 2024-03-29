<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
</script>

<div class="mx-auto flex flex-col w-full text-center items-center m-6 gap-6">
  <h1 class="text-4xl w-full">Nie wieder eine Ausgabe vergessen.</h1>
  {#if $currentUser}
    <a href="/expense" class="btn btn-primary btn-lg">Loslegen</a>
  {:else}
    <a href="/login" class="btn btn-primary btn-lg">Loslegen</a>
  {/if}
</div>
