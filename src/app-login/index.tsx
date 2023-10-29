import { QuarkElement, customElement } from "quarkc";
import style from "./index.less?inline";
import { connectStore } from "gluang";
import { store } from "../store";

@customElement({ tag: "app-login", style })
class MyFooter extends connectStore(QuarkElement) {
	componentDidMount() {
		// store.setSong(moon)
	}

	submit = () => {
		console.log(222);

		window.location.href = "/main";
	};

	render() {
		return (
			<div class="login-container">
				请输入用户名
				<input type="text" placeholder="请输入用户名" />
				<div class="submit" onClick={this.submit}>
					提交
				</div>
			</div>
		);
	}
}
