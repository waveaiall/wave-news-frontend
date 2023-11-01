
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
  audioResponseFilePath: string = ''

  @state()
  loading: Boolean = false

  @state()
  fetchLoading: Boolean = false

  componentDidMount() {
    this.speech();
  }

	render() {
		return (
      <>
        <section className="result-module">
          <div>
            <h4>提问：{ this.myQuestion }</h4>
          </div>

          {
            this.audioResponseFilePath ?
            <div className="wave-icon">
              <img src="https://media.giphy.com/media/l4XfgLyXAnyzCh7vfY/giphy.gif" alt="" />
            </div> : null
          }

          <p id="chat">
            {
              this.fetchLoading ?  'Loading...' : null
            }
          </p>

          {
            this.audioResponseFilePath ?
            <audio controls autoplay>
              <source src={this.audioResponseFilePath} type="" />
            </audio> : null
          }

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
    // const dom = this.shadowRoot.querySelector<HTMLElement>('#chat')
    // dom.innerText = ''

    axios.post('http://47.103.124.169:3002/chat-new/', {
      user_id: "123",
      request_text: val,
    })
      .then(function (response) {
        const {data} = response;
        console.log(data, 1111);

        _this.fetchLoading = false
        _this.audioResponseFilePath = data.audio_response_file_path

        _this.printText(data.text.response_text)
      })
      .catch(err => {
        console.log(err, 222);
        _this.printText('请重新提问，没有找到有用的信息~')
        _this.fetchLoading = false;

      })
  }

  printText = (content, speed = 50) => {
    const _this = this
    const dom = this.shadowRoot.querySelector<HTMLElement>('#chat')

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


  // 设置dom的光标状态
  setCursorStatus = (status) => {
    const classList = {
      loading: 'typing blinker',
      typing: 'typing',
      end: '',
    }
    const dom = this.shadowRoot.querySelector('#chat')
    dom.className = classList[status]
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
        _this.audioResponseFilePath = ''
        _this.loading = false

        btn.className = "btn"
    }

    btn.addEventListener("click", (e: any) => {
        e.target.className = "btn start"
        if(this.loading) return;
        recognition.start()
        this.loading = true
    })

  }
}
