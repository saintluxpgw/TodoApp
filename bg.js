const body = document.querySelector("body");
const IMG_NUMBER = 5;

function paintImage(imgNumber){
    const image = new Image();
    image.src = `images/${imgNumber}.jpg`;
    body.appendChild(image);
}

function getRandom(){
    const number = Math.ceil(Math.random()*5);
    return number;
}

function init(){
    paintImage(getRandom());
}
init();