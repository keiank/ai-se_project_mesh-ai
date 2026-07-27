import type { CurrentUser } from "../types";

const BASE_URL = "/api";

export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

export const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";
    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }
    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json();
};

export const getDocuments = async (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>(`${BASE_URL}/documents`);
};

export const uploadDocument = async (file: File): Promise<ApiResponse<KnowledgeDoc>> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(`${BASE_URL}/documents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json();
}

export const deleteDocument = async (doc: KnowledgeDoc, user: CurrentUser | null): Promise<ApiResponse<KnowledgeDoc>> => {
  if (!user) {
    throw new Error("Must be logged in");
  }

  const token = localStorage.getItem("auth-token") ?? "";
  const res = await fetch(`${BASE_URL}/documents/${doc._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user }),
  });

  if (res.status === 404) {
    throw new Error("Document does not exist");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json();
}

export const getChats = async (): Promise<ApiResponse<Chat[]>> => {
  return request<Chat[]>(`${BASE_URL}/chats`);
};

export const getChat = async (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
  return request(`${BASE_URL}/chats/${id}`);
};

export const createChat = async (title: string): Promise<ApiResponse<Chat>> => {
  return request<Chat>(`${BASE_URL}/chats`, {
    method: 'POST',
    body: JSON.stringify({ title })
  });
};

export const sendMessage = async (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message[]>> => {
  return request<Message[]>(`${BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ question })
  });
};

export const getCurrentUser = async () => {
  return request<{ user: CurrentUser}>(`${BASE_URL}/auth/me`);
};

export const loginUser = async (email: string, password: string) => {
  return request<{ token: string; user: CurrentUser}>(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export const registerUser = async (name: string, email: string, password: string) => {
  return request<{ user: CurrentUser}>(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({email, password, name}),
  });
};
