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
function showChatContainer(event, receiver_id, receiver_name, receiver_img) {


  //show chat cart body of user and display others
  let chatsBody = document.getElementsByClassName("chat-body");
  for (let i = 0; i < chatsBody.length; i++) {
    if (chatsBody[i].id == "chat-"+receiver_id)
      chatsBody[i].classList.remove("d-none");
    else
      chatsBody[i].classList.add("d-none");
  }

  //make user active
  let active_user = document.querySelector(".active-user")
  if(active_user)active_user.classList.remove("active-user");
  document.querySelector(`.person#person-${receiver_id}`).classList.add("active-user")
}
