import { QueryClient } from "@tanstack/react-query";

async function throwIfNotOk(response: Response) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `HTTP Error: ${response.status}`);
  }
}

export async function apiRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });
  await throwIfNotOk(res);
  return res.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        await throwIfNotOk(res);
        return res.json();
      },
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
