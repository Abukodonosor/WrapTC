'use strict';

class LocalEnviroment{

    constructor(videoElement, localVideoconfig, offerConfig){
        this.server = null
        //html selected item
        this.Video = videoElement;
        //parameters for local video enviroment
        this.localVideoconfig = localVideoconfig;
        //parameters for offer (to receive which kind of stream of remote peer)
        this.offerConfig = offerConfig;
        this.localStream;
        this.localPeerConnection = new RTCPeerConnection(servers);;
    }
    /* run webRtc instance in local video element*/
    runLocal(){
        navigator.mediaDevices.getUserMedia(this.localVideoconfig)
            .then(this.gotLocalMediaStream.bind(this))
            .catch(this.handleLocalMediaStreamError.bind(this));
    }

    /* this function connect local MediaStream to the video element */
    gotLocalMediaStream(mediaStream){
        // console.log(mediaStream)
        this.localStream = mediaStream;
        this.Video.srcObject = mediaStream;

        //add some action
    }

    //media stream error Handler
    handleLocalMediaStreamError(error){
        console.log('navigator.getUserMedia error: ', error);
    }

}
