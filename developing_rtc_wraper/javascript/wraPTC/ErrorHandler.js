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
            const otherPeer = ErrorHandler.getOtherPeer(peerConnection);
      
            otherPeer.addIceCandidate(newIceCandidate)
            .then(() => {
                ErrorHandler.handleConnectionSuccess(peerConnection);
            }).catch((error) => {
                ErrorHandler.handleConnectionFailure(peerConnection, error);
            });
      
            ErrorHandler.trace(`${ErrorHandler.getPeerName(peerConnection)} ICE candidate:\n ${event.candidate.candidate}.`);
        }
    }

    static handleConnectionChange(event) {
        const peerConnection = event.target;
        console.log('ICE state change event: ', event);
        ErrorHandler.trace(`${ErrorHandler.getPeerName(peerConnection)} ICE state: ${peerConnection.iceConnectionState}.`);
    }

    static setSessionDescriptionError(error) {
        ErrorHandler.trace(`Failed to create session description: ${error.toString()}.`);
    }

    static getOtherPeer(peerConnection) {
        return (peerConnection === localPeer.localPeerConnection) ?
        remotePeer.localPeerConnection : localPeer.localPeerConnection;
    }      

    // Gets the name of a certain peer connection.
    static getPeerName(peerConnection) {
        return (peerConnection === localPeer.localPeerConnection) ?
            'localPeerConnection' : 'remotePeerConnection';
    }

        // Logs that the connection failed.
    static handleConnectionFailure(peerConnection, error) {
        ErrorHandler.trace(`${ErrorHandler.getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
            `${error.toString()}.`);
    }

    // Logs that the connection succeeded.
    static handleConnectionSuccess(peerConnection) {
        ErrorHandler.trace(`${ErrorHandler.getPeerName(peerConnection)} addIceCandidate success.`);
    }

    static setLocalDescriptionSuccess(peerConnection) {
        ErrorHandler.setDescriptionSuccess(peerConnection, 'setLocalDescription');
    }
    
    // Logs success when setting session description.
    static setDescriptionSuccess(peerConnection, functionName) {
        const peerName = ErrorHandler.getPeerName(peerConnection);
        ErrorHandler.trace(`${peerName} ${functionName} complete.`);
    }
  
    static setRemoteDescriptionSuccess(peerConnection) {
        ErrorHandler.setDescriptionSuccess(peerConnection, 'setRemoteDescription');
    }
}