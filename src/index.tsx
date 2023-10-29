// import { QuarkElement, customElement } from "quarkc"
// import style from "./index.less?inline"

// import './app-header'
// import './app-footer'
// import './app-piano'

// @customElement({ tag: "my-app", style })
// class MyApp extends QuarkElement {
//   render() {
//     return (
//       <div class="app">
//       <app-header />
//       <app-piano />
//       <app-footer />
//     </div>
//     );
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     "my-app": MyApp
//   }
// }

import { Router } from "@vaadin/router";
import "./index.less";

import "./app-main";
import "./app-login";

const outlet = document.querySelector("#root");
export const router = new Router(outlet);

router.setRoutes([
	{
		path: "/login",
		component: "app-login", // custom element name
		action: async () => {
			await import("./app-login");
		},
	},
	{
		path: "/",
		component: "app-main",
		action: async () => {
			await import("./app-main");
		},
	},
	{
		path: "(.*)",
		component: "app-not-found",
	},
]);
