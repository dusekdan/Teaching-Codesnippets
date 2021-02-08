// Mostly same as index.en.js - in places where code differs, an explanatory
// comment is left.

// Updated number of parameters passed the startTextAnimation function to
//  include a list of strings to rotate between.
window.addEventListener("load", () => {
    startTextAnimation(
        "Hey, welcome to my page!",
        "textholder",
        [ "Hey, welcome to my page!", 
        "I am webdesigner in-training.", 
        "What can I do for you?" ]
    );
});

let letterPointer = 0;
let keyStrokeSpeedRange = [50, 100];   // Upped the speed a little to be faster.
let typeForward = true;
let targetElement;
let string;

let stringsPointer = 0;
let strings = []

const startTextAnimation = (text, targetId, stringList) => {
    targetElement = document.getElementById(targetId);
    string = text;
    strings = stringList;

    setTimeout(animateAndReschedule, 100);
}


const animateAndReschedule = () => {
    if (letterPointer < string.length && typeForward) {
        targetElement.innerText = string.substring(0, letterPointer);
        letterPointer += 1;

        if (letterPointer == string.length) {
            typeForward = false;
        }
    } 

    else {
        targetElement.innerText = string.substring(0, letterPointer);
        letterPointer -= 1;

        if (letterPointer == 0) {

            // Update pointer into the list of strings to be +1 OR
            // if it is the last string, then to be 0 - that is how that
            // % operator works (modulo operator).
            // When we reach the point where typing should start moving 
            // forward, we change the string that is being typed out. 
            stringsPointer = (stringsPointer+1) % strings.length;
            string = strings[stringsPointer];
            
            typeForward = true;
        }
    }

    setTimeout(animateAndReschedule, pickNextKeyStrokeSpeed());
}

const pickNextKeyStrokeSpeed = () => {
    return Math.floor(
        Math.random() * (keyStrokeSpeedRange[1] - keyStrokeSpeedRange[0]) + keyStrokeSpeedRange[0]
    );
}