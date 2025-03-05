import { z } from 'zod';

export const QuizSchema = z.object({
	questions: z.array(
		z.object({
			text: z.string().describe("the question's text"),
			options: z
				.array(
					z.object({
						text: z.string(),
						correct: z.boolean()
					})
				)
				.describe('multiple-choice options'),
			explanation: z.string().describe('explanation for the correct answer')
		})
	)
});

export type Quiz = z.infer<typeof QuizSchema>;
