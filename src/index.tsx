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
    this.speech();
  }

	render() {
		return (
        <>
          <header>Right Here Waiting for you!</header>

          <section className="result-module">

          <form>
            <div class="result" id="result">
              {/* {this.textContent} */}
              <input onPropertyChange={this.txtChange} type="text" class="txt" value={this.textContent} />
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
    var synth = window.speechSynthesis;
    var inputTxt = this.shadowRoot.querySelector('.txt');

    var voices = [];

    function populateVoiceList() {
      voices = synth.getVoices();
    }

    populateVoiceList();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }


    // function speak(){
    // }
    if(inputTxt.value !== ''){
      var utterThis = new SpeechSynthesisUtterance(inputTxt.value);

      utterThis.voice = voices[64];
      utterThis.pitch = 1;
      utterThis.rate = 1;
      synth.speak(utterThis);
    }

    // inputForm.onsubmit = function(event) {
    //   event.preventDefault();
    //   speak();
    // }
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
        // onSuccess(text)
        btn.className = "btn"
        _this.textContent = text
        _this.loading = false
    }


    recognition.onspeechend = function() {
      console.log('onspeechend');
        // onError("未识别...")
        recognition.stop()

        _this.speak() // 播放
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
