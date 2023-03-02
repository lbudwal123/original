/* 
    File: Chat-overlay-core.js
    Version: 

*/
function geturl() {
  //AmeliaUrl is an element on the parent page of the chat-overlay. this is to help with DEV/STAGE/PROD processes
  //You could pass the AmeliaURL forinstance on the website as a hidden field and then read it
  //var AmeliaUrl = document.getElementById("AmeliaUrl").value
  var baseurl = "https://porterair.dev.amelia.com";
  var uibundlename = "porterair_dev";
  var domaincode = "porterair";
  var AmeliaUrl = baseurl + '/Amelia/ui/' + uibundlename + '/?embed=iframe&domainCode=' + domaincode;
  return AmeliaUrl;
}
var clientConfig = {
  iframeSrc: geturl(),
  openOnLoad: false,
  header: {
    backgroundColor: '#044280',
    backgroundImage: ''  //here you can specify the path to a logo that should be display at the top of the chat window
  },
  //Update the below paths to refelct your paths to the images, also update the colorcode is needed.
  openCloseContainer: {
    openIconSrc: '/images/open.png',
    closeIconSrc: '/images/close.png',
    backgroundColor: '#044280'
  },
  banner: {
    title: '',
    helper: '',
    description: ''
  }
};

/*
You should not have to update any code below this, making changes here might have unexpected results
====================================================================================================
*/

var isInit = false;
var chatOverlayDefaultStateOpen = false;

function Config(config) {
  this.header = config.header || {};
  this.openCloseContainer = config.openCloseContainer || {};
  this.openOnLoad = config.openOnLoad || false;
  this.iframeSrc = config.iframeSrc || '';
  this.banner = {
    title: config.banner && config.banner.title || '',
    helper: config.banner && config.banner.helper || '',
    description: config.banner && config.banner.description || ''
  };
}

Config.prototype = {
  setConfig: function () {
    var styles = [];
    if (this.header.backgroundImage) {
      var headerLogo = document.querySelector('.header-logo img.logo');
      headerLogo.src = this.header.backgroundImage;
      var chatOverlayHeaderMobile = document.querySelector('.chat-overlay-wrapper .chat-overlay-header-mobile img.logo');
      chatOverlayHeaderMobile.src = this.header.backgroundImage;
    } else {
      var headerLogo = document.querySelector('.header-logo img.logo');
      headerLogo.alt = "";
    }

    if (this.header.backgroundColor) {
      styles.push('.header-logo { display: flex; background-color: ' + this.header.backgroundColor + '}');
      styles.push('.chat-overlay-wrapper .chat-overlay-header-mobile { background-color: ' + this.header.backgroundColor + '}');
    }

    if (this.openCloseContainer.backgroundColor) {
      styles.push('.chat-overlay-header { background-color: ' + this.openCloseContainer.backgroundColor + '}');
    }

    if (this.openCloseContainer.openIconSrc) {
      var openIconSrc = document.querySelector('.chat-overlay-header .chat-overlay-open');
      openIconSrc.src = this.openCloseContainer.openIconSrc;
    }

    if (this.openCloseContainer.closeIconSrc) {
      var closeIconSrc = document.querySelector('.chat-overlay-header .chat-overlay-close');
      closeIconSrc.src = this.openCloseContainer.closeIconSrc;
    }

    if (this.openOnLoad) {
      chatOverlayDefaultStateOpen = true;
    }

    if (this.banner.title && this.banner.helper && this.banner.description) {
      styles.push('.chat-overlay-banner { display: block; }');
      styles.push('.chat-overlay-closed { height: 210px; }');
      var chatOverlayBanner = document.querySelector('.chat-overlay-banner');
      chatOverlayBanner.children[0].innerHTML = this.banner.title;
      chatOverlayBanner.children[1].innerHTML = this.banner.helper;
      chatOverlayBanner.children[2].innerHTML = this.banner.description;
    }

    if (styles.length) {
      var stylesElem = document.createElement('style');
      stylesElem.innerHTML = styles.join(' ');
      document.body.appendChild(stylesElem);
    }
  }
}

var config = new Config(clientConfig);
config.setConfig();

function init() {
  document.getElementById('receiver').src = config.iframeSrc;
  isInit = true;
}

function openChatOverlay(receiverElem, imgElemOpen, imgElemClose) {
  if (!isInit) {
    init();
  }
  document.getElementById('receiver').classList.add("chat-overlay-open");
  document.getElementById('receiver').classList.remove("chat-overlay-close");
  document.getElementsByClassName('chat-overlay')[0].classList.add("chat-overlay-open");
  document.getElementsByClassName('chat-overlay')[0].classList.remove("chat-overlay-closed");
  document.getElementsByClassName('chat-overlay-header-mobile')[0].classList.remove('chat-overlay-close');
  document.getElementsByClassName('chat-overlay-banner')[0].classList.add('chat-overlay-close');
  if (imgElemClose) imgElemClose.style.opacity = 1;
  if (imgElemOpen) imgElemOpen.style.opacity = 0;
  localStorage.setItem('chatOverlayOpen', true);
}

function closeChatOverlay(receiverElem, imgElemOpen, imgElemClose) {
  document.getElementById('receiver').classList.add("chat-overlay-close");
  document.getElementById('receiver').classList.remove("chat-overlay-open");
  document.getElementsByClassName('chat-overlay')[0].classList.add("chat-overlay-closed");
  document.getElementsByClassName('chat-overlay')[0].classList.remove("chat-overlay-open");
  document.getElementsByClassName('chat-overlay-header-mobile')[0].classList.add('chat-overlay-close');
  document.getElementsByClassName('chat-overlay-banner')[0].classList.remove('chat-overlay-close');
  if (imgElemOpen) imgElemOpen.style.opacity = 1;
  if (imgElemClose) imgElemClose.style.opacity = 0;
  localStorage.setItem('chatOverlayOpen', false);
}

function toggleChatOverlay() {
  /**
   * Toggles opening and closing of the chatOverlay
   * @returns - no return
   */
  var chatOverlayHeaderImgElemOpen = document.getElementsByClassName('chat-overlay-header-img chat-overlay-open')[0];
  var chatOverlayHeaderImgElemClose = document.getElementsByClassName('chat-overlay-header-img chat-overlay-close')[0];
  var receiverElem = document.getElementById('receiver');
  if (receiverElem.classList.contains('chat-overlay-close')) {
    openChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
  } else {
    closeChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
  }
}

var chatOverlayHeaderElem = document.getElementsByClassName('chat-overlay-header')[0];
chatOverlayHeaderElem.addEventListener('click', toggleChatOverlay);
var chatOverlayHeaderElemMobile = document.getElementsByClassName('chat-overlay-header-mobile')[0];
chatOverlayHeaderElemMobile.addEventListener('click', toggleChatOverlay);
var chatOverlayHeaderLogoClose = document.querySelector('.header-logo img.chat-overlay-close');
if (chatOverlayHeaderLogoClose) chatOverlayHeaderLogoClose.addEventListener('click', closeChatOverlay);
var chatOverlayHeaderLogoSvgClose = document.querySelector('.header-logo svg.chat-overlay-close');
if (chatOverlayHeaderLogoSvgClose) chatOverlayHeaderLogoSvgClose.addEventListener('click', closeChatOverlay);


if (typeof (Storage) !== "undefined") {
  var chatOverlayOpen = localStorage.getItem('chatOverlayOpen');
  var chatOverlayHeaderImgElemOpen = document.getElementsByClassName('chat-overlay-header-img chat-overlay-open')[0];
  var chatOverlayHeaderImgElemClose = document.getElementsByClassName('chat-overlay-header-img chat-overlay-close')[0];
  var receiverElem = document.getElementById('receiver');
  if (chatOverlayOpen && localStorage.getItem('chatOverlayOpen') === "false") {
    closeChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
  } else if (chatOverlayOpen && localStorage.getItem('chatOverlayOpen') === "true" || chatOverlayDefaultStateOpen) {
    openChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
  }
} else {
  // Sorry! No Web Storage support..
  console.log('No localStorage support')
}

if (!isInit) {
  init();
}
