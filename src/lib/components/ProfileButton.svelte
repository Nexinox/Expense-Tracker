<script lang="ts">
	import { currentUser } from "$lib/pocketbase";



</script>

{#if $currentUser}
  <a class="flex-auto" href="/profile">
    <div class="avatar placeholder">
    <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
      <span class="text-2xl">N</span>
    </div>
    </div>
    <p>{$currentUser?.username}</p>
  </a>
{:else}
  <a href="/login" class="inline-block bg-primary text-primary-content text-center h-full w-full">Sign In</a>
{/if}
