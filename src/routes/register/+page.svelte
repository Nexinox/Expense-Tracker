<script lang="ts">
	import { goto } from '$app/navigation';
	import { UIMessage } from '$lib/models/UIMessage';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase-types';
	import { currentUIMessages } from '$lib/stores/UIMessages';
	import { onMount } from 'svelte';

	let username: string = '';
	let email: string = '';
	let password: string = '';
	let passwordConfirm: string = '';

	let usernameMessage: string | null = null;
	let emailMessage: string | null = null;
	let passwordMessage: string | null = null;
	let passwordConfirmMessage: string | null = null;

	let debounceTimer: NodeJS.Timeout;
	let loading: boolean = false;
	let usernameAvailable: boolean = false;

	$: usernameTouched = username.length > 0;
	$: usernameValid =
		usernameTouched &&
		username.length >= 3 &&
		username.length < 20 &&
		/^[a-zA-Z0-9_]*$/.test(username);
	$: usernameAvailable = usernameTouched && usernameValid && usernameAvailable;

	$: emailTouched = email.length > 0;
	$: emailValid = emailTouched && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	$: passwordTouched = password.length > 0;
	$: passwordValid = passwordTouched && password.length >= 8;

	$: passwordConfirmTouched = passwordConfirm.length > 0;
	$: passwordConfirmValid = passwordConfirmTouched && passwordConfirm === password;

	$: emailMessage = getEmailMessage(email);
	$: usernameMessage = getUsernameMessage(username, usernameAvailable);
	$: passwordMessage =
		passwordTouched && password.length < 8 ? 'Password must be at least 8 characters long' : null;
	$: passwordConfirmMessage =
		passwordConfirmTouched && passwordConfirm !== password ? 'Passwords do not match' : null;

	function getUsernameMessage(username: string, usernameAvailable: boolean): string | null {
		if (!usernameTouched) return null;
		if (username.length < 3) return 'Username must be at least 3 characters long';
		if (username.length > 20) return 'Username must be at most 20 characters long';
		if (!usernameAvailable && !loading) return 'Username is already taken';
		if (!/^[a-zA-Z0-9_]*$/.test(username)) return 'Only letters, numbers and underscores';

		return null;
	}

	function getEmailMessage(email: string): any {
		if (!emailTouched) return null;
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid E-Mail';

		return null;
	}

	async function checkUsernameAvailability() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			usernameAvailable = false;
			loading = true;

			if (!usernameTouched || !usernameValid) {
				usernameAvailable = false;
				loading = false;
				return;
			}

			await pb
				.collection(Collections.Usernames)
				.getFirstListItem(`username="${username}"`)
				.then((username) => {
					if (username) {
						usernameAvailable = false;
					} else {
						usernameAvailable = true;
					}
				})
				.catch(() => {
					usernameAvailable = true;
				});

			loading = false;
		}, 500);
	}

	async function register() {
		if (!usernameValid || !emailValid || !passwordValid || !passwordConfirmValid) {
			currentUIMessages.update((messages) => [
				...messages,
				new UIMessage({
					type: 'error',
					message: 'Please fill out all fields correctly',
					timeout: 2500
				})
			]);
			return;
		}

		const createdUser = await pb
			.collection(Collections.Users)
			.create({
				username,
				email,
				password,
				passwordConfirm
			})
			.catch(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'error',
						message: 'A user with this email already exists',
						timeout: 5000
					})
				]);
			});

		if (!createdUser || !createdUser.id) {
			return;
		}

		await pb
			.collection(Collections.Usernames)
			.create({
				username,
				user: createdUser?.id
			})
			.then(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'success',
						message: 'Successfully registered, you can now log in',
						timeout: 2500
					})
				]);
				email = '';
				username = '';
				password = '';
				passwordConfirm = '';
				goto('/login');
			})
			.catch(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'error',
						message: 'A user with this username already exists',
						timeout: 5000
					})
				]);
			});
	}

	onMount(() => {
		if ($currentUser) {
			goto('/');
		}
	});
</script>

<div class="card w-4/6 shadow-xl mx-auto bg-neutral text-neutral-content m-6">
	<div class="card-body text-center items-center">
		<h1 class="card-title text-2xl">Register</h1>
		<form class="flex w-2/3 flex-col" on:submit|preventDefault>
			<label
				class="label text-xs"
				for="username"
				class:text-error={!usernameAvailable && usernameTouched && !loading}
				class:text-primary={usernameAvailable || !usernameTouched}
				>{usernameMessage ?? 'Username'}</label
			>
			<input
				class="input w-full"
				class:input-error={!usernameAvailable && usernameTouched && !loading}
				class:input-primary={usernameAvailable || !usernameTouched}
				type="text"
				name="username"
				id="username"
				bind:value={username}
				on:input={checkUsernameAvailability}
			/>

			<label
				class="label text-xs"
				class:text-error={!emailValid && emailTouched}
				class:text-primary={emailValid || !emailTouched}
				for="email"
			>
				{emailMessage ?? 'E-Mail'}</label
			>
			<input
				class="input"
				class:input-error={!emailValid && emailTouched}
				class:input-primary={emailValid || !emailTouched}
				type="text"
				name="email"
				id="email"
				bind:value={email}
			/>

			<label
				class="label text-xs"
				class:text-error={!passwordValid && passwordTouched}
				class:text-primary={passwordValid || !passwordTouched}
				for="password">{passwordMessage ?? 'Password'}</label
			>
			<input
				class="input"
				class:input-error={!passwordValid && passwordTouched}
				class:input-primary={passwordValid || !passwordTouched}
				type="password"
				name="password"
				id="password"
				bind:value={password}
			/>

			<label
				class="label text-xs"
				class:text-error={!passwordConfirmValid && passwordConfirmTouched}
				class:text-primary={passwordConfirmValid || !passwordConfirmTouched}
				for="confirm_password">{passwordConfirmMessage ?? 'Confirm Password'}</label
			>
			<input
				class="input"
				class:input-error={!passwordConfirmValid && passwordConfirmTouched}
				class:input-primary={passwordConfirmValid || !passwordConfirmTouched}
				type="password"
				name="confirm_password"
				id="confirm_password"
				bind:value={passwordConfirm}
			/>

			<div class="card-actions mt-6">
				<a class="text-xs text-primary my-auto" href="/login">Already have an Account?</a>
				<button class="btn btn-primary ml-auto" on:click={register}>Register</button>
			</div>
		</form>
	</div>
</div>
