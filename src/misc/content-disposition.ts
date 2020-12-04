import * as ContentDisposition from 'content-disposition';

export function contentDisposition(type: 'inline' | 'attachment', filename: string): string {
	const fallback = filename.replace(/[^\w.-]/g, '_');
	return ContentDisposition(filename, { type, fallback });
}
