<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Quiz } from '$lib/langchain-response-formatter';
	import { quiz } from '$lib/store.svelte';

	let file = $state<File>();
	let questionNumber = $state(10);
	let loading = $state(false);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files as FileList;
		if (files.length > 0) {
			if (files[0].size > 5 * 1024 * 1024) {
				alert('File size must be less than 5MB');
				target.value = '';
				return;
			}

			file = files[0];
		}
	}

	async function uploadFile() {
		loading = true;

		if (!file) {
			alert('Please select a file first.');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/pdf-loader', {
				method: 'POST',
				body: formData
			});

			const { text: fileText } = await response.json();

			const response2 = await fetch('/api/generate-questions', {
				method: 'POST',
				body: JSON.stringify({
					fileText
				})
			});
			const data2: { quiz: Quiz } = await response2.json();
			quiz.questions = data2.quiz.questions;

			console.log(quiz.questions);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			goto('/quiz');
		} catch (error) {
			console.error('Upload failed:', error);
			alert('Failed to upload file.');
		}
	}
</script>

<div class="container flex min-h-screen flex-col items-center justify-center gap-8">
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-6xl font-black">QuickQuiz AI</h1>
		<p class="text-xl">Turn your PDF into a Quiz—instantly!</p>
	</div>

	<div class="flex w-full max-w-2xl flex-col gap-2">
		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend">How many question do you want?</legend>
			<input type="text" class="input w-full" placeholder="Type here" bind:value={questionNumber} />
		</fieldset>
		<fieldset class="fieldset w-full">
			<input
				id="file"
				type="file"
				accept="application/pdf"
				class="file-input w-full"
				onchange={handleFileChange}
			/>
			<label for="file" class="fieldset-label">Max size 5MB</label>
		</fieldset>
	</div>

	<button class={['btn btn-primary font-bold', loading && 'btn-disabled']} onclick={uploadFile}
		>{loading ? 'Loading... It may take a few seconds' : 'Generate Quiz!'}</button
	>
</div>
