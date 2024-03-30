import type { TypedPocketBase, UsersResponse } from "$lib/pocketbase-types";
import PocketBase from "pocketbase";
import { writable } from "svelte/store";

export const pb = new PocketBase(`http://tracker.internal:8090/`) as TypedPocketBase

export const currentUser = writable<UsersResponse | null>(null);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model as UsersResponse | null);
});

