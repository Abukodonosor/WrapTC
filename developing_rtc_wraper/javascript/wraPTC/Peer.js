'use strict'

class Peer extends rtcAbstraction {

    constructor(mediaStreamConstraints, localVieoId){
        super();
        //streatming options (audio,video, with expec resolution)
        this.mediaStreamConstraints = mediaStreamConstraints;   
        
        //
        this.localVideoId = localVieoId;
        this.localStream;

    }

    /* This method allowe you to see output of your camera in local */
    startLocalStreaming(){
        navigator.mediaDevices.getUserMedia( this.mediaStreamConstraints)
        .then(rtcAbstraction.gotLocalMediaStream.bind(this)).catch(handleLocalMediaStreamError);
    }



}