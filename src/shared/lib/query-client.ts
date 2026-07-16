import { QueryClient, isServer } from "@tanstack/react-query";

/**
 * Fábrica del QueryClient. En el servidor se crea uno nuevo por request
 * (evita compartir estado entre usuarios); en el cliente se reutiliza
 * una única instancia durante toda la vida de la pestaña.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
