import { pb } from "$lib/pocketbase";
import { Collections, ExpensesRecurringTypeOptions, type ExpensesResponse } from "$lib/pocketbase-types";

export function getEmptyExpense(userID: string): ExpensesResponse {
    return {
		name: '',
		amount: 0,
		serviceName: '',
		serviceUrl: '',
		serviceIconUrl: '',
		recurringType: ExpensesRecurringTypeOptions.MONTHLY,
		interval: 1,
		user: userID,
		dueOn: new Date().toISOString(),
		id: '',
		created: new Date().toISOString(),
		updated: new Date().toISOString(),
		collectionId: '',
		collectionName: Collections.Expenses,
	};
}

export async function createExpense(item: ExpensesResponse): Promise<ExpensesResponse> {
    return pb.collection(Collections.Expenses)
        .create({
            user: item.user,
            name: item.name,
            amount: item.amount,
            dueOn: item.dueOn,
            interval: item.interval,
            recurringType: item.recurringType,
            serviceName: item.serviceName,
            serviceUrl: item.serviceUrl,
            serviceIconUrl: item.serviceIconUrl,
        })
}

export async function updateExpense(item: ExpensesResponse): Promise<ExpensesResponse> {
    return pb.collection(Collections.Expenses)
        .update(item.id, {
            user: item.user,
            name: item.name,
            amount: item.amount,
            dueOn: item.dueOn,
            interval: item.interval,
            recurringType: item.recurringType,
            serviceName: item.serviceName,
            serviceUrl: item.serviceUrl,
            serviceIconUrl: item.serviceIconUrl,
        })
}

export async function deleteExpense(id: string): Promise<boolean> {
    return pb.collection(Collections.Expenses).delete(id)
}