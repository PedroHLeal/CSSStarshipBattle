button = document.getElementById('join-button');
input = document.getElementById('game-room-input');

intro = document.getElementById('intro');
intro.style.opacity = 1;

function validateGameRoom(value) {
    const re = /^[a-zA-Z]+$/; 

    if (value.length >= 3 && re.test(value)) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

function buttonClicked() {
    window.location.href = `/game.html?room=${input.value}`;
}

function getStarHTML() {
    return '<div class="star"></div>';
}