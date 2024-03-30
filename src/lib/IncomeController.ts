import { pb } from "$lib/pocketbase";
import { Collections, type IncomesResponse, IncomesTypeOptions } from "$lib/pocketbase-types";

export async function createIncome(income: IncomesResponse): Promise<IncomesResponse> {
    return pb.collection(Collections.Incomes)
    .create({
        name: income.name,
        amount: income.amount,
        from: income.from,
        type: income.type,
        incomeOn: income.incomeOn,
        group: income.group,
        user: income.user
    })
}

export async function updateIncome(income: IncomesResponse): Promise<IncomesResponse> {
    return pb.collection(Collections.Incomes)
    .update(income.id, {
        name: income.name,
        amount: income.amount,
        from: income.from,
        type: income.type,
        incomeOn: income.incomeOn,
        group: income.group
    })
}

export async function deleteIncome(id: string): Promise<boolean> {
    return pb.collection(Collections.Incomes)
    .delete(id)
}

export function getEmptyIncome(userID: string): IncomesResponse {
    return {
        id: "",
        name: "",
        amount: 0,
        from: "",
        type: IncomesTypeOptions.MONTHLY,
        incomeOn: "",
        group: "",
        collectionId: Collections.Incomes,
        collectionName: Collections.Incomes,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        user: userID
    }
}