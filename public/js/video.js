//RTCSessionDescription ----> have description of potential محتمل connection 
const { RTCPeerConnection, RTCSessionDescription } = window;

let receiver_id, peerConnection, otherUser, localStream;
//sender
// create offer and send to second user
function callUser(receiver_idTemp) {
    otherUser = receiver_idTemp;
    receiver_id = receiver_idTemp;
    beReady().then(async (bool) => {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        socket.emit("call-user", {
            offer,
            receiver_id
        });
    })
}

//when second user accept call
socket.on("answer-made", async data => {
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    );
    document.getElementById("page-chat").style.display = "none";
    document.getElementById("page-video").style.display = "block";
});
//when second user reject call
socket.on("call-rejected", data => {
    alert(`User: "Socket: ${data.receiver_name}" rejected your call.`);
});

//receiver
// receive request for call and can accept or reject call
socket.on("call-made", data => {

    const confirmed = confirm(
        `User "Socket: ${data.sender_name}" wants to call you. Do accept this call?`
    );
    otherUser = data.sender_id;
    if (!confirmed) {
        socket.emit("reject-call", {
            sender_id: data.sender_id
        });
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
});


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


const remoteVideo = document.getElementById("remote-video");
const localVideo = document.getElementById("local-video");
function beReady() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then(async stream => {
            localStream = stream;
            localVideo.srcObject = stream;
            await initializePeerConnectionObject();
            peerConnection.addStream(stream);
            return true;
        })
        .catch(function (e) {
            alert('getUserMedia() error: ' + e.name);
        });
}

function initializePeerConnectionObject() {
    try {
        peerConnection = new RTCPeerConnection();
        // to get  2nd user IceCandidate
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved; //not firing


        // peerConnection.ontrack = function ({ streams: [stream] }) {
        //     const remoteVideo = document.getElementById("remote-video");
        //     if (remoteVideo) {
        //         remoteVideo.srcObject = stream;
        //     }
        //not firing
        //     stream.onremovetrack = ({ track }) => {
        //         console.log(`${track.kind} track was removed.`);
        //         if (!stream.getTracks().length) {
        //             console.log(`stream ${stream.id} emptied (effectively removed).`);
        //         }
        //     };
        // };
        return;
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
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

// function handleRemoteStreamRemoved(event) {
//     console.log('Remote stream removed. Event: ', event);
//     alert("call ended")
//     remoteVideo.srcObject = null;
//     localVideo.srcObject = null;
// }



function endCall() {
    localStream.getTracks().forEach(track => track.stop());
    peerConnection.close();
    peerConnection = null;
    document.getElementById("page-chat").style.display = "block";
    document.getElementById("page-video").style.display = "none";

}