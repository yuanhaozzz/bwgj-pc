import './testStyle.less';
import React, { Component } from 'react';

let audioContext = null;

class mikeTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wave: 0,
        };
        audioContext = null;
    }

    componentWillUnmount() {
        if (audioContext) {
            audioContext.close();
        }
    }

    openTest = () => {
        const that = this;
        audioContext = new AudioContext();
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { audio: true },
                (stream) => {
                    // 将麦克风的声音输入这个对象
                    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
                    // 创建一个音频分析对象，采样的缓冲区大小为4096，输入和输出都是单声道
                    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                    // 将该分析对象与麦克风音频进行连接
                    mediaStreamSource.connect(scriptProcessor);
                    // 此举无甚效果，仅仅是因为解决 Chrome 自身的 bug
                    scriptProcessor.connect(audioContext.destination);
                    // 开始处理音频
                    scriptProcessor.onaudioprocess = function (e) {
                        // 获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
                        let buffer = e.inputBuffer.getChannelData(0);
                        // 获取缓冲区中最大的音量值
                        let maxVal = Math.max.apply(Math, buffer);
                        if (navigator.getUserMedia) {
                            that.setState({
                                wave: Math.round(maxVal * 100)
                            });
                        }
                    };
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    mikeWaveItem = () => {
        let dom = [];
        for (let i = 0; i < 25; i++) {
            if (i % 2) {
                dom.push(<div className='mike-wave-item even' key={i}></div>);
            } else {
                dom.push(<div className='mike-wave-item odd' key={i}></div>);
            }

        }
        return dom;
    }

    render() {
        const { wave } = this.state;
        return (
            <div className='test-stage-module'>
                <div className='test-stage-box'>
                    <div className='mike-stage'>
                        <div className='mike-stage-con'>
                            <div className='mike-stage-img' onClick={() => this.openTest()}>
                                <img src='/live/static/images/deviceTest/mike_stage_icon.png' />
                            </div>
                            <div className='mike-stage-wave'>
                                {
                                    this.mikeWaveItem()
                                }
                                <div className='mike-wave-bg' style={{ width: `${wave}%` }}></div>
                            </div>
                        </div>
                        <div className='stage-message'>点击开始录音，对麦克风从1数到10，看音量条是否波动</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default mikeTest;
