'use strict';

console.log("Radimo rtc")

const streamingConfig = {
    video: true,
};

//local peer
var video0_id = document.getElementById("video0");
var localPeer = new Peer(streamingConfig, video0_id);

//remote peer
var video1_id = document.getElementById("video1");
var remotePeer = new Peer(streamingConfig, video1_id);

localPeer.startLocalStreaming();
remotePeer.startLocalStreaming();




var callButton = document.getElementById("call");
var endButton = document.getElementById("end");


callButton.addEventListener('click', doCall);
endButton.addEventListener('click', endCall);


function doCall(){
    console.log("Start call ...");
}

function endCall(){
    console.log("End call ...");
}

  
  