import { QuarkElement, customElement } from "quarkc";
import style from "./index.less?inline";

@customElement({ tag: "app-main", style })
class MyComponent extends QuarkElement {
	componentDidMount(): void {
		console.log(1);

		// var utterThis = new window.SpeechSynthesisUtterance("你好，世界！");
		// window.speechSynthesis.speak(utterThis);

		var words = new SpeechSynthesisUtterance("Hello captain 22");
		window.speechSynthesis.speak(words);
		console.log(2);
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
