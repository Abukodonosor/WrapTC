'use strict';

/* 
TO DO : 
- automatski adapter za config file (hvata sve iz sistema i formira config object, za svakog usera posebno)
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia   (link za config parametar kako treba da napisemo adapter)
- offerOptions //https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer (isparsiraj ovo i prilagodi)
*/


//local config for video stream
const config = {
    // audio: true,
    video: {
        width: { min: 300 },
        height: { min: 300 }
    }
};
//config for remote stream
const offerOptions = {
  offerToReceiveVideo: 1,
};

var base_video = document.getElementById('video0');
var base_enviroment = new LocalEnviroment(base_video, config, offerOptions);
base_enviroment.runLocal();

/* /END Init VideoEnviroment (WEB rtc api), with RUN method to start streaming  immediately */

// var remote_video = document.getElementById('video1');
// var remote_enviroment = new PeerEnviroment(remote_video, config);


//  osecaj pre nego sto ,je to ono sto ti malo fali, pre nego da se ozbiljno malo iznerviras
// remote video caputre
let remotePeerConnection;
const remoteVideo = document.getElementById('video1');
var remote_enviroment = new LocalEnviroment(remoteVideo, config, offerOptions)



// const servers = null;
// do not need this
// localPeerConnection = new RTCPeerConnection(servers);
// localPeerConnection.addEventListener('icecandidate', handleConnection);
// localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

// localPeerConnection.addStream(base_enviroment.localStream);
// trace('Added local stream to localPeerConnection.');
// localPeerConnection.createOffer(offerOptions)
//   .then(createdOffer).catch(setSessionDescriptionError);



function handleConnection(event) {
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

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`);
  }
}

function createdOffer(description) {
  trace(`Offer from localPeerConnection:\n${description.sdp}`);

  trace('localPeerConnection setLocalDescription start.');
  base_enviroment.localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(base_enviroment.localPeerConnection);
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

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
  trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('localPeerConnection setRemoteDescription start.');
  base_enviroment.localPeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(base_enviroment.localPeerConnection);
    }).catch(setSessionDescriptionError);
}



// define buttons for start conversation
let callButton = document.getElementById('call');
let hangupButton = document.getElementById('end');


// events
callButton.addEventListener('click', callAction);
hangupButton.addEventListener('click', hangupAction)

////////////////////dinamic parameters

function callAction() {
  callButton.disabled = false;
  hangupButton.disabled = false;

  console.log("=1")
  console.log(base_enviroment);
  base_enviroment.callPeer(remote_enviroment);
  // trace('Starting call.');
  // // startTime = window.performance.now();

  // // Get local media stream tracks.
  // const videoTracks = base_enviroment.localStream.getVideoTracks();
  // const audioTracks = base_enviroment.localStream.getAudioTracks();
  // if (videoTracks.length > 0) {
  //   trace(`Using video device: ${videoTracks[0].label}.`);
  // }
  // if (audioTracks.length > 0) {
  //   trace(`Using audio device: ${audioTracks[0].label}.`);
  // }

  // const servers = null;  // Allows for RTC server configuration.

  // // Create peer connections and add behavior.
  // base_enviroment.localPeerConnection = new RTCPeerConnection(servers);
  // trace('Created local peer connection object localPeerConnection.');

  // base_enviroment.localPeerConnection.addEventListener('icecandidate', handleConnection);
  // base_enviroment.localPeerConnection.addEventListener(
  //   'iceconnectionstatechange', handleConnectionChange);

  // remotePeerConnection = new RTCPeerConnection(servers);
  // trace('Created remote peer connection object remotePeerConnection.');

  // remotePeerConnection.addEventListener('icecandidate', handleConnection);
  // remotePeerConnection.addEventListener(
  //   'iceconnectionstatechange', handleConnectionChange);
  // remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  // // Add local stream to connection and create offer to connect.
  // base_enviroment.localPeerConnection.addStream(base_enviroment.localStream);
  // trace('Added local stream to localPeerConnection.');

  // trace('localPeerConnection createOffer start.');
  // base_enviroment.localPeerConnection.createOffer(offerOptions)
  //   .then(createdOffer).catch(setSessionDescriptionError);
}

function hangupAction() {
  base_enviroment.localPeerConnection.close();
  remotePeerConnection.close();
  base_enviroment.localPeerConnection = null;
  remotePeerConnection = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
  trace('Ending call.');
}

///////////////////////// Peer helper functions

// Handles remote MediaStream success by adding it as the remoteVideo src.
function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
  trace('Remote peer connection received remote stream.');
}

// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
  trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

// Logs changes to the connection state.
function handleConnectionChange(event) {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
  trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`);
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
  trace(`Failed to create session description: ${error.toString()}.`);
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
  const peerName = getPeerName(peerConnection);
  trace(`${peerName} ${functionName} complete.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Define helper functions. ==========================

// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
  return (peerConnection === base_enviroment.localPeerConnection) ?
      remotePeerConnection : base_enviroment.localPeerConnection;
}

// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
  return (peerConnection === base_enviroment.localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
}

// Logs an action (text) and the time when it happened on the console.
function trace(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}


