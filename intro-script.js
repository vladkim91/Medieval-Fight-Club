const logo = document.getElementById('logo');
const message = document.getElementById('bouncer-message');
let snd = new Audio('music.mp3');
const alertMessage = () => {
  alert('Press Enter to start the game');
  alert('Press space to talk to the bouncer');
};
setTimeout(alertMessage, 1000);
document.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    logo.classList.add('fade-out');
    snd.play();
    setTimeout(hideLogo, 7500);
    setTimeout(showBouncer, 7500);
  }
});

const hideLogo = () => {
  logo.classList.add('hidden');
};
const showBouncer = () => {
  document.getElementById('bouncer-container').classList.remove('hidden');
};

let i = 0;
const bouncerQuotes = [
  'Stop! State your business Maggot!',
  'Oh, nevermind kind sir. We get a lot of troublemakers in this area',
  'This Tavern is not your regular tavern',
  "People don't come here to drink! They come here to fight!",
  'If you want to get in, you need to know 8 rules',
  'First rule of medieval fight club is ...',
  'Oh who cares. Just go in and start fighting',
  "Almost forgot, you can't get in unless you have a weapon",
  'Here, take this useless sword',
  'Welcome to Medieval Fight Club'
];

const displayCurrentMessage = (i) => {
  message.innerText = bouncerQuotes[i];
};

message.innerText = bouncerQuotes[0];

document.addEventListener('keyup', function (event) {
  document
    .getElementById('conversation-bubble')
    .children[0].classList.remove('hidden');
  if (event.keyCode === 32) {
    i++;
    displayCurrentMessage(i);
  }
  console.log(i);
  if (i == 10) {
    document.getElementById('conversation-bubble').classList.add('hidden');
  }
});

document.getElementById('door').addEventListener('mouseover', () => {
  document.getElementById('door').classList.add('glow');
});
document.getElementById('door').addEventListener('mouseout', () => {
  document.getElementById('door').classList.remove('glow');
});
document.getElementById('door').addEventListener('click', () => {
  window.location = '/game.html';
});
