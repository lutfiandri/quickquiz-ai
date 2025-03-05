import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	if (!file) {
		return error(400, 'No file provided');
	}

	const loader = new PDFLoader(file, {
		splitPages: false
	});

	const doc = await loader.load();
	const text = doc.at(0)?.pageContent ?? '';

	return json({ text });
};
