import { QuarkElement, customElement } from "quarkc";
import style from "./index.less?inline";
import { connectStore } from "gluang";
import { store } from "../store";

@customElement({ tag: "app-main", style })
class MyFooter extends connectStore(QuarkElement) {
	componentDidMount() {
		// store.setSong(moon)
		console.log('main did');
		
	}

	render() {
		return (
			<div class="main-container">
				<div class="cycle-module">
					<div className="voice-icon">icon</div>
					<div className="text">
						<p>xxxxxxxx</p>
						<p>xxxxxxxx</p>
						<p>xxxxxxxx</p>
						<p>xxxxxxxx</p>
						<p>xxxxxxxx</p>
					</div>
				</div>

				<div className="type-voice">
					{/* <input type="text" /> */}
					<div className="btn"></div>
				</div>
			</div>
		);
	}
}
