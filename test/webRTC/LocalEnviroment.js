'use strict';

class LocalEnviroment{

    constructor(videoElement, localVideoconfig, offerConfig){
        this.servers = null

        //html selected item
        this.Video = videoElement;
        //parameters for local video enviroment
        this.localVideoconfig = localVideoconfig;
        //parameters for offer (to receive which kind of stream of remote peer)
        this.offerConfig = offerConfig;
        
        this.localStream;
        this.localPeerConnection;

        this.remotePeer;
        // this.

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
    getOtherPeer(peerConnection) {
        return (peerConnection === base_enviroment.localPeerConnection) ?
            remotePeerConnection : base_enviroment.localPeerConnection;
    }
    //  UBIZZa123 - media stream error Handler need to be isolated in separate class
    handleLocalMediaStreamError(error){
        console.log('navigator.getUserMedia error: ', error);
    }
    gotRemoteMediaStream(event) {
        const mediaStream = event.stream;
        remoteVideo.srcObject = mediaStream;
        remoteStream = mediaStream;
        // trace('Remote peer connection received remote stream.');
    }
    handleConnectionChange(event) {
        const peerConnection = event.target;
        console.log('ICE state change event: ', event);
        trace(`${getPeerName(peerConnection)} ICE state: ` +
              `${peerConnection.iceConnectionState}.`);
    }
    handleConnection(event) {
        const peerConnection = event.target;
        const iceCandidate = event.candidate;
      
        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = this.getOtherPeer(peerConnection);
      
            otherPeer
                .addIceCandidate(newIceCandidate)
                .then(() => {
                    this.handleConnectionSuccess(peerConnection);
                })
                .catch((error) => {
                    this.handleConnectionFailure(peerConnection, error);
                });
        }
        //   trace(`${getPeerName(peerConnection)} ICE candidate:\n` +`${event.candidate.candidate}.`);
    }
    handleConnectionSuccess(peerConnection) {
        // trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
    }
      // Logs that the connection failed.
    handleConnectionFailure(peerConnection, error) {
        // trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
            //   `${error.toString()}.`);
    }      
    setSessionDescriptionError(error) {
        // trace(`Failed to create session description: ${error.toString()}.`);
    }
    setLocalDescriptionSuccess(peerConnection) {
        this.setDescriptionSuccess(peerConnection, 'setLocalDescription');
    }
    setRemoteDescriptionSuccess(peerConnection) {
        this.setDescriptionSuccess(peerConnection, 'setRemoteDescription');
    }   
    setDescriptionSuccess(peerConnection, functionName) {
        const peerName = getPeerName(peerConnection);
        trace(`${peerName} ${functionName} complete.`);
    }
    
      
    createdAnswer(description) {
        
        // trace(`Answer from remotePeerConnection:\n${description.sdp}.`);
       
        // trace('remotePeerConnection setLocalDescription start.');
        this.remotePeer.setLocalDescription(description)
            .then(() => {
                this.setLocalDescriptionSuccess(remotePeerConnection);
            }).catch(setSessionDescriptionError);
        
        // trace('localPeerConnection setRemoteDescription start.');
        this.remotePeer.localPeerConnection.setRemoteDescription(description)
            .then(() => {
                this.setRemoteDescriptionSuccess(this.localPeer.localPeerConnection);
            }).catch(setSessionDescriptionError);
    }
     
    createdOffer(description) {
        // trace(`Offer from localPeerConnection:\n${description.sdp}`);
        // trace('localPeerConnection setLocalDescription start.');
        this.localPeer.localPeerConnection.setLocalDescription(description)
          .then(() => {
            this.setLocalDescriptionSuccess(this.localPeer.localPeerConnection);
          }).catch(this.setSessionDescriptionError);
      
        // trace('remotePeerConnection setRemoteDescription start.');
        this.remotePeer.setRemoteDescription(description)
          .then(() => {
            this.setRemoteDescriptionSuccess(this.remotePeer);
          }).catch(this.setSessionDescriptionError);
      
        // trace('remotePeerConnection createAnswer start.');
        this.remotePeer.createAnswer()
          .then(this.createdAnswers)
          .catch(this.setSessionDescriptionError);
    }


    callPeer(remotePeer){
        this.remotePeer = remotePeer
        this.localPeer = this

        
        let videoTracks = this.localPeer.localStream.getVideoTracks();
        let audioTracks = this.localPeer.localStream.getAudioTracks();

        if (videoTracks.length > 0) {
            // trace(`Using video device: ${videoTracks[0].label}.`);
        }
        if (audioTracks.length > 0) {
            // trace(`Using audio device: ${audioTracks[0].label}.`);
        }


        
        this.localPeer.localPeerConnection = new RTCPeerConnection(this.servers);
            // trace('Created local peer connection object localPeerConnection.');
            this.localPeer.localPeerConnection.addEventListener('icecandidate', this.handleConnection);
            this.localPeer.localPeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange);
        
        remotePeer = new RTCPeerConnection(this.servers);
            // trace('Created remote peer connection object remotePeerConnection.');
            remotePeer.addEventListener('icecandidate', this.handleConnection);
            remotePeer.addEventListener('iceconnectionstatechange', this.handleConnectionChange);
            remotePeer.addEventListener('addstream', this.gotRemoteMediaStream);
    
        this.localPeer.localPeerConnection.addStream(this.localPeer.localStream);
        // trace('Added local stream to localPeerConnection.');
        
        // trace('localPeerConnection createOffer start.');
        this.localPeer.localPeerConnection.createOffer(this.offerConfig)
        .then(this.createdOffer).catch(this.setSessionDescriptionError);
    }

}
