<script lang="ts">
  import { goto } from "$app/navigation";
  import { UIMessage } from "$lib/models/UIMessage";
  import { currentUser, pb } from "$lib/pocketbase";
  import { Collections } from "$lib/pocketbase-types";
  import { currentUIMessages } from "$lib/stores/UIMessages";
  import { onMount } from "svelte";

  let username: string;
  let password: string;

  async function login() {
      await pb.collection(Collections.Users).authWithPassword(username, password).then(() => {
        currentUIMessages.update((messages) => {
          return [...messages!, new UIMessage({
            message: "Erfolgreich eingeloggt.",
            type: "success",
            timeout: 2500,
          })];
        });
        goto("/");
      }).catch(() => {
        currentUIMessages.update((messages) => {
          return [...messages!, new UIMessage({
            message: "Fehler beim Einloggen, bitte überprüfen Sie Ihre Eingaben.",
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
  <div class="card-body text-center items-center p-4 lg:p-6">
    <h1 class="card-title text-2xl">Login</h1>
    <form class="flex w-full lg:w-2/3 flex-col"  on:submit|preventDefault>
      <label class="label text-base" for="username">Benutzername/E-Mail</label>
      <input class="input input-primary input-md" type="text" name="username" id="username" bind:value={username}>
  
      <label class="label text-base" for="password">Passwort</label>
      <input class="input input-primary input-md" type="password" name="password" id="password" bind:value={password}>
      
      <div class="card-actions mt-6 gap-6 flex-row flex">
        <a class="text-primary text-md lg:text-lg my-auto" href="/register">Noch keinen Account? hier Registrieren.</a>
        <button class="btn btn-primary ml-auto btn-md w-full" on:click={login}>Einloggen</button>
      </div>
    </form>
  </div>
</div>

