import "./Chat.css";
import { useEffect, useState } from "react";
import type { Message } from "../../utils/api";
import { getChats, createChat, getChat } from "../../utils/api";
import type { Chat as ChatType } from "../../utils/api";
import SendButton from "../../assets/SendMsg.png";
import ErrorIcon from "../../assets/ErrorIcon.png";

export default function Chat() {
    // For chat sidebar
    const [chats, setChats] = useState<ChatType[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [chatsError, setChatsError] = useState<string | null>(null);
    const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
    const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
    const [newChatTitle, setNewChatTitle] = useState<string>('');
    // For chat main area
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [messagesError, setMessagesError] = useState<string>("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getChats();
                setChats(res.data || []);
            } catch {
                setChatsError("Unable to load chats");
            } finally {;
                setIsLoadingChats(false);
            }
        }

        load();
    }, []);

    useEffect(() => {
        if (!activeChatId) return;
        const load = async () => {
            setMessages([]);
            setMessagesError("");
            setIsLoadingMessages(true);
            try {
                const res = await getChat(activeChatId);
                setMessages(res.data?.messages || []);
                console.log(res.data?.messages);
            } catch {
                setMessagesError("Unable to load chat messages");
            } finally {
                setIsLoadingMessages(false);
            }
        };

        load();
    }, [activeChatId]);

    const handleCreateChat = async () => {
        const title = newChatTitle.trim() || 'New Chat';
        setIsCreatingChat(false);
        setNewChatTitle("")
        try {
            const res = await createChat(title);
            if (res.data) {
                setChats([res.data!, ...chats]);
                setActiveChatId(res.data!._id);
            }
        } catch {
            <p className="chat__error-msg">Unable to create new chat</p>
        }
    };

    return (
        <div className="chat">
            <aside className="chat__sidebar">
                <button
                className="chat__new-btn"
                type="button"
                onClick={() => setIsCreatingChat(true)}>
                    + New Chat
                </button>

                {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
                {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

                <ul className="chat__list">
                    <li>
                        {isCreatingChat && (
                        <input
                        className="chat__title-input"
                        type="text"
                        placeholder="Chat name"
                        value={newChatTitle}
                        onChange={(e) => {setNewChatTitle(e.target.value)}}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateChat();
                            if (e.key === 'Escape') {
                                setNewChatTitle("");
                                setIsCreatingChat(false);
                            }
                        }}
                        autoFocus
                        />
                        )}
                    </li>
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
            <div className="chat__main">
                {!messagesError && !isLoadingMessages && !activeChatId && (
                    <div className="chat__no-messages">
                        <p className="no-messages__text">Create a new chat or select an existing chat to start the conversation</p>
                        <button className="chat__no-messages-btn chat__main-btn" type="button">Start New Chat</button>
                    </div>
                )}
                
                {!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
                    <div className="chat__no-messages">
                        <p className="no-messages__text">Ask a question below to start the conversation</p>
                        <div className="chat__no-messages-input">
                            <textarea
                            className="chat__input"
                            placeholder="Ask any question">
                            </textarea>
                            <button className="chat__send-msg-btn chat__main-btn" type="button">
                                <img
                                src={SendButton}
                                alt="Send message button">
                                </img>
                            </button>
                        </div>
                    </div>
                )}

                {activeChatId && isLoadingMessages && (
                    <p className="chat__no-messages chat__no-messages_loading">
                        Loading...
                    </p>
                )}

                {activeChatId && messagesError && (
                    <div className="chat__error">
                        <img src={ErrorIcon} className="error__image"></img>
                        <div className="error__container">
                            <p className="container__message">Looks like something went wrong</p>
                            <p className="container__message-detail">Try reloading the page or creating the chat again</p>
                        </div>
                        <button className="error__button chat__main-btn" type="button">Go to the main page</button>
                    </div>
                )}

                {activeChatId && !isLoadingMessages && !messagesError && (
                    <ul className="chat__messages">
                    {/* "Chat with loaded messages" Figma frame. */}
                    {/* At this stage, you don't need to build the input area yet. */}
                    {/* See styling hints below. */}
                    </ul>
                )}
                </div>
        </div>
    );
}