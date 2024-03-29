import type { TypedPocketBase, UsersResponse } from "$lib/pocketbase-types";
import PocketBase from "pocketbase";
import { writable } from "svelte/store";

// get website url without trailing slash or port

export const pb = new PocketBase(`http://192.168.1.152:8090/`) as TypedPocketBase

export const currentUser = writable<UsersResponse | null>(null);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model as UsersResponse | null);
});

