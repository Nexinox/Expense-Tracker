<script lang="ts">
  import { currentUser, pb } from "$lib/pocketbase";
	import { Collections } from "$lib/pocketbase-types";
  import { UIMessage } from "$lib/models/UIMessage";
	import { currentUIMessages } from "$lib/stores/UIMessages";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

  let username: string;
  let password: string;

  async function login() {
      await pb.collection(Collections.Users).authWithPassword(username, password).then(() => {
        currentUIMessages.update((messages) => {
          return [...messages!, new UIMessage({
            message: "Successfully logged in",
            type: "success",
            timeout: 2500,
          })];
        });
        goto("/");
      }).catch(() => {
        currentUIMessages.update((messages) => {
          return [...messages!, new UIMessage({
            message: "Login failed, please check your Credentials",
            type: "error",
            timeout: 2500,
          })];
        });
      });
  }

  onMount(() => {
    if ($currentUser) {
      goto("/");
    }
  });
</script>

<div class="card w-full lg:w-4/6 bg-neutral text-neutral-content mx-auto m-6">
  <div class="card-body text-center items-center">
    <h1 class="card-title text-2xl">Sign in</h1>
    <form class="flex w-2/3 flex-col"  on:submit|preventDefault>
      <label class="label text-xs lg:text-base" for="username">Username or E-Mail</label>
      <input class="input input-primary input-xs lg:input-md" type="text" name="username" id="username" bind:value={username}>
  
      <label class="label text-xs lg:text-base" for="password">Password</label>
      <input class="input input-primary input-xs lg:input-md" type="password" name="password" id="password" bind:value={password}>
      
      <div class="card-actions mt-6 gap-6 flex-row flex">
        <a class="text-primary text-xs lg:text-lg my-auto" href="/register">Don't have an account yet?</a>
        <button class="btn btn-primary ml-auto btn-xs lg:btn-md" on:click={login}>Log in</button>
      </div>
    </form>
  </div>
</div>

