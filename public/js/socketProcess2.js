const socket = io();
let my_name = '', my_image = '', my_id = '', unreadMessage = false;
socket.emit("login");

function setMessageReaded(sender_id) {
    if (unreadMessage)
        socket.emit("readMessage", { sender_id })
}


function sendMessageOnEnter(e, receiver_id) {
    if (e.key === "Enter") {
        let message_content = e.target.value;
        e.target.value = '';
        socket.emit("send_message", {
            message_content,
            receiver_id,
            message_time: new Date(),
        });
        let messageHtml = sendMessageHtml(my_name, my_image, message_content, new Date());
        // console.log(messageHtml);
        $(`#chat-box-${receiver_id}`).append(messageHtml);
        scrollEndChat();

    }
}


socket.on("receive_message", (data) => {
    unreadMessage = true;
    let { message_content, message_time, sender_id, sender_name, sender_img, IsPublic } = data
    let messageHtml = receiveMessageHtml(sender_name, sender_img, message_content, message_time);
    $(`#chat-box-${(IsPublic) ? "0" : sender_id}`).append(messageHtml);
    showNotification(sender_name,sender_img,message_content)
    scrollEndChat();

});
function changeUserStatus(user_id, ISonline, lastOPenDate) {
    let person = $(`.person#person-${user_id} .status`);
    let personTime = $(`.person#person-${user_id} .time`);

    if (ISonline) {
        person.removeClass("offline");
        person.addClass("online");
        personTime.text("online");
    } else {
        person.addClass("offline");
        person.removeClass("online");
        personTime.text(lastOPenDate);
    }

}
socket.on("user-login", async function (data) {
    changeUserStatus(data.user_id, true, "")
});
socket.on("user-logout", function (data) {
    changeUserStatus(data.user_id, false, dateFormat(new Date()))
});


function typing(receiver_id) {
    socket.emit("typing", { receiver_id });
}
function stoptyping(receiver_id) {
    socket.emit("stopTyping", { receiver_id });
}

socket.on("typing", function (data) {
    $(`.person#person-${data.sender_id} .time`).text("Typing...")
});
socket.on("stopTyping", function (data) {
    $(`.person#person-${data.sender_id} .time`).text("Online")
});

socket.on("message", function (data) {
    my_name = data.user_name;
    my_image = data.user_img;
    my_id = data.user_id
});
socket.on("setReaded", function (data) {
    setIconReadedHtml(data.sender_id);
});
/*
remaining :
start room chat
audio and video chat
*/

