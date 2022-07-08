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
*/

let isAlreadyCalling = false;
let getCalled = false ;
//RTCSessionDescription ----> have description of potential محتمل connection 
const { RTCPeerConnection, RTCSessionDescription } = window;

const peerConnection = new RTCPeerConnection();

//sender
// create offer and send to second user
async function callUser(receiver_id) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit("call-user", {
        offer,
        receiver_id
    });
}
//when second user accept call
socket.on("answer-made", async data => {
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    );

    if (!isAlreadyCalling) {
        console.log("hiiiiiiiiiiiii");
        callUser(data.receiver_id);
        isAlreadyCalling = true;
    }
});
//when second user reject call
socket.on("call-rejected", data => {
    alert(`User: "Socket: ${data.receiver_name}" rejected your call.`);
});

//receiver
// when another user send request to call and send accept answer to 2nd user
socket.on("call-made", async data => {
    // if (getCalled) { // to prevent confirm function run twice
        const confirmed = confirm(
            `User "Socket: ${data.sender_name}" wants to call you. Do accept this call?`
        );

        if (!confirmed) {
            socket.emit("reject-call", {
                sender_id: data.sender_id
            });

            return;
        }
    // }

    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit("make-answer", {
        answer,
        sender_id: data.sender_id
    });
    getCalled=true


});



// here how act with another user video to add to screen
peerConnection.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
        remoteVideo.srcObject = stream;
    }
};
// 
navigator.getUserMedia(
    { video: true, audio: true },
    stream => {
        const localVideo = document.getElementById("local-video");
        if (localVideo) {
            localVideo.srcObject = stream;
        }
        // add track here to use in peerConnection.ontrack
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    },
    error => {
        console.warn(error.message);
    }
);