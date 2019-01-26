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
        // this.localPeerConnection = new RTCPeerConnection(this.server);
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


    callPeer(){
        
        let videoTracks = base_enviroment.localStream.getVideoTracks();
        let audioTracks = base_enviroment.localStream.getAudioTracks();
        if (videoTracks.length > 0) {
          trace(`Using video device: ${videoTracks[0].label}.`);
        }
        if (audioTracks.length > 0) {
          trace(`Using audio device: ${audioTracks[0].label}.`);
        }
    
    }

}
