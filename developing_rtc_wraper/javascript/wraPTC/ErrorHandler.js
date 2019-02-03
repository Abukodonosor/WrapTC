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
        ErrorHandler.trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
    };

    static createdOffer(description) {
        ErrorHandler.trace(`Offer from localPeerConnection:\n${description.sdp}`);
        
        ErrorHandler.trace('localPeerConnection setLocalDescription start.');
        this.localPeerConnection.setLocalDescription(description)
            .then(() => {
            setLocalDescriptionSuccess(this.localPeerConnection);
            }).catch(ErrorHandler.setSessionDescriptionError);
        
            ErrorHandler.trace('remotePeerConnection setRemoteDescription start.');
            remotePeer.localPeerConnection.setRemoteDescription(description)
            .then(() => {
            setRemoteDescriptionSuccess(remotePeer.localPeerConnection);
            }).catch(ErrorHandler.setSessionDescriptionError);
        
        ErrorHandler.trace('remotePeerConnection createAnswer start.');
        remotePeer.localPeerConnection.createAnswer()
            .then(createdAnswer)
            .catch(ErrorHandler.setSessionDescriptionError);
    }

    // static createdAnswer(description) {
    //     trace(`Answer from remotePeerConnection:\n${description.sdp}.`);
      
    //     trace('remotePeerConnection setLocalDescription start.');
    //     remotePeerConnection.setLocalDescription(description)
    //       .then(() => {
    //         setLocalDescriptionSuccess(remotePeerConnection);
    //       }).catch(setSessionDescriptionError);
      
    //     trace('localPeerConnection setRemoteDescription start.');
    //     localPeerConnection.setRemoteDescription(description)
    //       .then(() => {
    //         setRemoteDescriptionSuccess(localPeerConnection);
    //       }).catch(setSessionDescriptionError);
    //   }
    
}