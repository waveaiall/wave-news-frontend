import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {

  @state()
  textContent: string = ''

  @state()
  loading: Boolean = false

  componentDidMount() {
    const btn =    this.shadowRoot.querySelector("#start-btn")
    const result = this.shadowRoot.querySelector("#result")
    const _this = this;

    // var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    // var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    // var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    // var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

    // console.log(SpeechGrammarList, 111);

    const recognition = new SpeechRecognition()

    console.log(recognition, 111122);

    recognition.continuous = false
    // recognition.lang = 'en-US'
    recognition.lang = 'zh-CN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      console.log(e, 'onresult');

        const text = event.results[0][0].transcript
        // onSuccess(text)
        btn.className = "btn"
        _this.textContent = text
        _this.loading = false
    }


    recognition.onspeechend = function() {
      console.log('onspeechend');
        // onError("未识别...")
        recognition.stop()
    }

    recognition.onerror = function(event) {
        console.log('onerror: ' + event.error)
        result.className = "result error"
        _this.textContent = event.error
        _this.loading = false
    }


    btn.addEventListener("click", (e) => {
        e.target.className += " start"
        recognition.start()
        // btn.textContent = "识别中..."
        this.loading = true
    })
  }

	render() {
		return (
        <>
          <section className="result-module">
            <div class="result" id="result">{this.textContent}</div>
          </section>

          <div className="type">
            <div class="btn" id="start-btn">
              {this.loading ? '正在识别' :'开始识别'}
            </div>
          </div>
          </>
		);
	}
}
