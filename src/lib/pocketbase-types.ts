/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Expenses = "expenses",
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

export enum ExpensesRepeatTypeOptions {
	"DAILY" = "DAILY",
	"WEEKLY" = "WEEKLY",
	"MONTHLY" = "MONTHLY",
	"YEARLY" = "YEARLY",
	"EVERY_X_DAYS" = "EVERY_X_DAYS",
	"EVERY_X_WEEKS" = "EVERY_X_WEEKS",
	"EVERY_X_MONTHS" = "EVERY_X_MONTHS",
	"EVERY_X_YEARS" = "EVERY_X_YEARS",
	"ONCE" = "ONCE",
}
export type ExpensesRecord = {
	amount: number
	dueOn: IsoDateString
	name: string
	repeatType: ExpensesRepeatTypeOptions
	serviceIconUrl?: string
	serviceName: string
	serviceUrl?: string
	unitsInBetween?: number
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
export type UsernamesResponse<Texpand = unknown> = Required<UsernamesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	expenses: ExpensesRecord
	usernames: UsernamesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	expenses: ExpensesResponse
	usernames: UsernamesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'expenses'): RecordService<ExpensesResponse>
	collection(idOrName: 'usernames'): RecordService<UsernamesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
