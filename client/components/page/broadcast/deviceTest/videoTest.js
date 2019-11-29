import './testStyle.less';
import React, { Component } from 'react';

class deviceTestMain extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const constraints = { video: true, video: { width: 480, height: 270 } };
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                constraints,
                (stream) => {
                    const video = document.getElementById('testVideo');
                    video.srcObject = stream;
                    video.onloadedmetadata = () => {
                        video.play();
                        // 停止摄像
                        setTimeout(() => {
                            this.stream = stream.getTracks();
                        }, 2000);
                    };
                },
                (err) => {
                    console.log(`The following error occurred: ${err.name}`);
                }
            );
        } else {
            console.log('getUserMedia not supported');
        }
    }

    render() {
        return (
            <div className='test-stage-module'>
                <div className='test-stage-box stage-video'>
                    <video src='' id='testVideo'></video>
                </div>
            </div>
        );
    }
}

export default deviceTestMain;
