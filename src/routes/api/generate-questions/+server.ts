import { QuizSchema } from '$lib/langchain-response-formatter';
import type { Quiz } from '$lib/langchain-response-formatter';
import { ChatOpenAI } from '@langchain/openai';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const text = data.fileText as string;

	const model = new ChatOpenAI({
		modelName: 'gpt-4o-mini',
		temperature: 0.2
	});

	const modelWithStructure = model.withStructuredOutput(QuizSchema);

	const aiMessage = await modelWithStructure.invoke(`
	You are an AI agent designed to generate questions based on the content of a file.
	
	Please generate 10 questions, with each question having 4 options and an explanation for the correct answer.
	You MUST generate the correct options in a random order for each question.
	
	You MUST generate questions ONLY FROM TEXT BELOW:

	${text}
	`);

	const quiz = QuizSchema.parse(aiMessage);

	return json({ quiz: quiz });
};
