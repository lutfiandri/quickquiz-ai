import type { Quiz } from './langchain-response-formatter';

export const quiz = $state<Quiz>({
	questions: [
		// {
		// 	text: 'mengapa bumi itu bulat?',
		// 	options: [
		// 		{ text: 'why u ask me', correct: false },
		// 		{ text: 'karena bukan donat', correct: false },
		// 		{ text: 'karena bumi itu bulat', correct: true },
		// 		{ text: 'mana mungkin, bumi itu datar', correct: false }
		// 	],
		// 	explanation: 'ya jelas karena bumi itu bulat bro'
		// }
	]
});

export const quizProgress = $state({
	activeQuestionIndex: 0,
	score: 0,
	answers: [] // array of option (0,1,2,3)
});
