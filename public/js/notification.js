let permission = Notification.permission;
if (permission === "default") {
    requestAndShowPermission();
}

function requestAndShowPermission() {
    Notification.requestPermission(function (permission) {
        
    });
}


function showNotification(title,img, body) {

    let icon = img; //this is a large image may take more time to show notifiction, replace with small size icon

    let notification = new Notification(title, { body, icon });

    notification.onclick = () => {
        notification.close();
        window.parent.focus();
    }

}