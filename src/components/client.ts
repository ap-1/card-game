import {
	createTRPCProxyClient,
	createWSClient,
	splitLink,
	wsLink,
	httpLink,
} from "@trpc/client";
import { type AppRouter } from "../server/_app";

// Create persistent WebSocket connection
const url = `://localhost:${3001}`;
const wsClient = createWSClient({ url: `ws${url}` });

// Configure TRPCProxyClient to use both transports
export const client = createTRPCProxyClient<AppRouter>({
	links: [
		splitLink({
			condition(op) {
				return op.type === "subscription";
			},
			// Use WebSocket transport for subscription operations
			true: wsLink({ client: wsClient }),
			// Use HTTP transport for all other operations
			false: httpLink({ url: `http${url}` }),
		}),
	],
});
