'use strict';

class RemoteEnviroment{

    constructor(type, videoElement){

        if(type == 'local');
        if(type == 'remote');
        this.remoteStream;
        this.remotePeerConnection;

    }
    /*  */
    gotRemoteMediaStream(event) {
        const mediaStream = event.stream;
        remoteVideo.srcObject = mediaStream;
        remoteStream = mediaStream;
        trace('Remote peer connection received remote stream.');
    }

}