<script lang="ts">
  import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/pocketbase';

  async function signOutUser() {
    await pb.authStore.clear();
    goto('/');
  }

</script>

{#if $currentUser}
  <button on:click={signOutUser} class="btn bg-transparent border-none flex h-full">
    <svg
      class="inline-block w-8 h-8 stroke-primary"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M13.5 7.5L10.5 10.75M13.5 7.5L10.5 4.5M13.5 7.5L4 7.5M8 13.5H1.5L1.5 1.5L8 1.5"
      />
    </svg>
  </button>
{/if}

