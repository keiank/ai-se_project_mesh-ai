import { getClient } from './openai-client.js';

const EMBEDDING_MODEL = 'Qwen/Qwen3-Embedding-8B';

/**
 * Create an embedding from input text.
 * 
 * This transforms human readable text into
 * a matrix using the embedding LLM, which is
 * stored on application servers.
 * 
 * The embedding is cheaper to use repeatedly than
 * querying the LLM chat API directly. The matrix
 * is compared with other embedding matrices for
 * similarity. NOTE: same LLM must be used with
 * all matrices being compared.
 *
 * @param {string} text - A chunk of text to create an embedding for.
 * @returns {Promise<number[]>} - The matrix representing the text.
 */
export const createEmbedding = async (text: string): Promise<number[]> => {
    const response = await getClient().embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
    });
    return response.data[0]!.embedding;
};