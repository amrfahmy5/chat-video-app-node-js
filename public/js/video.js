//RTCSessionDescription ----> have description of potential محتمل connection 
const { RTCPeerConnection, RTCSessionDescription } = window;
const remoteVideo = document.getElementById("remote-video");
const localVideo = document.getElementById("local-video");
let receiver_id, peerConnection, otherUser, localStream;
//sender-------------------------------------------------------------------
// create offer and send to second user
function callUser(receiver_idTemp) {
    otherUser = receiver_idTemp;
    receiver_id = receiver_idTemp;
    beReady().then(async (bool) => {

        document.getElementById("page-chat").style.display = "none";
        document.getElementById("page-video").style.display = "block";
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit("call-user", {
            offer,
            receiver_id
        });
    }).catch()
}
//when second user accept call
socket.on("answer-made", async data => {
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    );
});
//when second user reject call
socket.on("call-rejected", data => {
    alert(`User: "Socket: ${data.receiver_name}" rejected your call.`);
    endCall()
});

//receiver---------------------------------------------------------------
// receive request for call and can accept or reject call
socket.on("call-made", data => {
    otherUser = data.sender_id;
    if (!confirm(
        `User "Socket: ${data.sender_name}" wants to call you. Do accept this call?`
    )) {
        socket.emit("reject-call", {
            sender_id: data.sender_id
        });
        endCall();
        return;
    }
    else {
        document.getElementById("page-chat").style.display = "none";
        document.getElementById("page-video").style.display = "block";
        beReady().then(async (bool) => {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.offer)
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
            socket.emit("make-answer", {
                answer,
                sender_id: data.sender_id
            });
            getCalled = true
        })
    }

});



// create peerConnection object
function beReady() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then(async stream => {
            console.log("assign to local stream 1");
            localStream = stream;
            console.log("assign to local stream 2");
            localVideo.srcObject = stream;
            await initializePeerConnectionObject()
            peerConnection.addStream(localStream);
            return true;
        })
        .catch(function (e) {
            console.log('getUserMedia() error: ' + e.name);
            // alert('getUserMedia() error: ' + e.name);
            return false;
        });
}
function initializePeerConnectionObject() {
    try {
        peerConnection = new RTCPeerConnection();
        // to get  2nd user IceCandidate
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved; //not firing
        return;
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        // alert('Cannot create RTCPeerConnection object.');
        return;
    }
}
function handleIceCandidate(event) {
    if (event.candidate) {
        socket.emit("ICEcandidate", {
            user: otherUser,
            rtcMessage: {
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }
        })
    } else {
        console.log('End of candidates.');
    }
}
function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    remoteVideo.srcObject = event.stream;
}
function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
    remoteVideo.srcObject = null;
    localVideo.srcObject = null;
}
// sender and receiver twice get this  and save the candidate of 2nd device
socket.on('ICEcandidate', data => {
    console.log("GOT ICE candidate");
    let message = data.rtcMessage
    let candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
    });
    if (peerConnection) {
        console.log("ICE candidate Added");
        peerConnection.addIceCandidate(candidate);
    }
})

function endCall() {
    console.log("end call");
    if (localStream)
        localStream.getTracks().forEach(track => track.stop());
    if (peerConnection)
        peerConnection.close();
    peerConnection = null;
    document.getElementById("page-chat").style.display = "block";
    document.getElementById("page-video").style.display = "none";
    navigator.mediaDevices = null

}