
import { QuarkElement, customElement, state } from "quarkc"
import style from "./index.less?inline"
import axios from 'axios';

import VConsole from 'vconsole';
const vConsole = new VConsole({ theme: 'dark' });

@customElement({ tag: "my-app", style })
class MyApp extends QuarkElement {
  #printInterval

  @state()
  myQuestion: string = '比如：巴以冲突历史原因？'

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
              this.fetchLoading ?  'Loading...' : <>
              {
                !this.audioResponseFilePath ?
                  <>
                  <h5>今日全网热点新闻：</h5>
                  <li>
                    <strong>1</strong>  🔥 巴以冲突
                  </li>
                  <li>
                    <strong>2</strong> 伊拉克民兵武装袭击驻叙美军
                  </li>
                  <li>
                    <strong>3</strong> 咸鱼回应大学生在平台挂学校
                  </li>
                  <li>
                    <span>4</span> 伊拉克民兵武装袭击驻叙美军
                  </li>
                  <li>
                    <span>5</span> 伊拉克民兵武装袭击驻叙美军
                  </li>
                  </> : null
              }

              </>
            }
          </p>

          {
            this.audioResponseFilePath ?
            <audio id="audio" controls autoplay>
              <source src={this.audioResponseFilePath} type="audio/mpeg" />
            </audio> : ''
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

  init = () => {
    const _this = this
    const dom = this.shadowRoot.querySelector<HTMLElement>('#chat')
    const audio = this.shadowRoot.querySelector<HTMLVideoElement>('#audio')
    dom.innerText = ''
    _this.audioResponseFilePath = ''
    _this.loading = false
    this.#printInterval = null
    _this.setCursorStatus('end')

    audio?.pause();
  }

  fetchData = (val) => {
    const _this = this
    _this.fetchLoading = true

    // init data
    _this.init()

    // 请求数据
    axios.post('http://47.103.124.169:3002/chat-new-without-stream', {
      user_id: "123",
      request_text: val,
    })
      .then(function (response) {
        const {data} = response;
        console.log(data.text, data.audio_response_file_path, 1111);

        _this.fetchLoading = false
        _this.audioResponseFilePath = data.audio_response_file_path

        // audio.play();

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

    this.#printInterval = setInterval(() => {
      dom.innerText += content[index]
      index++
      if (index >= content.length) {
        _this.setCursorStatus('end')
        clearInterval(this.#printInterval)
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

    // 说话结束
    recognition.onspeechend = function() {
      console.log('onspeechend');
      recognition.stop()
    }

    // 结束的结果返回cb
    recognition.onresult = (e) => {
      // _this.init()
      console.log(e, 'onresult');

        const text = event.results[0][0].transcript
        btn.className = "btn"

        _this.myQuestion = text
        _this.loading = false

        _this.fetchData(text)
    }

    recognition.onerror = function(event) {
        console.log('onerror: ' + event.error)
        // _this.audioResponseFilePath = ''
        // _this.loading = false

        _this.init()

        btn.className = "btn"
    }

    btn.addEventListener("click", (e: any) => {

        _this.init()

        e.target.className = "btn start"
        if(this.loading) return;
        recognition.start()
        this.loading = true
    })

  }
}
