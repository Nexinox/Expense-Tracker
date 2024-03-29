import { currentUser, pb } from "$lib/pocketbase";
import { Collections, type IncomesResponse } from "$lib/pocketbase-types";
import { derived, type Readable } from "svelte/store";

export const incomes: Readable<IncomesResponse[]> = derived<typeof currentUser, IncomesResponse[]>(currentUser, ($currentUser, set, update) => {
  if (!$currentUser) {
    set([]);
    return;
  }
  pb.collection(Collections.Incomes).getFullList({
    filter: `user="${$currentUser.id}"`,
    sort: "-created"
  }).then((res) => {
    set(res);
  }).catch(() => {
    set([]);
  });

  pb.collection(Collections.Incomes).subscribe("*", async ({action, record}) => {
    if (action === "create") {
      update((incomes) => [record, ...incomes]);
    }else if (action === "update") {
      update((incomes) => incomes.map((income) => income.id === record.id ? record : income));
    }else if (action === "delete") {
      update((incomes) => incomes.filter((expense) => expense.id !== record.id));
    }
  });
});
