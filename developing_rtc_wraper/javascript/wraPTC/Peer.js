'use strict'

class Peer extends rtcAbstraction {

    constructor(config, localVieoId){
        super();
        //streatming options (audio,video, with expec resolution)
        this.mediaStreamConstraints = config.streamingConfig;   
        this.offerOptions = config.offerOptions;

        this.localPeerConnection;
        //
        this.localVideoId = localVieoId;
        this.localStream;

        //parameter for local peer maneging
        this.servers = null
    }

    /* This method allowe you to see output of your camera in local */
    startLocalStreaming(){
        navigator.mediaDevices.getUserMedia( this.mediaStreamConstraints)
        .then(rtcAbstraction.gotLocalMediaStream.bind(this)).catch(ErrorHandler.handleLocalMediaStreamError.bind(this));
    }

    callPeer(remotePeer){

        let videoTracks = this.localStream.getVideoTracks();
        let audioTracks = this.localStream.getAudioTracks();

        if (videoTracks.length > 0) {
            ErrorHandler.trace(`Using video device: ${videoTracks[0].label}.`);
        }
        if (audioTracks.length > 0) {
            ErrorHandler.trace(`Using audio device: ${audioTracks[0].label}.`);
        }

        this.localPeerConnection = new RTCPeerConnection(this.servers);
        ErrorHandler.trace('Created local peer connection object localPeerConnection.');
        this.localPeerConnection.addEventListener('icecandidate', ErrorHandler.handleConnection);
        this.localPeerConnection.addEventListener('iceconnectionstatechange', ErrorHandler.handleConnectionChange);
        

        remotePeer.localPeerConnection = new RTCPeerConnection(this.servers);
        ErrorHandler.trace('Created remote peer connection object remotePeerConnection.');

        remotePeer.localPeerConnection.addEventListener('icecandidate', ErrorHandler.handleConnection);
        remotePeer.localPeerConnection.addEventListener('iceconnectionstatechange', ErrorHandler.handleConnectionChange);
        remotePeer.localPeerConnection.addEventListener('addstream', rtcAbstraction.gotRemoteMediaStream.bind(remotePeer));
        
        // Add local stream to connection and create offer to connect.
        this.localPeerConnection.addStream(this.localStream);
        ErrorHandler.trace('Added local stream to localPeerConnection.');

        ErrorHandler.trace('localPeerConnection createOffer start.');
        this.localPeerConnection.createOffer(this.offerOptions)
        .then(rtcAbstraction.createdOffer).catch(ErrorHandler.setSessionDescriptionError);


    }

}   