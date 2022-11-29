import {
	createTRPCProxyClient,
	createWSClient,
	splitLink,
	wsLink,
	httpLink,
} from "@trpc/client";
import { type AppRouter } from "../server/_app";

const url = `://localhost:${3001}`;
const wsClient = createWSClient({ url: `ws${url}` });

export const client = createTRPCProxyClient<AppRouter>({
	links: [
		splitLink({
			condition(op) {
				return op.type === "subscription";
			},
			true: wsLink({ client: wsClient }),
			false: httpLink({ url: `http${url}` }),
		}),
	],
});
