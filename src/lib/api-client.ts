import { getCurrentUser } from '@/lib/firebase/auth';

/**
 * 認証付きfetchラッパー
 *
 * Firebase Auth の currentUser.uid をヘッダー `userId` に自動付与する。
 * JSON レスポンスのパースと基本的なエラーハンドリングを含む。
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiClientOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export { ApiError };

/**
 * 認証付きAPIリクエストを送る
 *
 * @example
 * // GET
 * const quest = await apiClient('/api/quests/today');
 *
 * // POST
 * const result = await apiClient('/api/submissions/create', {
 *   method: 'POST',
 *   body: { questId, answer },
 * });
 */
export async function apiClient<T = unknown>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers: extraHeaders = {} } = options;

  const user = getCurrentUser();
  if (!user) {
    throw new ApiError(401, 'ログインが必要です');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    userId: user.uid,
    ...extraHeaders,
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(path, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
