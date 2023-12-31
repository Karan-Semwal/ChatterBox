const msgBoard = $("#msg-board")
const textInput = $('#text-input')
const userNameInput = $('#username')

// NOTE: sent message format: <username><#ff77ee>#<message>

window.onload = function () {
    userNameInput.focus()
}

window.onresize = function () {
    if (window.innerWidth <= 750) {
        textInput.attr({ placeholder: '@message' })
    }
}

// global variables
let gUserName;
let gClientMessage;

// color of username text
const userNameColor = (function getRandomColor() {
    var letters = '23456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 12)];
    }
    console.log(color)
    return color;
})();

// NOTE: username must not be empty and not have a '#'
function enterChat() {
    gUserName = userNameInput.val();
    if (gUserName.trim() !== "" && gUserName.indexOf('#') == -1) {
        $('#myModal').css('display', 'none')
    } else {
        console.log("Please enter a valid username.");
        onInvalidUserName()
    }
    console.log(gUserName)
}

function onInvalidUserName() {
    userNameInput.css('border', '1px solid red')
    userNameInput.css('border-radius', '2px')
    $('.invalid-msg').css('display', 'block')
}

function sendMessage() {
    gClientMessage = $('#text-input').val()
    if (gClientMessage != '') {
        console.log(gClientMessage)

        sendMessageToServer(gClientMessage)
        // update msg board for client
        updateMsgBoardForClient(gClientMessage)
        // scroll to bottom
        scrollToBottom()
        // clear text input
        $('#text-input').val('')
        // focus text input
        $('#text-input').focus()
    }
}

// scroll textarea to the bottom to the latest message
function scrollToBottom() {
    msgBoard.scrollTop(msgBoard.prop("scrollHeight"));
}

function updateMsgBoardForClient(msg) {
    // create new message element
    const newMessageSent = document.createElement('div')
    newMessageSent.classList.add('message')
    newMessageSent.innerHTML = `<h4 class="chat-username" style="color:${userNameColor}">${gUserName}</h4>
    <p class="chat-user-msg">
        ${msg}
    </p>`
    // append new message element
    msgBoard.append(newMessageSent)
}

function onSuccessSend() {

}

// prevent new line in textarea
function preventMoving(event) {
    let key = event.keyCode;
    if (event.keyCode == 13) {
        event.preventDefault();
        console.log('foo')
    }
}

// press enter to send message
window.addEventListener('keypress', (e) => {
    if (textInput.is(':focus')) {
        if (e.key === 'Enter') {
            // preventMoving(e)
            sendMessage()
        }
    }

    // press Enter to enter the chat after providing username
    if (userNameInput.is(':focus')) {
        if (e.key === 'Enter') {
            enterChat()
        }
    }
})

// press button to send message
$('.send-btn').click(sendMessage);
$('.plane-icon').click(sendMessage);

// socketio
const socket = io();

// receiving message from server
socket.on('message', message => {
    console.log(message)
    updateMsgBoardForClient(message)
})

// sending message to the server
function sendMessageToServer(msg) {
    socket.emit('userMessage', msg)
}