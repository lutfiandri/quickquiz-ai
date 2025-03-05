<script lang="ts">
	import { goto } from '$app/navigation';
	import { quiz, quizProgress } from '$lib/store.svelte';

	function handleRetake() {
		quizProgress.score = 0;
		quizProgress.activeQuestionIndex = 0;
		goto('/quiz');
	}

	function handleBackToHome() {
		quizProgress.score = 0;
		quizProgress.activeQuestionIndex = 0;
		goto('/');
	}
</script>

<div class="container max-w-3xl">
	<div class="grid min-h-screen place-items-center py-16">
		<div class="flex flex-col gap-4">
			<h1 class="text-center text-2xl font-bold">
				Impressive, you got <span class="font-black"
					>{quizProgress.score}/{quiz.questions.length}</span
				> correct!
			</h1>

			<div class="grid grid-cols-2 gap-2">
				<button onclick={handleRetake} class="btn">Retake the quiz</button>
				<button onclick={handleBackToHome} class="btn btn-primary"
					>Back to home, do another quiz!</button
				>
			</div>
		</div>
	</div>
</div>
