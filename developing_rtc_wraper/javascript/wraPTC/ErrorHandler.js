'use strict'

class ErrorHandler {

    static trace(text) {
        text = text.trim();
        const now = (window.performance.now() / 1000).toFixed(3);
      
        console.log(now, text);
    }

    static handleLocalMediaStreamError(error) {
        ErrorHandler.trace(`navigator.getUserMedia error: ${error.toString()}.`);
    }

    static handleConnection(event) {
        const peerConnection = event.target;
        const iceCandidate = event.candidate;
      
        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = getOtherPeer(peerConnection);
      
            otherPeer.addIceCandidate(newIceCandidate)
            .then(() => {
              handleConnectionSuccess(peerConnection);
            }).catch((error) => {
              handleConnectionFailure(peerConnection, error);
            });
      
            trace(`${getPeerName(peerConnection)} ICE candidate:\n ${event.candidate.candidate}.`);
        }
    }

    static handleConnectionChange(event) {
        const peerConnection = event.target;
        console.log('ICE state change event: ', event);
        ErrorHandler.trace(`${getPeerName(peerConnection)} ICE state: ${peerConnection.iceConnectionState}.`);
    }

    static createdOffer(description) {
        trace(`Offer from localPeerConnection:\n${description.sdp}`);
      
        trace('localPeerConnection setLocalDescription start.');
        localPeerConnection.setLocalDescription(description)
            .then(() => {
            setLocalDescriptionSuccess(localPeerConnection);
            }).catch(setSessionDescriptionError);
      
        trace('remotePeerConnection setRemoteDescription start.');
        remotePeerConnection.setRemoteDescription(description)
            .then(() => {
            setRemoteDescriptionSuccess(remotePeerConnection);
            }).catch(setSessionDescriptionError);
      
        trace('remotePeerConnection createAnswer start.');
        remotePeerConnection.createAnswer()
            .then(createdAnswer)
            .catch(setSessionDescriptionError);
    }
    
}