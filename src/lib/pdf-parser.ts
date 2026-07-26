import pdfParse from 'pdf-parse';

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Failed to parse PDF buffer:', error);
    throw new Error('Could not parse PDF file text content.');
  }
}
