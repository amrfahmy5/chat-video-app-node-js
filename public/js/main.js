
//additional function
function searchUser(e) {
  var input, filter, users, aTags, a, i, txtValue;
  input = e.target.value;
  filter = input.toUpperCase();
  users = document.getElementById("users");
  aTags = users.getElementsByTagName("li");
  for (i = 0; i < aTags.length; i++) {
    a = aTags[i].getElementsByClassName("name")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      aTags[i].style.display = "";
    } else {
      aTags[i].style.display = "none";
    }
  }
}

function dateFormat(time) {
  return new Date().toLocaleDateString("en-US") + " , " + new Date().getHours() + ":" + new Date().getMinutes();
}

function scrollEndChat() {
  var scrollDiv = document.querySelectorAll("ul");
  scrollDiv.forEach(element =>
    element.scrollTop = element.scrollHeight
  );
}


//-------------------------



// message component
function buildTimeHtml(time,isReaded=false) {
  return `
  <div class="chat-hour">${dateFormat(time)} <span class="fa ${isReaded?'fa-check-circle':''}"></span></div>
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
// ------------------------------
// collect message component
function sendMessageHtml(name, img, message, time,isReaded=false) {
  return `
  <li class="chat-left">
  ${buildAvatarHtml(name, img)}
  ${buildMessageHtml(message)}
  ${buildTimeHtml(time,isReaded)}
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
// ---------------------

function setIconReadedHtml(send_id) {
  let readedIcon = document.querySelectorAll(`#chat-${send_id} .chat-left .chat-hour .fa`);
  console.log(readedIcon);
  for (let i = 0; i < readedIcon.length; i++) {
    if (!readedIcon[i].classList.contains("fa-check-circle"))
      readedIcon[i].classList.add("fa-check-circle");
  }
}

function showChatContainer(event, receiver_id, receiver_name, receiver_img) {

  //show chat cart body of user and display others
  let chatsBody = document.getElementsByClassName("chat-body");
  for (let i = 0; i < chatsBody.length; i++) {
    if (chatsBody[i].id == "chat-" + receiver_id)
      chatsBody[i].classList.remove("d-none");
    else
      chatsBody[i].classList.add("d-none");
  }

  //make user active
  let active_user = document.querySelector(".active-user")
  if (active_user) active_user.classList.remove("active-user");
  document.querySelector(`.person#person-${receiver_id}`).classList.add("active-user")
}

function getChatData(receiver_id, receiver_name, receiver_img) {
  if($(`#chat-box-${receiver_id} li`).length!=0) return ;
  $.get(`/getChat/${my_id}/${receiver_id}`, function (data, status) {
    for (let i = 0; i < data.length; i++) {
      const message = data[i];
      if(message.isReaded)
      unreadMessage= true;
      let messageHtml = (message.sender_id == my_id) ?
        sendMessageHtml(my_name, my_image, message.message_content, new Date(),message.isReaded) :
        receiveMessageHtml(receiver_name, receiver_img, message.message_content, message.created_time);
      $(`#chat-box-${receiver_id}`).append(messageHtml);
    }
    scrollEndChat();
  });
}
