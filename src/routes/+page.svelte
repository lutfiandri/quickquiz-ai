<script lang="ts">
	import type { Quiz } from '$lib/langchain-response-formatter';
	import { quiz } from '$lib/store.svelte';

	let file = $state<File>();

	$effect(() => {
		console.log(file);
	});

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		console.log(target.files);
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
		} catch (error) {
			console.error('Upload failed:', error);
			alert('Failed to upload file.');
		}
	}
</script>

<div class="container flex min-h-screen flex-col items-center justify-center gap-8">
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-6xl font-black">QuickQuiz AI</h1>
		<p class="text-xl">Turn your PDFs into a Quiz—instantly!</p>
	</div>

	<fieldset class="fieldset w-full max-w-2xl">
		<input
			id="file"
			type="file"
			accept="application/pdf"
			class="file-input w-full"
			onchange={handleFileChange}
		/>
		<label for="file" class="fieldset-label">Max size 5MB</label>
	</fieldset>

	<button class="btn btn-primary font-bold" onclick={uploadFile}>Generate Quiz!</button>

	<div>{JSON.stringify(quiz)}</div>
</div>
