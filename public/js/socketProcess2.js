function buildFullDate(time) {
    return new Date().toLocaleDateString("en-US")+" , "+new Date().getHours()+":"+new Date().getMinutes() ;
}
function buildTimeHtml(time) {
    return `
    <div class="chat-hour">${buildFullDate(time)} <span class="fa"></span></div>
    `
}
function buildMessageHtml(message) {
    return `
    <div class="chat-text">${message}</div>
    `
}
function buildAvatarHtml(name, img) {
    return `
    <div class="chat-avatar">
        <img src="${img}" alt="${name}">
        <div class="chat-name">${name}</div>
    </div>
    `
}
function sendMessageHtml(name, img, message, time) {
    return `
    <li class="chat-left">
    ${buildAvatarHtml(name, img)}
    ${buildMessageHtml(message)}
    ${buildTimeHtml(time)}
    </li>
    `
}
function receiveMessageHtml(name, img, message, time) {
    return `
    <li class="chat-right">
    ${buildTimeHtml(time)}
    ${buildMessageHtml(message)}
    ${buildAvatarHtml(name, img)}
    </li>
    `
}

function setIconReadedHtml(send_id) {
    let readedIcon = document.querySelectorAll(`#chat-${send_id} .chat-hour .fa`);
    for (let i = 0; i < readedIcon.length; i++) {
        if(!readedIcon[i].classList.contains("fa-check-circle"))
            readedIcon[i].classList.add("fa-check-circle");
    }
}

const  socket = io();
let my_name=''  , my_image='',my_id='',unreadMessage=false;
socket.emit("login");

function setMessageReaded(sender_id) {
    if(unreadMessage)
        socket.emit("readMessage",{sender_id})
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
        $(`#chat-box-${receiver_id}`).append(messageHtml)
    }
}


socket.on("receive_message", (data) => {
    unreadMessage=true;
    let { message_content, message_time, sender_id, sender_name, sender_img, IsPublic } = data
    let messageHtml = receiveMessageHtml(sender_name, sender_img, message_content, message_time);
    $(`#chat-box-${(IsPublic) ? "0" : sender_id}`).append(messageHtml)
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
    changeUserStatus(data.user_id, false,buildFullDate(new Date()))
});


function typing(receiver_id) {
    socket.emit("typing",{receiver_id});
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

socket.on("message",function (data) {
    my_name=data.user_name ;
    my_image=data.user_img ;
    my_id=data.user_id
});
socket.on("setReaded", function (data) {
    setIconReadedHtml(data.sender_id);
});

/*
remaining :
check user should log in to make socket emit
show saved message 
start room chat
*/