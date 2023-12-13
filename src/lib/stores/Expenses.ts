import { currentUser, pb } from "$lib/pocketbase";
import { Collections, type ExpensesResponse } from "$lib/pocketbase-types";
import { derived, type Readable } from "svelte/store";

export const expenses: Readable<ExpensesResponse[]> = derived<typeof currentUser, ExpensesResponse[]>(currentUser, ($currentUser, set, update) => {
  if (!$currentUser) {
    set([]);
    return;
  }
  pb.collection(Collections.Expenses).getFullList({
    filter: `user="${$currentUser.id}"`,
    sort: "-created"
  }).then((res) => {
    set(res);
  }).catch(() => {
    set([]);
  });

  pb.collection(Collections.Expenses).subscribe("*", async ({action, record}) => {
    if (action === "create") {
      update((expenses) => [record, ...expenses]);
    }else if (action === "update") {
      update((expenses) => expenses.map((expense) => expense.id === record.id ? record : expense));
    }else if (action === "delete") {
      update((expenses) => expenses.filter((expense) => expense.id !== record.id));
    }
  });
});
