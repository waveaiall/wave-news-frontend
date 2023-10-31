import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {

  @state()
  textContent: string = '你想知道点什么?'

  @state()
  loading: Boolean = false

  componentDidMount() {
    this.speak();
    this.speech();
  }

	render() {
		return (
        <>
          {/* <header>Right Here Waiting for you!</header> */}

          <section className="result-module">

           <form>
            <div class="result" id="result">
              {/* {this.textContent} */}
              <textarea
                placeHolder="你想知道点什么......"
                class="txt"
                value={this.textContent} />
            </div>

              {/* <div class="controls">
                <button id="play" type="submit">Play</button>
              </div> */}
            </form>

          </section>

          <div className="type">
            <div class="btn" id="start-btn">
              {this.loading ? '正在识别' :'开始识别'}
            </div>
          </div>
          </>
		);
	}

  speak = () => {
    const _this = this;
    var synth = window.speechSynthesis;
    // var inputTxt = this.shadowRoot.querySelector('.txt');
    // var inputForm = this.shadowRoot.querySelector('form');

    var voices = [];

    function populateVoiceList() {
      voices = synth.getVoices();
    }

    populateVoiceList();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    console.log(_this.textContent, 2222);

    if(_this.textContent !== ''){
      var utterThis = new SpeechSynthesisUtterance(_this.textContent);

      utterThis.voice = voices[64];
      utterThis.pitch = 1;
      utterThis.rate = 1;
      synth.speak(utterThis);
    }
  }

  speech = () => {
    const btn = this.shadowRoot.querySelector("#start-btn")
    const _this = this;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    // recognition.lang = 'en-US'
    recognition.lang = 'zh-CN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      console.log(e, 'onresult');

        const text = event.results[0][0].transcript
        btn.className = "btn"
        _this.textContent = text
        _this.loading = false

        _this.speak() // 播放
    }


    recognition.onspeechend = function() {
      console.log('onspeechend');
      recognition.stop()
    }

    recognition.onerror = function(event) {
        console.log('onerror: ' + event.error)
        // result.className = "result error"

        _this.textContent = event.error
        _this.loading = false

        btn.className = "btn"
    }

    btn.addEventListener("click", (e) => {
        e.target.className = "btn start"
        if(this.loading) return;
        recognition.start()
        this.loading = true
    })

  }
}
