"use strict";
const public_chat_id = 0 ;

const socket = io();
let name, img;
function typing() {
  socket.emit("typing");
}
function stoptyping() {
  socket.emit("stopTyping", { id: socket.id, name });
}
function onEnter() {
  if (event.key === "Enter") sendMessage();
}
function scrollEndChat() {
  // var scrollDiv = document.getElementById("chat-messages");
  // scrollDiv.scrollTop = scrollDiv.scrollHeight;
}
function addSenderMessageToView(messageContent, reciever_id) {
  $(`#chat-messages-${reciever_id}`).append(`
  <div class="d-flex justify-content-start mb-4">
  <div class="img_cont_msg">
  <img src="${img}"class="rounded-circle user_img_msg">
  </div>
  <div class="msg_cotainer">${messageContent}
  <span class="msg_time">
    ${new Date().getHours()}:
    ${new Date().getMinutes()} , Today
    </span></div></div>`);
}
function sendMessage() {
  let messageContent = document.getElementById("message").value;
  let receiver_id = document.getElementById("user-id").textContent;
  $("#message").val("");
  socket.emit("send_message", {
    messageContent,
    receiver_id,
    time: new Date(),
  });
  addSenderMessageToView(messageContent, receiver_id);
  scrollEndChat();
}


function addReceiverMessageToView(senderData) {
  console.log(senderData.sender_id);
  $(`#chat-messages-${senderData.sender_id}`).append(`
    <div class="d-flex justify-content-end mb-4" title="${senderData.sender_name}">
    <div class="msg_cotainer_send">${senderData.message_content}
    <span class="msg_time_send">${new Date(senderData.message_time).getHours()} : ${new Date(senderData.message_time).getMinutes()} , Today </span>
    </div>
    <div class="img_cont_msg">
    <img src="${senderData.sender_img}"class="rounded-circle user_img_msg">
    </div></div>`);
}


function leaveUserAlertMessage(name) {
  $("#chat-messages-public").append(`
    <div class="text-center" style="color: white;">
    <strong> ${name} </strong> leaved our chat</div>`);
}
function newUserAlertMessage(name) {
  $("#chat-messages-public").append(`
    <div class="text-center" style="color: white;">
    <strong> ${name} </strong> joined our chat </div>`);
}
function makeUserOnline(user_id) {
  $(`#user-${user_id} .online_icon`).removeClass("offline");
  $(`#user-${user_id} .user-status`).text("online");
}
function makeUserOffline(user_id) {
  $(`#user-${user_id} .online_icon`).addClass("offline");
  $(`#user-${user_id} .user-status`).text("offline");
}
function showChat(reciverID, reciverName, reciverImg) {
  //change chat cart to user details
  $("#user-name").text(reciverName);
  $("#user-img").attr("src", reciverImg);
  $("#user-id").text(reciverID);

  //show chat cart body of user and display others
  let chatsBody = document.getElementById("chat-body").children;
  for (let i = 0; i < chatsBody.length; i++) {
    if (chatsBody[i].id == "chat-messages-" + reciverID)
      chatsBody[i].classList.remove("d-none");
    else
      chatsBody[i].classList.add("d-none");
  }

  //make user active
  const activeChats = document.querySelectorAll(".active");
  activeChats.forEach((ac) => {
    ac.classList.remove("active");
  });
  $(`#user-${reciverID}`).attr("class", "active");
}

$(document).ready(function () {
  socket.emit("login");

  socket.on("new_user", async function (data) {
    makeUserOnline(data.user_id);
    newUserAlertMessage(data.user_name);
  });
  socket.on("remove_user", function (data) {
    makeUserOffline(data.user_id)
    if (data.user_name) leaveUserAlertMessage(data.user_name);
  });

  $("#send_message").click(sendMessage);


  socket.on("receive_message", (data) => {
    let current_chat_id = document.getElementById("user-id").textContent;
    data.sender_id = data.receiver_id=="0"?"0":data.sender_id; //for public chat
    if (data.sender_id != current_chat_id  ) showChat(data.sender_id, data.name, data.img);
    addReceiverMessageToView(data);
    scrollEndChat();

  });

  socket.on("typing", function (data) {
    $("#ty-" + data.user_id).text("Typing...");
  });
  socket.on("stopTyping", function (data) {
    
    $("#ty-" + data.user_id).text("Online");
  });
});
