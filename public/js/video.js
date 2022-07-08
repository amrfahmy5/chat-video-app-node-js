/*
note for the two flag :
    first time send request to 2nd device to call and without know this about its rtcSession description
    so first time is send only to get offer and get its candinate 
    and run callUser function again with 2nd user description 
    sor isAlreadyCalling to prevent infinit loop
    get called to prevent two request of user to accept call
اول مرة علشان اجيب بيانات اليوزر زى الايبى وكدة 
الى هيا دى RTCSessionDescription
تانى مرة ببتم الكول فعلاً بين الاتنين
فالاتنين فلاج دول علشان يمنعو الانفينت لووب
so -> answer-made , call-made run twice
*/

let isAlreadyCalling = false;
let getCalled = false;
let localStream;
//RTCSessionDescription ----> have description of potential محتمل connection 
const { RTCPeerConnection, RTCSessionDescription } = window;

let peerConnection = new RTCPeerConnection();

//sender
// create offer and send to second user
function callUser(receiver_id) {
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

    if (!isAlreadyCalling) {
        callUser(data.receiver_id);
        isAlreadyCalling = true;
        document.getElementById("page-chat").style.display = "none";
        document.getElementById("page-video").style.display = "block";
    }
});
//when second user reject call
socket.on("call-rejected", data => {
    alert(`User: "Socket: ${data.receiver_name}" rejected your call.`);
});

//receiver
// receive request for call and can accept or reject call
socket.on("call-made", data => {

    if (getCalled) { // to prevent confirm function run twice
        const confirmed = confirm(
            `User "Socket: ${data.sender_name}" wants to call you. Do accept this call?`
        );
        if (!confirmed) {
            socket.emit("reject-call", {
                sender_id: data.sender_id
            });
            return;
        }
        else
        {
            document.getElementById("page-chat").style.display = "none";
            document.getElementById("page-video").style.display = "block";
        }
    }
    beReady().then(async (bool) => {
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        console.log("hi2");
        socket.emit("make-answer", {
            answer,
            sender_id: data.sender_id
        });
        getCalled = true 
    })
});



// here how act with another user video to add to screen
peerConnection.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
        remoteVideo.srcObject = stream;
    }
};
// 
const localVideo = document.getElementById("local-video");
function beReady() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then(stream => {
            localVideo.srcObject = stream;

            localStream = stream; // to use in stop call
            // add track here to use in peerConnection.ontrack
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            return true;
        })
        .catch(function (e) {
            alert('getUserMedia() error: ' + e.name);
        });
}

function stopCall() {
    localStream.getTracks().forEach(track => track.stop());
    peerConnection.close();
    peerConnection = null;
    document.getElementById("page-chat").style.display = "block";
    document.getElementById("page-video").style.display = "none";

}