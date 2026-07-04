import "./Chat.css";
import { useEffect, useState } from "react";
import { getChats, createChat } from "../../utils/api";
import type { Chat as ChatType } from "../../utils/api";

export default function Chat() {
    const [chats, setChats] = useState<ChatType[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [chatsError, setChatsError] = useState<string | null>(null);
    const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
    const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
    const [newChatTitle, setNewChatTitle] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getChats();
                setChats(res.data || []);
                console.log(res.data);
            } catch {
                setChatsError("Unable to load chats");
            } finally {;
                setIsLoadingChats(false);
            }
        }

        load();
    }, []);

    return (
        <div className="chat">
            <aside className="chat__sidebar">
                <button className="chat__new-btn" type="button">
                    + New Chat
                </button>

                {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
                {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

                <ul className="chat__list">
                    {chats.map((c) => (
                        <li
                        key={c._id}
                        className={
                            c._id === activeChatId
                            ? 'chat__item chat__item_active'
                            : 'chat__item'
                        }
                        onClick={() => setActiveChatId(c._id)}
                        >
                            {c.title}
                        </li>
                    ))
                    }
                </ul>
            </aside>
            <div className="chat__main">{/* message area — coming next lesson */}</div>
        </div>
    );
}