import { createRouteConfig, useMatch } from "@tanstack/react-router";
import { client } from "../components/client";

export const indexRoute = createRouteConfig().createRoute({
	path: "/",
	component: Index,
	async loader() {
		return {
			message: await client.hello.query({ name: "anish!!" }),
		};
	},
});

export default function Index() {
	const {
		loaderData: { message },
	} = useMatch(indexRoute.id);

	return <p className="underline">{message}</p>;
}
