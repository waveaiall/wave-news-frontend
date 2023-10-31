
import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"
import axios from 'axios';
//const axios = require('axios'); // legacy way

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {

  @state()
  textContent: string = 'Hello'

  @state()
  loading: Boolean = false

  componentDidMount() {
    this.speech();

    axios.post('http://47.103.124.169:3002/chat-new/', {
      user_id: "123",
      request_text: "我想了解以色列的建国史",
    })
      .then(function (response) {
        // handle success
        console.log(response);
      })

  }

	render() {
		return (
        <>
          <section className="result-module">
            {this.textContent}
          </section>

          <div className="type">
            <div class="btn" id="start-btn">
              {this.loading ? '正在识别' :'开始识别'}
            </div>
          </div>
          </>
		);
	}

  // 录入声音，转文字
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

        // _this.speak() // 播放
        // speak() // 播放
    }


    recognition.onspeechend = function() {
      console.log('onspeechend');
      recognition.stop()
    }

    recognition.onerror = function(event) {
        console.log('onerror: ' + event.error)
        _this.textContent = event.error === 'no-speech' ? '没有检测到您的语音' : event.error
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
