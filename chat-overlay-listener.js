/* 
    File: Chat-overlay-listener.js
    Version: 
*/

//Function to process a payload send by Amelia, the Amelia url is tasken from the iframe source
function receiveMessage(e, data) {
    var iframeElem = document.getElementById('receiver');
    var ameliaurl = new URL(iframeElem.src);
    var baseurl = "https://" + ameliaurl.hostname;
    var ui_url = "https://" + ameliaurl.hostname + ameliaurl.pathname;
    console.log("AMELIA_OVERLAY::ReceivedMessage: " + e);
    //update the url to your url !!
    if (e.origin !== baseurl) {
        //Check if the origin of the payload is coming from the right Amelia source
        console.log('chatoverlay: Wrong domain!');
        return;
    } else {
        //process payload based on:
        //https://dtools.ipsoft.com/confluence/display/CO/Chat+Overlay+-+Embed+Amelia+Custom+UI+into+your+website#ChatOverlayEmbedAmeliaCustomUIintoyourwebsite-SendamessagefromAmeliatoyourwebsite(parentframe)availablewithAmeliaCustomUIv5.7.0orgreater
        if (e.data.actionType === "errorMessage") {
            console.log("AMELIA_OVERLAY::ReceivedMessage:CustomUI:", e.data.actionData.message);
        }
        if (e.data.action === "sendfunction") {
            console.log("AMELIA_OVERLAY::SendFunctionReceived:", e.data)
            var sFunction = e.data.function
            //the below options are just examples, you can create your own based on the need.
            //These functions should be defined at the end of this file
            console.log("AMELIA_OVERLAY::SendFunction:", sFunction);
            switch (sFunction) {
                case "resetconversation":
                    console.log("AMELIA_OVERLAY::ReceivedMessage:Reset Conversation");
                    resetconversation();
                    var iframe = document.getElementById('receiver');
                    iframe.src = iframe.src;
                    break;
                case "getParentUrl":
                    var url = window.location.href;
                    sendAttributes('{"parenturl": "' + url + '"}');
                    break;
                case "hideoverlay":
                    ChatOverlayAction('hide');
                    break;
                case "showoverlay":
                    ChatOverlayAction('show');
                    break;
                case "showmsg":
                    window.alert("Hello! This message was triggered from Amelia!!");
                    break;
                default:
                    console.log("Default, do nothing");
                    break;
            }
        }
        if (e.data.action === "goto_url") {
            //separate function to open url in new window
            var url = e.data.url;
            if (e.data.newwindow == 'true') {
                window.open(url, "", "top=200,height=600,width=800");
            } else {
                window.location.href = url;
            }
        }
    }
}

//Function to send a payload to Amelia
function sendToAmelia(payload) {
    var iframeElem = document.getElementById('receiver');
    var ameliaurl = new URL(iframeElem.src);
    var url = ameliaurl.origin + ameliaurl.pathname
    var receiverElem = document.getElementById('receiver').contentWindow;
    console.log("AMELIA_OVERLAY::SendToAmelia: " + payload)
    console.log("AMELIA_OVERLAY::SendToAmeliaURL: " + url)
    receiverElem.postMessage(payload, url);
}

//Should be called to triger BPN execution on Amelia
function triggerBPN(bpnname) {
    if (bpnname === undefined) {
        //no bpn name specified
    } else {
        console.log("AMELIA_OVERLAY::ExecuteBPN:" + bpnname);
        myJSON = { 'actionType': 'ameliaBpn', 'actionName': bpnname, "actionData": { "submission": { "shouldEcho": false } } };
        sendToAmelia(myJSON);
    }
}

//Should be called to send attributes to Amelia
function sendAttributes(sAtt) {
    json_att = JSON.parse(sAtt);
    myJSON = { 'actionType': 'ameliaConversationAttributes', 'actionData': json_att };
    sendToAmelia(myJSON);
}

//can be called to reset the conversation
function resetconversation() {
    myJSON = { 'actionType': 'resetConversation', 'actionData': 'true' };
    sendToAmelia(myJSON);
    var iframe = document.getElementById('receiver');
    iframe.src = iframe.src;
}

//can be called to trigger utterance in chat
function sayHi() {
    console.log("send ameliaSay: Hi There");
    myJSON = { 'actionType': 'ameliaSay', 'actionData': 'Hi there' }
    sendToAmelia(myJSON);
}

//should be called to send userinfo but the sendattributes function can be used to send any attributes to amelia as conversation variables.
function sendUserinfo(userid, sometoken) {
    sendAttributes('{"userid": "' + userid + '", "token": "' + sometoken + '"}');
}

function checkOverlayState() {
    var chatOverlayOpen = localStorage.getItem('chatOverlayOpen');
    if (chatOverlayOpen !== "true") {
        ChatOverlayAction('hide');
    } else {
        ChatOverlayAction('show');
    }
}

function ChatOverlayAction(action) {
    /*
     * Toggles opening and closing of the chatOverlay
     * action = 'hide' or 'show'
     * @returns - no return
     */
    var chatOverlayHeaderImgElemOpen = document.getElementsByClassName('chat-overlay-header-img open')[0];
    var chatOverlayHeaderImgElemClose = document.getElementsByClassName('chat-overlay-header-img close')[0];
    var receiverElem = document.getElementById('receiver');
    if (action == 'show') {
        openChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
    } else {
        closeChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
    }
}
//listener to listen for Amelia Messages
window.addEventListener('message', receiveMessage);

