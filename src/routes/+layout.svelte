<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { currentUIMessages } from '$lib/stores/UIMessages';
	import '../app.css';

	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import ProfileButton from '$lib/components/ProfileButton.svelte';
	import { onMount } from 'svelte';
	import UIMessageList from './../lib/components/UIMessageList.svelte';

	$currentUIMessages;
	$currentUser;

	onMount(async () => {
		if (pb.authStore.model && pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		} else {
			pb.authStore.clear();
		}
	});
</script>

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-300">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-6 h-6 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</label>
			</div>
			<div class="flex-1 px-2 mx-2 text-xl">Finanz Tracker</div>
			<div class="flex-none hidden lg:block">
				<ul class="menu menu-horizontal menu-lg flex text-base items-center h-full w-full">
					<li>
						<a href="/overview">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24"
								><title>finance</title><path
									d="M6,16.5L3,19.44V11H6M11,14.66L9.43,13.32L8,14.64V7H11M16,13L13,16V3H16M18.81,12.81L17,11H22V16L20.21,14.21L13,21.36L9.53,18.34L5.75,22H3L9.47,15.66L13,18.64"
								/></svg
							>
							Übersicht
						</a>
					</li>
					<li>
						<a href="/expense">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24"
								><title>format-list-bulleted</title><path
									d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"
								/></svg
							>
							Ausgaben
						</a>
					</li>
					<li>
						<a href="/income">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24"
								><title>format-list-bulleted</title><path
									d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"
								/></svg
							>
							Einnahmen
						</a>
					</li>
					<li class="flex flex-row items-center ml-5">
						<ProfileButton />
						<LogoutButton />
					</li>
				</ul>
			</div>
		</div>
		<!-- Content -->
		<div class="min-h-screen flex flex-col">
			<slot />
		</div>
	</div>
	<!-- Sidebar -->
	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu menu-md p-4 w-85 min-h-full bg-base-200 text-base">
			<li class="flex flex-row items-center mb-4">
				<ProfileButton />
				<LogoutButton />
			</li>
			<li>
				<a href="/overview">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="currentColor"
						viewBox="0 0 24 24"
						><title>finance</title><path
							d="M6,16.5L3,19.44V11H6M11,14.66L9.43,13.32L8,14.64V7H11M16,13L13,16V3H16M18.81,12.81L17,11H22V16L20.21,14.21L13,21.36L9.53,18.34L5.75,22H3L9.47,15.66L13,18.64"
						/></svg
					>
					Übersicht
				</a>
			</li>
			<li>
				<a href="/expense">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="currentColor"
						viewBox="0 0 24 24"
						><title>format-list-bulleted</title><path
							d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"
						/></svg
					>
					Ausgaben
				</a>
			</li>
			<li>
				<a href="/income">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="currentColor"
						viewBox="0 0 24 24"
						><title>format-list-bulleted</title><path
							d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"
						/></svg
					>
					Einnahmen
				</a>
			</li>
		</ul>
	</div>
</div>

<UIMessageList />
