import {
	createRouteConfig,
	createReactRouter,
	RouterProvider,
	Outlet,
} from "@tanstack/react-router";

import Navbar from "./components/Navbar";
import { indexRoute } from "./routes";

import "./index.css";

const root = createRouteConfig();

const routeConfig = root.addChildren([indexRoute]);
const router = createReactRouter({ routeConfig });

export default function App() {
	return (
		<RouterProvider router={router}>
			<Navbar />
			<Outlet />
		</RouterProvider>
	);
}
