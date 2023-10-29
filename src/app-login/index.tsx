import { QuarkElement, customElement } from "quarkc";
import style from "./index.less?inline";
import { connectStore } from "gluang";
import { store } from "../store";

@customElement({ tag: "app-login", style })
class MyFooter extends connectStore(QuarkElement) {
	componentDidMount() {
		// store.setSong(moon)
	}

	render() {
		return (
			<div class="app-footer">
				请输入
				<input type="text" placeholder="请输入用户名" />
			</div>
		);
	}
}
