import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {

  @state()
  textContent: string = 'Hello'

  @state()
  loading: Boolean = false

  componentDidMount() {
    // this.speak();
    this.speech();
  }

	render() {
		return (
        <>
          {/* <header>Right Here Waiting for you!</header> */}

          <section className="result-module">

           {/* <form>
            <div class="result" id="result">
              <textarea
                placeHolder="你想知道点什么......"
                class="txt"
                disabled
                value={this.textContent} />
            </div>
            </form> */}

          <form>
            {/* <label for="txt">Enter text</label> */}
            <input id="txt" type="text" class="txt" value={this.textContent} />

            {this.textContent}

            <div style="display: none;">
              {/* <div>
                <label for="rate">Rate</label
                ><input type="range" min="0.5" max="2" value="1" step="0.1" id="rate" />
                <div class="rate-value">1</div>
                <div class="clearfix"></div>
              </div>
              <div>
                <label for="pitch">Pitch</label
                ><input type="range" min="0" max="2" value="1" step="0.1" id="pitch" />
                <div class="pitch-value">1</div>
                <div class="clearfix"></div>
              </div> */}
              <select></select>
            </div>

            <div class="controls">
              <button id="play" type="submit">Play</button>
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

  speak = () => {


    // pitch.onchange = function () {
    //   pitchValue.textContent = pitch.value;
    // };

    // rate.onchange = function () {
    //   rateValue.textContent = rate.value;
    // };

    // voiceSelect.onchange = function () {
    //   speak();
    // };
  }

  speech = () => {


    const synth = window.speechSynthesis;

    const inputForm = this.shadowRoot.querySelector("form");
    const inputTxt = this.shadowRoot.querySelector(".txt");
    const voiceSelect = this.shadowRoot.querySelector("select");

    const pitch = this.shadowRoot.querySelector("#pitch");
    const pitchValue = this.shadowRoot.querySelector(".pitch-value");
    const rate = this.shadowRoot.querySelector("#rate");
    const rateValue = this.shadowRoot.querySelector(".rate-value");

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

      if (_this.textContent !== "") {
        const utterThis = new SpeechSynthesisUtterance(_this.textContent);

        utterThis.onend = function (event) {
          console.log("SpeechSynthesisUtterance.onend");
        };

        utterThis.onerror = function (event) {
          console.error("SpeechSynthesisUtterance.onerror");
        };

        const selectedOption =
          voiceSelect.selectedOptions[0].getAttribute("data-name");

        for (let i = 0; i < voices.length; i++) {
          console.log(voices[i].name, voices[i].lang);

          if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
            break;
          }
        }



        // console.log('voices', voices);

        utterThis.voice = voices[29]; // 中文
        utterThis.lang = 'zh-CN'

        utterThis.pitch = 1;
        utterThis.rate = 1;
        synth.speak(utterThis);
      }
    }


    inputForm.onsubmit = function (event) {
      event.preventDefault();

      speak();
    };






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

        // _this.speak() // 播放
        speak() // 播放
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
