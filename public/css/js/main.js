"use strict";
function searchUser() {
  var input, filter, users, aTags, a, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  users = document.getElementById("users");
  aTags = users.getElementsByTagName("li");
  for (i = 0; i < aTags.length; i++) {
    a = aTags[i].getElementsByClassName("user_name")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      aTags[i].style.display = "";
    } else {
      aTags[i].style.display = "none";
    }
  }
}
const socket = io();
let name, img;
function typing() {
  socket.emit("typing", { id: socket.id, name });
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
function addSenderMessageToView(messageContent,reciever_id) {
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
function addReciverMessageToView(recieverDate,reciever_id) {
    $(`#chat-messages-${reciever_id}`).append(`
    <div class="d-flex justify-content-end mb-4" title="${recieverDate.name}">
    <div class="msg_cotainer_send">${recieverDate.messageContent}
    <span class="msg_time_send">${new Date().getHours()} : ${new Date().getMinutes()} , Today </span>
    </div>
    <div class="img_cont_msg">
    <img src="${recieverDate.img}"class="rounded-circle user_img_msg">
    </div></div>`);
}
function sendMessage() {
  let messageContent = document.getElementById("message").value;
  let reciever_id = document.getElementById("user-id").textContent;
  $("#message").val("");

  socket.emit("new_message", {
    id: socket.id,
    messageContent,
    reciever_id,
    time: new Date(),
  });
  addSenderMessageToView(messageContent,reciever_id);
  scrollEndChat();
}
function recieveMessage(data) {
  let reciever_id = document.getElementById("user-id").textContent;
  if (data.id != reciever_id && data.private) showChat(data.id, data.name, data.img);
  addReciverMessageToView(data,data.private?data.id:"public");
  scrollEndChat();
}

function leaveUserAlertMessage(data) {
  $("#chat-messages-public").append(`
    <div class="text-center" style="color: white;">
    <strong> ${data.name} </strong> leaved our chat</div>`);
}
function newUserAlertMessage(data) {
  $("#chat-messages-public").append(`
    <div class="text-center" style="color: white;">
    <strong> ${data.name} </strong> joined our chat </div>`);
}
function addUserToViweList(data) {
  $("#users").append(
    `<li class"active" id="${data.id}" onclick="showChat('${data.id}','${data.name}','${data.img}')"> 
      <div class="d-flex bd-highlight"> 
      <div class="img_cont">
      <img src="${data.img}" class="rounded-circle user_img">
      <span class="online_icon"></span>
      </div>
      <div class="user_info">
      <span class='user_name'>${data.name}</span>
      <p id="ty-${data.id}">Taherah left 7 mins ago</p> 
      </div>
      </div>
      </li>`
  );
  $("#chat-body").append(
    `<div class="d-none"  id="chat-messages-${data.id}"></div>`
  );
}
function showChat(reciverID, reciverName, reciverImg) {
  $("#user-name").text(reciverName);
  $("#user-img").attr("src", reciverImg);
  $("#user-id").text(reciverID);
  let chatsBody = document.getElementById("chat-body").children;
  for (let i = 0; i < chatsBody.length; i++) {
    console.log(reciverID); 
    console.log(chatsBody[i].id); 
    console.log("------------------");
    if(chatsBody[i].id == "chat-messages-"+reciverID)
      chatsBody[i].classList.remove("d-none");
    else
      chatsBody[i].classList.add("d-none");
  }
  const activeChats = document.querySelectorAll(".active");
  activeChats.forEach((ac) => {
    ac.classList.remove("active");
  });
  $(`#${reciverID}`).attr("class","active");
}

$(document).ready(function () {
  $("#login-modal").modal("show");

  $("#set_name").click(function () {
    name = document.getElementById("username").value;
    let imgRadioButton = document.getElementsByName("userimg");

    for (let i = 0; i < imgRadioButton.length; i++) {
      if (imgRadioButton[i].checked) img = imgRadioButton[i].value;
    }
    if (name && img) {
      socket.emit("set_name", {
        name: document.getElementById("username").value,
        img,
      });
      $("#login-modal").modal("toggle");
    } else alert("Name and Image required");
  });

  socket.on("new_user", async function (data) {
    addUserToViweList(data);
    newUserAlertMessage(data);
  });
  socket.on("remove_user", function (data) {
    if (data.name) leaveUserAlertMessage(data);
    $(`#${data.id}`).remove();
  });

  $("#send_message").click(sendMessage);
  socket.on("new_message", recieveMessage);

  socket.on("typing", function (data) {
    $("#ty-" + data.id).text("Typing...");
  });
  socket.on("stopTyping", function (data) {
    $("#ty-" + data.id).text("Online");
  });
});
