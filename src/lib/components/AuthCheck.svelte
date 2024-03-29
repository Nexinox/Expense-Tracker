<script lang="ts">
	import { currentUser } from "$lib/pocketbase";

</script>

{#if $currentUser}
    <slot/>
{:else}
  <div class="card w-96 bg-neutral text-neutral-content mx-auto m-6">
    <div class="card-body text-center items-center">
      <p class="text-error text-2xl">Zugriff verweigert</p>
      <p class="text-error text-base">Einloge um diese Seite zu sehen.</p>
      <a class="btn btn-primary" href="/login">Zum Login</a>
    </div>
  </div>
{/if}
