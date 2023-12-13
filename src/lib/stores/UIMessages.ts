import type { UIMessage } from "$lib/models/UIMessage";
import { writable } from "svelte/store";


export const currentUIMessages = writable<UIMessage[]>([]);

