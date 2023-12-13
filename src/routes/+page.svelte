<script lang="ts">
	import { currentUser} from '$lib/pocketbase';
</script>

<div class="mx-auto flex flex-col w-full text-center items-center m-6 gap-6">
  <h1 class="text-4xl w-full">Never forget another bill</h1>
  <p class="text-xl w-3/4">
    Track your expenses, income and budget with our easy-to-use financial management tool. Get instant
    insight into your financial standing at any given time. You can also set up alerts to ensure you
    stay within your spending limits. With our intuitive design, managing your personal finances has
    never been easier.
  </p>
  {#if $currentUser}
    <a href="/expense" class="btn btn-primary btn-lg">Get Started</a>
  {:else}
    <a href="/login" class="btn btn-primary btn-lg">Get Started</a>
  {/if}
</div>
