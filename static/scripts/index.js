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
    } else {
        textInput.attr({ placeholder: 'Type your message here @chat' })
    }
}

// global variables
let gUserName;
let gClientMessage;
const gUserNameCharLimit = 25;
// color of username text
const gUserNameColor = (function getRandomColor() {
    var letters = '456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
})();

function enterChat() {
    gUserName = userNameInput.val();
    if (isUserNameValid(gUserName)) {
        $('#myModal').css('display', 'none')
        textInput.focus()
    } else {
        onInvalidUserName()
    }
}

// validate user name
function isUserNameValid(username) {
    // NOTE: username must not be empty and not have a '#'
    // and username length should be less than limit
    return (username.trim() !== "") &&
        (username.indexOf('#') == -1) &&
        (username.length <= gUserNameCharLimit)
}

function onInvalidUserName() {
    userNameInput.css('border', '1px solid red')
    userNameInput.css('border-radius', '2px')
    $('.invalid-msg').css('display', 'block')
}

function sendMessage() {
    gClientMessage = $('#text-input').val()
    if (gClientMessage != '') {
        sendMessageToServer(gClientMessage)
        // update msg board for client
        updateCurrClientMsgOnMsgBoard(gClientMessage)
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

function updateCurrClientMsgOnMsgBoard(msg) {
    // create new message element
    const newMessageSent = document.createElement('div')
    newMessageSent.classList.add('message')
    newMessageSent.innerHTML = `<h4 class="chat-username" style="color:${gUserNameColor}">${gUserName}</h4>
    <p class="chat-user-msg">
        ${msg}
    </p>`
    // append new message element
    msgBoard.append(newMessageSent)
}

function updateRecievedMsgOnMsgBoard(msg) {
    let firstSplit = msg.split('#')
    const senderUserName = firstSplit[0]
    const senderUserNameColor = '#' + firstSplit[1]
    const senderMessage = firstSplit[2]
    
    const newMessageSent = document.createElement('div')
    newMessageSent.classList.add('message')
    newMessageSent.innerHTML = `<h4 class="chat-username" style="color:${senderUserNameColor}">${senderUserName}</h4>
    <p class="chat-user-msg">
        ${senderMessage}
    </p>`
    // append new message element
    msgBoard.append(newMessageSent)
}

// prevent new line in textarea
function preventMoving(event) {
    let key = event.keyCode;
    if (event.keyCode == 13) {
        event.preventDefault();
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
    updateRecievedMsgOnMsgBoard(message)
})

// sending message to the server
function sendMessageToServer(msg) {
    let messageHeader = gUserName + gUserNameColor
    let msgForServer = messageHeader + '#' + msg
    socket.emit('userMessage', msgForServer)
}