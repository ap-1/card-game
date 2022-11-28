import {
	createRouteConfig,
	createReactRouter,
	RouterProvider,
	Outlet,
} from "@tanstack/react-router";

import Index from "./routes/Index";
import Navbar from "./components/Navbar";

import "./index.css";

const root = createRouteConfig();
const indexRoute = root.createRoute({
	path: "/",
	component: Index,
});

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
