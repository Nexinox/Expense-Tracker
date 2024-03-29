/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Expenses = "expenses",
	Incomes = "incomes",
	Usernames = "usernames",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum ExpensesRecurringTypeOptions {
	"ONCE" = "ONCE",
	"DAILY" = "DAILY",
	"WEEKLY" = "WEEKLY",
	"MONTHLY" = "MONTHLY",
	"YEARLY" = "YEARLY",
}
export type ExpensesRecord = {
	amount: number
	dueOn: string
	interval?: number
	name: string
	recurringType: ExpensesRecurringTypeOptions
	serviceIconUrl?: string
	serviceName: string
	serviceUrl?: string
	user: RecordIdString
}

export enum IncomesTypeOptions {
	"ONCE" = "ONCE",
	"MONTHLY" = "MONTHLY",
	"AVERAGE_OF_GROUP" = "AVERAGE_OF_GROUP",
}
export type IncomesRecord = {
	amount: number
	from?: string
	group?: string
	incomeOn: IsoDateString
	name: string
	type: IncomesTypeOptions
	user: RecordIdString
}

export type UsernamesRecord = {
	user: RecordIdString
	username?: string
}

export type UsersRecord = {
	avatar?: string
	currency: string
}

// Response types include system fields and match responses from the PocketBase API
export type ExpensesResponse<Texpand = unknown> = Required<ExpensesRecord> & BaseSystemFields<Texpand>
export type IncomesResponse<Texpand = unknown> = Required<IncomesRecord> & BaseSystemFields<Texpand>
export type UsernamesResponse<Texpand = unknown> = Required<UsernamesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	expenses: ExpensesRecord
	incomes: IncomesRecord
	usernames: UsernamesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	expenses: ExpensesResponse
	incomes: IncomesResponse
	usernames: UsernamesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'expenses'): RecordService<ExpensesResponse>
	collection(idOrName: 'incomes'): RecordService<IncomesResponse>
	collection(idOrName: 'usernames'): RecordService<UsernamesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
