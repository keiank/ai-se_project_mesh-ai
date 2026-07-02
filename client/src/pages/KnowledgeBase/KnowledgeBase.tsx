import "./KnowledgeBase.css";
import { useState, useEffect } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import type { KnowledgeDoc } from "../../utils/api";

export default function KnowledgeBase() {
    const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleFileSelect = (file: File) => {
        const newDoc: KnowledgeDoc = {
            _id: Date.now().toString(),
            title: file.name,
            fileName: file.name,
            userId: 'local',
            createdAt: new Date().toISOString(), 
        };
        setDocuments([newDoc, ...documents]);
    };

    return (
        <div className="knowledge-base">
            <h1>Manage Your Knowledge Base</h1>
            <section className="knowledge-base__content">
                <p>Upload documents (PDF)</p>
                <UploadArea onFileSelect={handleFileSelect}/>
                <ul className="knowledge-base__document-list"></ul>
                <button className="knowledge-base__btn-save">Save</button>
            </section>
        </div>);
}