const textInput = document.querySelector('#text-input')
const msgBoard = $("#msg-board")

window.onresize = function() {
    if (window.innerWidth <= 750) {
        textInput.setAttribute('placeholder', '@message')
    }
}

let clientMessage;
let userName = 'user21'

function sendMessage() {
    clientMessage = $('#text-input').val()
    if (clientMessage != '') {
        console.log(clientMessage)

        // update msg board for client
        updateMsgBoardForClient()
        // scroll to bottom
        scrollToBottom()

        // msgBoard.css("padding-top", '10px')

        // clear text input
        $('#text-input').val('')
        // focus text input
        $('#text-input').focus()
    }
}

// send message to the socket.io server
function sendMessageToServer() {

}

// scroll textarea to the bottom to the latest message
function scrollToBottom() {
    msgBoard.scrollTop(msgBoard.prop("scrollHeight"));
}

function updateMsgBoardForClient() {
    let msgBoardContent = $('#msg-board').val()
    let newMessageToAdd = userName + ': ' + clientMessage
    $('#msg-board').val('\n' + msgBoardContent + newMessageToAdd.trim() + '\n')
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
    if (document.activeElement === textInput || $('#text-input').is(':focus')) {
        if (e.key === 'Enter') {
            // preventMoving(e)
            sendMessage()
        }
    }
})

// press button to send message
$('.send-btn').click(sendMessage);
$('.plane-icon').click(sendMessage);
