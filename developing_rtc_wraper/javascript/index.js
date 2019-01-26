'use strict';

console.log("Radimo rtc")

const streamingConfig = {
    video: true,
};


var video0_id = document.getElementById("video0");
var localPeer = new Peer(streamingConfig, video0_id);

localPeer.startLocalStreaming();

  
  