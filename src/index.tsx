import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {

  @state()
  textContent: string = '你好'

  @state()
  loading: Boolean = false

  componentDidMount() {
    this.init();
  }

	render() {
		return (
        <>
          {/* <header>Right Here Waiting for you!</header> */}

          <section className="result-module">
          <form>

            <input id="txt" type="text" class="txt" value={this.textContent}/>

            <div style="display: none;">
              <select></select>
            </div>
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

  init = () => {
    // ============================= 播放语音 start =============================
    const synth = window.speechSynthesis;

    const inputForm = this.shadowRoot.querySelector("form");
    const inputTxt = this.shadowRoot.querySelector(".txt");
    const voiceSelect = this.shadowRoot.querySelector("select");

    let voices = [];

    function populateVoiceList() {
      voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase();
        const bname = b.name.toUpperCase();

        if (aname < bname) {
          return -1;
        } else if (aname == bname) {
          return 0;
        } else {
          return +1;
        }
      });
      const selectedIndex =
        voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
      voiceSelect.innerHTML = "";

      for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = `${voices[i].name} (${voices[i].lang})`;

        if (voices[i].default) {
          option.textContent += " -- DEFAULT";
        }

        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);
        voiceSelect.appendChild(option);
      }
      voiceSelect.selectedIndex = selectedIndex;
    }

    populateVoiceList();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    function speak() {
      if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
      }

      if (inputTxt.value !== "") {
        const utterThis = new SpeechSynthesisUtterance(inputTxt.value);

        utterThis.onend = function (event) {
          console.log("SpeechSynthesisUtterance.onend");
        };

        utterThis.onerror = function (event) {
          console.error("SpeechSynthesisUtterance.onerror");
        };

        const selectedOption =
          voiceSelect.selectedOptions[0].getAttribute("data-name");

        for (let i = 0; i < voices.length; i++) {
          if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
            break;
          }
        }

        utterThis.voice = voices[29]; // 中文
        utterThis.pitch = 1;
        utterThis.rate = 1;
        synth.speak(utterThis);
      }
    }



    // ============================= 输入语音 start =============================
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

        speak() // 播放
    }


    recognition.onspeechend = function() {
      console.log('onspeechend');
      recognition.stop()
    }

    recognition.onerror = function(event) {
        console.log('onerror: ' + event.error)
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
