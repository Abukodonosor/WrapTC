'use strict'

class Peer extends rtcAbstraction {

    constructor(mediaStreamConstraints, localVieoId){
        super();
        //streatming options (audio,video, with expec resolution)
        this.mediaStreamConstraints = mediaStreamConstraints;   
        this.localPeerConnection;
        //
        this.localVideoId = localVieoId;
        this.localStream;

    }

    /* This method allowe you to see output of your camera in local */
    startLocalStreaming(){
        navigator.mediaDevices.getUserMedia( this.mediaStreamConstraints)
        .then(rtcAbstraction.gotLocalMediaStream.bind(this)).catch(ErrorHandler.handleLocalMediaStreamError.bind(this));
    }

    callPeer(remotePeer){

        let videoTracks = localStream.getVideoTracks();
        let audioTracks = localStream.getAudioTracks();

        if (videoTracks.length > 0) {
            trace(`Using video device: ${videoTracks[0].label}.`);
        }
        if (audioTracks.length > 0) {
            trace(`Using audio device: ${audioTracks[0].label}.`);
        }

        
    }

}   