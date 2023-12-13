import  PocketBase  from "pocketbase";
import { writable } from "svelte/store";
import type { TypedPocketBase, UsersResponse } from "$lib/pocketbase-types";

export const pb = new PocketBase("http://localhost:8090/") as TypedPocketBase

export const currentUser = writable<UsersResponse | null>(null);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model as UsersResponse | null);
});

