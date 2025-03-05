<script lang="ts">
	import { goto } from '$app/navigation';
	import { quiz, quizProgress } from '$lib/store.svelte';

	let question = $derived(quiz.questions.at(quizProgress.activeQuestionIndex));

	let correctIndex = $derived(question?.options.findIndex((option) => option.correct));

	let answerIndex = $state(-1);

	function handleAnswer(event: Event) {
		const target = event.target as HTMLButtonElement;
		if (answerIndex !== -1) {
			return;
		}

		answerIndex = Number(target.value);
		if (answerIndex === correctIndex) {
			quizProgress.score += 1;
		}
	}

	let isLastQuestion = $derived(quizProgress.activeQuestionIndex === quiz.questions.length - 1);

	function handleNext() {
		if (isLastQuestion) {
			goto('/result');
			return;
		}

		quizProgress.activeQuestionIndex += 1;
		answerIndex = -1;
	}
</script>

<div class="container max-w-2xl">
	{#if question}
		<div class="flex min-h-screen flex-col gap-4 py-16">
			<div
				class="border-base-300 rounded-box grid min-h-[30vh] w-full place-items-center border-2 p-4"
			>
				<p class="text-center text-2xl leading-relaxed font-medium">
					{question.text}
				</p>
			</div>
			<div class="grid grid-cols-2 gap-2">
				{#each question.options as option, index (option.text)}
					<div class="w-full">
						<button
							class={[
								'btn btn-lg h-auto min-h-[12vh] w-full py-3',
								answerIndex !== -1 && option.correct && 'btn-accent',
								answerIndex !== -1 && answerIndex === index && !option.correct && 'btn-error'
							]}
							value={index}
							onclick={handleAnswer}>{option.text}</button
						>
					</div>
				{/each}
			</div>

			{#if answerIndex !== -1}
				<div class="my-4 flex flex-col">
					<div class="font-bold opacity-100">Explanation</div>
					<div>{question.explanation}</div>
				</div>

				<button
					class={['btn btn-lg', isLastQuestion ? 'btn-accent' : 'btn-primary']}
					onclick={handleNext}>{isLastQuestion ? 'Finish ✔' : 'Next'}</button
				>
			{/if}
		</div>
	{/if}
</div>
