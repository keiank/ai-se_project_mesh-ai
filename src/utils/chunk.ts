const CHUNK_SIZE = 500;

/**
 * Split an incoming string into chunks.
 * 
 * Chunk sizes are intended to be large enough
 * to provide context for a question to an LLM
 * but small enough to avoid matching irrelevant sections
 * of text.
 * 
 * Using a small enough chunk size also ensures
 * the reference document embeddings can have high
 * match values for relevant text and low values for
 * all other text.
 *
 * @param {string} text - The text to be chunked.
 * @returns {string[]} - Chunked text
 */
export const chunkText = (text: string): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        chunks.push(text.slice(i, i + CHUNK_SIZE));
    }
    return chunks;
};