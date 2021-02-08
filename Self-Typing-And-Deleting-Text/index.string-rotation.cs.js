// Téměř stejné jako index.cs.js - v místech, kde se kód liší je vysvětlující
// komentář.

// Tady je přidanej extra parametr pro startTextAnimation() - pole řetězců
// které mají být vypisovány.
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
let keyStrokeSpeedRange = [50, 100];   // Rychlejší psaní.
let typeForward = true;
let targetElement;
let string;

let stringsPointer = 0;
let strings = []

// Logicky - když předáváme více parametrů, musíme upravit i jejich seznam
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
            // Když dojdeme do bodu, že se má začít psát text znovu dopředu
            // tak změníme řetězec, který má být vypisován. Zároveň upravíme
            // ukazatel do pole řetězců, aby byl o jedna větší (nebo pokud
            // jsme dorazili k poslednímu řetězci, tak aby byl zptáky na nule
            // - tak funguje % (modulo) operátor).
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