'use strict'

class rtcAbstraction {

    static gotLocalMediaStream(mediaStream) {
        console.log(mediaStream)
        console.log(this)
        this.localStream = mediaStream;
        this.localVideoId.srcObject = mediaStream;
    }

    static gotRemoteMediaStream(event) {
        const mediaStream = event.stream;
        remotePeer.localVideoId.srcObject = mediaStream;
        remotePeer.localStream = mediaStream;
        ErrorHandler.trace('Remote peer connection received remote stream.');
    }
      
    static handleLocalMediaStreamError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    static createdOffer(description) {
        ErrorHandler.trace(`Offer from localPeerConnection:\n${description.sdp}`);
        
        ErrorHandler.trace('localPeerConnection setLocalDescription start.');
        // console.log(localPeer)
        // console.log(remotePeer)
        localPeer.localPeerConnection.setLocalDescription(description)
            .then(() => {
                ErrorHandler.setLocalDescriptionSuccess(localPeer.localPeerConnection);
            }).catch(ErrorHandler.setSessionDescriptionError);
        
            ErrorHandler.trace('remotePeerConnection setRemoteDescription start.');
            remotePeer.localPeerConnection.setRemoteDescription(description)
            .then(() => {
                ErrorHandler.setRemoteDescriptionSuccess(remotePeer.localPeerConnection);
            }).catch(ErrorHandler.setSessionDescriptionError);
        
        ErrorHandler.trace('remotePeerConnection createAnswer start.');
        remotePeer.localPeerConnection.createAnswer()
            .then(rtcAbstraction.createdAnswer)
            .catch(ErrorHandler.setSessionDescriptionError);
    }

    static createdAnswer(description) {
        ErrorHandler.trace(`Answer from remotePeerConnection:\n${description.sdp}.`);
      
        ErrorHandler.trace('remotePeerConnection setLocalDescription start.');
        remotePeer.localPeerConnection.setLocalDescription(description)
          .then(() => {
            ErrorHandler.setLocalDescriptionSuccess(remotePeer.localPeerConnection);
          }).catch(ErrorHandler.setSessionDescriptionError);
      
        ErrorHandler.trace('localPeerConnection setRemoteDescription start.');
        localPeer.localPeerConnection.setRemoteDescription(description)
          .then(() => {
            ErrorHandler.setRemoteDescriptionSuccess(localPeer.localPeerConnection);
          }).catch(ErrorHandler.setSessionDescriptionError);
      }
    

}