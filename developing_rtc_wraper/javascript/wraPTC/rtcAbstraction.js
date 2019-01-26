'use strict'

class rtcAbstraction {

    static gotLocalMediaStream(mediaStream) {
        console.log(mediaStream)
        this.localStream = mediaStream;
        this.localVideoId.srcObject = mediaStream;
    }
    static handleLocalMediaStreamError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

}