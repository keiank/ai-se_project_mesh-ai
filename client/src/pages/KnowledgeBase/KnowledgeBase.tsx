import "./KnowledgeBase.css";
import Delete from "../../assets/Delete.svg";
import { useState, useEffect } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments, type KnowledgeDoc } from "../../utils/api";
import { uploadDocument, deleteDocument } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function KnowledgeBase() {
    const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { currentUser } = useAuth();

    const handleFileSelect = async (file: File) => {
        setIsUploading(true);
        setError(null);
        try {
            if (file.size === 0) {
                throw new Error("Please provide a non-empty PDF");
            }
            const res = await uploadDocument(file);
            if (res.data) {
                setDocuments((prev) => [res.data!, ...prev]);
            }
        } catch {
            setError("Unable to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDoc = async (doc: KnowledgeDoc) => {
        setError(null);
        try {
            const res = await deleteDocument(doc, currentUser);
            if (res.data) {
                setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
            }
        } catch {
            setError("Unable to delete document");
        }
    }

    useEffect(() => {
        const load = async () => {
            setError(null);
            try {
                const res = await getDocuments();
                setDocuments(res?.data || []);
            }
            catch {
                setError("Failed to load documents");
            }
            finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="knowledge-base">
            <h1>Manage Your Knowledge Base</h1>
            <section className="knowledge-base__content">
                <p className="knowledge-base__upload-label">Upload documents (PDF)</p>
                <UploadArea onFileSelect={handleFileSelect} isUploading={isUploading} />
                <ul
                className="knowledge-base__document-list">
                    {isLoading && (
                        <p className="knowledge-base__document-list_message">Loading...</p>
                    )}
                    {!isLoading && error && (
                        <p className="knowledge-base__document-list_error knowledge-base__document-list_message">{error}</p>
                    )}
                    {!isLoading && !error && documents.length === 0 && (
                        <p className="knowledge-base__document-list_message">No documents yet.</p>
                    )}
                    {!isLoading && !error && documents.length > 0 && (
                        documents.map((d) => {
                            return (<span className="knowledge-base__document" key={d._id}>
                                {d.fileName}
                                <button
                                className="knowledge-base__document_delete-btn"
                                aria-label="Delete document button"
                                onClick={() => handleDeleteDoc(d)}>
                                    <img src={Delete}></img>
                                </button>
                                </span>);
                        })
                    )}</ul>
            </section>
        </div>);
}