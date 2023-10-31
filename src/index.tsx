
import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"
import axios from 'axios';
//const axios = require('axios'); // legacy way

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {

  @state()
  myQuestion: string = '我想了解...'

  @state()
  textContent: string = ''

  @state()
  loading: Boolean = false

  @state()
  fetchLoading: Boolean = false

  componentDidMount() {
    this.speech();
  }


/**
 * @description:
 * @param {HTMLElement} dom - 打印内容的dom
 * @param {string} content - 打印文本内容
 * @param {number} speed - 打印速度
 * @return {void}
 */
printText = (content, speed = 50) => {
  const dom = this.shadowRoot.querySelector('#chat')
  const _this = this

  let index = 0
  _this.setCursorStatus('typing')

  let printInterval = setInterval(() => {
    dom.innerText += content[index]
    index++
    if (index >= content.length) {
      _this.setCursorStatus('end')
      clearInterval(printInterval)
    }
  }, speed)
}


/**
 * @description: 设置dom的光标状态
 * @param {HTMLElement} dom - 打印内容的dom
 * @param {"loading"|"typing"|"end"} status - 打印状态
 * @return {void}
 */
setCursorStatus = (status) => {
  const classList = {
    loading: 'typing blinker',
    typing: 'typing',
    end: '',
  }
  const dom = this.shadowRoot.querySelector('#chat')
  dom.className = classList[status]
}

	render() {
		return (
        <>
          <section className="result-module">
            <div>
              <h4>提问：{ this.myQuestion }</h4>
            </div>
            <p id="chat"></p>
            {/* {
              this.fetchLoading ? 'Loading...' : null
            } */}
          </section>

          <div className="type">
            <div class="btn" id="start-btn">
              {this.loading ? '正在识别' :'开始识别'}
            </div>
          </div>
          </>
		);
	}

  fetchData = (val) => {
    const _this = this
    _this.fetchLoading = true
    axios.post('http://47.103.124.169:3002/chat-new/', {
      user_id: "123",
      request_text: val,
    })
      .then(function (response) {
        const {data} = response;
        // handle success
        console.log(response);
        _this.textContent = response.data.text.response_text
        _this.fetchLoading = false

        _this.printText(data.text.response_text)
      })
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

        _this.myQuestion = text
        _this.loading = false

        _this.fetchData(text)
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
