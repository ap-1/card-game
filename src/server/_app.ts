import { type inferAsyncReturnType, initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";

import {
	type CreateHTTPContextOptions,
	createHTTPHandler,
} from "@trpc/server/adapters/standalone";
import {
	type CreateWSSContextFnOptions,
	applyWSSHandler,
} from "@trpc/server/adapters/ws";

import { createServer } from "http";
import { WebSocketServer } from "ws";
import { EventEmitter } from "events";
import { z } from "zod";

const emitter = new EventEmitter();

export const createContext = (
	opts: CreateHTTPContextOptions | CreateWSSContextFnOptions
) => ({});
const tRPC = initTRPC
	.context<inferAsyncReturnType<typeof createContext>>()
	.create();

const router = tRPC.router({
	hello: tRPC.procedure
		.input(
			z.object({
				name: z.string(),
			})
		)
		.query(({ input }) => `Hello, ${input.name}!`),
});

export type AppRouter = typeof router;

const port = 3001;

// Create the HTTP Server
const trpcHandler = createHTTPHandler({ router, createContext });
const server = createServer((req, res) => {
	// Enable cors
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Request-Method", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
	res.setHeader("Access-Control-Allow-Headers", "*");

	// Accept OPTIONS
	if (req.method === "OPTIONS") {
		res.writeHead(200);
		return res.end();
	}

	trpcHandler(req, res);
}).listen(port);

// Create the WebSocket Server
const wss = new WebSocketServer({ server });
const handler = applyWSSHandler({ wss, router, createContext });

wss.on("connection", (ws) => {
	console.log(`Connection added (${wss.clients.size})`);
	ws.once("close", () =>
		console.log(`Connection removed (${wss.clients.size})`)
	);
});

console.log(`Listening on ws://localhost:${port}`);
process.on("SIGTERM", () => {
	console.log("SIGTERM");
	handler.broadcastReconnectNotification();
	wss.close();
});
