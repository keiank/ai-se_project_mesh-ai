type ChunkCandidate = {
    id: string;
    documentId: string;
    text: string;
    embedding: number[];
};

type ScoredChunk = {
    id: string;
    documentId: string;
    text: string;
    score: number;
};

/**
 * Find the dot product of 2 embedding matrices
 *
 * @param {number[]} a - The first matrix.
 * @param {number[]} b - The second matrix.
 * @returns {number} - Dot product of 2 input matrices.
 */
const dot = (a: number[], b: number[]): number => {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i += 1) {
        sum += (a[i] ?? 0) * (b[i] ?? 0);
    }
    return sum;
}

/**
 * The magnitude of an input matrix.
 *
 * @param {number[]} vec - Input matrix.
 * @returns {number} - The input matrix's absolute length
 */
const magnitude = (vec: number[]): number => {
    let sum = 0;
    for (const v of vec) {
        sum += v * v;
    }
    return Math.sqrt(sum) || 1;
};

/**
 * Find the "limit" number of similar embedding chunks.
 *
 * @param {number[]} queryEmbedding - Embedding representing the input question
 * @param {ChunkCandidate[]} items - The chunks to be compared with question for similarity.
 * @returns {ScoredChunk[]} - "limit" number of chunks in descending order of relevance to input question.
 */
export const rankBySimilarity = (
    queryEmbedding: number[],
    items: ChunkCandidate[],
    limit = 5
): ScoredChunk[] => {
    const queryMagnitude = magnitude(queryEmbedding);

    const scored = items.map((item) => {
        const score = dot(queryEmbedding, item.embedding) / (queryMagnitude * magnitude(item.embedding));
        return { id: item.id, documentId: item.documentId, text: item.text, score };
    });

    // sort descending i.e. [12, 11, 10, ...]
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
}