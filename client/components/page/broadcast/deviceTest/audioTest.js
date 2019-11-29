import './testStyle.less';
import React, { Component } from 'react';

class audioTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioPlay: true,
        };
    }

    componentDidMount() {
        const that = this;
        const audio = document.getElementById('testAudio');
        audio.play();
        audio.addEventListener('ended', function () {  
            that.setState({
                audioPlay: false,
            });
        }, false);
    }

    audioBtn = () => {
        const audio = document.getElementById('testAudio');
        const { audioPlay } = this.state;
        if (!audioPlay) {
            audio.play();
        } else {
            audio.pause();
        }
        this.setState({
            audioPlay: !audioPlay,
        });
    }
    
    render () {
        const { audioPlay } = this.state;
        return (
            <div className='test-stage-module'>
                <div className='test-stage-box'>
                    <div className='audio-state'>
                        <div className={audioPlay ? 'audio-pause audio-play' : 'audio-pause'} onClick={() => this.audioBtn()}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className='stage-message'>点击播放，能否听见声音</div>
                    </div>
                    <audio src='/live/static/audio_test.m4a' id='testAudio'></audio>
                </div>
            </div>
        );
    }
}

export default audioTest;