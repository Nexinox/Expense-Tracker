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
	let currency: string = '';

	let usernameMessage: string | null = null;
	let emailMessage: string | null = null;
	let passwordMessage: string | null = null;
	let passwordConfirmMessage: string | null = null;
	let currencyMessage: string | null = null;

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

	$: currencyTouched = currency.length > 0;
	$: currencyValid = currencyTouched && currency.length > 0;

	$: emailMessage = getEmailMessage(email);
	$: usernameMessage = getUsernameMessage(username, usernameAvailable);
	$: passwordMessage =
		passwordTouched && password.length < 8 ? 'Passwort muss mindestends 8 Zeichen lang sein.' : null;
	$: passwordConfirmMessage =
		passwordConfirmTouched && passwordConfirm !== password ? 'Passwörter sind nicht gleich.' : null;

	function getUsernameMessage(username: string, usernameAvailable: boolean): string | null {
		if (!usernameTouched) return null;
		if (username.length < 3) return 'Benutzername muss mindestens 3 Zeichen lang sein.';
		if (username.length > 20) return 'Benutzername darf maximal 20 Zeichen lang sein.';
		if (!usernameAvailable && !loading) return 'Benutzername ist schon vergeben.';
		if (!/^[a-zA-Z0-9_]*$/.test(username)) return 'Nur Buchstaben, Nummern und Unterstriche.';

		return null;
	}

	function getEmailMessage(email: string): any {
		if (!emailTouched) return null;
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-Mail Adresse ungültig.';

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
					message: 'Bitte alle benötigten felder ausfüllen.',
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
				passwordConfirm,
				currency
			})
			.catch(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'error',
						message: 'Ein Benutzer mit der E-Mail existiert bereits.',
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
						message: 'Erfolgreich Registriert. Sie können sich jetzt einloggen.',
						timeout: 2500
					})
				]);
				email = '';
				username = '';
				password = '';
				passwordConfirm = '';
				currency = '';
				goto('/login');
			})
			.catch(() => {
				currentUIMessages.update((messages) => [
					...messages,
					new UIMessage({
						type: 'error',
						message: 'Ein Benutzer mit dem Benutzernamen existiert bereits.',
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

<div class="card w-full lg:w-4/6 shadow-xl mx-auto bg-neutral text-neutral-content m-6">
	<div class="card-body text-center items-center p-4 lg:p-6">
		<h1 class="card-title text-2xl">Registrieren</h1>
		<form class="flex w-full lg:w-2/3 flex-col" on:submit|preventDefault>
			<label
				class="label text-base"
				for="username"
				class:text-error={!usernameAvailable && usernameTouched && !loading}
				class:text-primary={usernameAvailable || !usernameTouched}
				>{usernameMessage ?? 'Benutzername'}</label
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
				class="label text-base"
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
				class="label text-base"
				class:text-error={!currencyValid && currencyTouched}
				class:text-primary={currencyValid || !currencyTouched}
				for="currency">{currencyMessage ?? 'Währung'}
			</label>

			<input
				class="input"
				class:input-error={!currencyValid && currencyTouched}
				class:input-primary={currencyValid || !currencyTouched}
				type="text"
				name="currency"
				id="currency"
				bind:value={currency}
			/>

			<label
				class="label text-base"
				class:text-error={!passwordValid && passwordTouched}
				class:text-primary={passwordValid || !passwordTouched}
				for="password">{passwordMessage ?? 'Passwort'}</label
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
				class="label text-base"
				class:text-error={!passwordConfirmValid && passwordConfirmTouched}
				class:text-primary={passwordConfirmValid || !passwordConfirmTouched}
				for="confirm_password">{passwordConfirmMessage ?? 'Passwort bestätigen'}</label
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
				<a class="text-base text-primary my-auto" href="/login">Haben sie bereits einen Account? Zum Login.</a>
				<button class="btn btn-primary ml-auto mt-4" on:click={register}>Registrieren</button>
			</div>
		</form>
	</div>
</div>
