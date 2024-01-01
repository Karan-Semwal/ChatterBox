import * as utils from './utils.js'

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
const gUserNameColor = utils.getRandomColor()

// enter chat after submitting username
$('.enter-chat-btn').click(enterChat)

function enterChat() {
    gUserName = userNameInput.val();
    if (utils.isUserNameValid(gUserName)) {
        $('#myModal').css('display', 'none')
        textInput.focus()
    } else {
        onInvalidUserName()
    }
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
    if (!isLastUserNameSame(gUserName, gUserNameColor)) {
        const newMessageSent = document.createElement('div')
        newMessageSent.classList.add('message')
        // add styling for current user's mesage
        newMessageSent.classList.add('current-user-msg')
        newMessageSent.innerHTML = `<h4 class="chat-username" style="color:${gUserNameColor}">${gUserName}</h4>
        <p class="chat-user-msg">
            ${msg}
        </p>`
        // append new message element
        msgBoard.append(newMessageSent)
    }
    else {
        onLastUserNameSame(msg)
    }
}

function updateRecievedMsgOnMsgBoard(msg) {
    let firstSplit = msg.split('#')
    const senderUserName = firstSplit[0]
    const senderUserNameColor = '#' + firstSplit[1]
    const senderMessage = firstSplit[2]

    if (!isLastUserNameSame(senderUserName, senderUserNameColor)) {
        const newMessageSent = document.createElement('div')
        newMessageSent.classList.add('message')
        newMessageSent.innerHTML = `<h4 class="chat-username" style="color:${senderUserNameColor}">${senderUserName}</h4>
    <p class="chat-user-msg">
        ${senderMessage}
    </p>`
        // append new message element
        msgBoard.append(newMessageSent)
    } else {
        onLastUserNameSame(senderMessage)
    }
}

// press enter to send message
window.addEventListener('keypress', (e) => {
    if (textInput.is(':focus')) {
        if (e.key === 'Enter') {
            // to stop textarea's default Enter key even behaviour
            utils.preventMoving(e)
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

// check if the latest message's username is same to the last message's username
function isLastUserNameSame(latestSenderUserName, color) {
    const msgBoard = document.querySelector('#msg-board');
    const lastMessageElement = msgBoard.lastElementChild
    let lastMsgHeadingElementColor;
    let userName;

    if (lastMessageElement) {
        const userNameElement = lastMessageElement.querySelector('.chat-username');
        lastMsgHeadingElementColor = utils.rgb2hex(userNameElement.style.color)
        if (userNameElement) {
            userName = userNameElement.textContent;
        }
    } else {
        return false
    }
    // match last msg's usernames
    if (latestSenderUserName === userName) {
        // match last same username's colors
        return lastMsgHeadingElementColor === color
    }
}

function onLastUserNameSame(msg) {
    const msgParagraphElement = document.createElement('p')
    msgParagraphElement.classList.add('chat-user-msg');
    msgParagraphElement.innerText = msg
    const msgBoard = document.querySelector('#msg-board');
    const lastMessageElement = msgBoard.lastElementChild;
    if (lastMessageElement) {
        lastMessageElement.appendChild(msgParagraphElement)
    }
}
