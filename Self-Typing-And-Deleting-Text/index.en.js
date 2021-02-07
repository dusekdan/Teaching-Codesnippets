// (1) First teachable moment is right here: Using window.addEventListener
// instead of setting <body onload="startTextAnimation()"> attribute in HTML
//
// When working on complex projects with multiple libraries, we don't want to
// modify default behavior of the "shared onload" function. For example because
// someone else is already doing that.
//
// Setting the attribute in HTML is like saying: "in the very moment the page 
// loads, my onload function will execute". We can not however ensure that 
// some other library will not override this after we set it up.
//
// The way it is written below says basically "once browser says that load 
// event took place, call my startTextAnimation() function". The browser says
// that onload/load happened when the document HTML is fully loaded. The
// startTextAnimation() function needs to run only when HTML is available to be
// worked with. In case the function would try to run sooner, it would likely
// endup with trying to call something on "undefined" - for example for the
// document.function() calls. Such calls would end up with an error and our 
// text animation function would not be scheduled to run. No animations.
window.addEventListener("load", () => {
    startTextAnimation(
        "Hey, welcome to my page!",
        "textholder"
    );
});

// (2) Globally available variables which we will use to keep state of the text
// we are animating. Including: pointer to the string that is being typed out,
// an element that we are typing it out to, how fast should it be typed out, 
// and also whether we are typing forward or back (deleting).
let letterPointer = 0;
let keyStrokeSpeedRange = [100, 200];
let typeForward = true;
let targetElement;
let string;

// (3) Following notation is almost equivalent to the one we use 
// function startTextAnimation(text, targetId) { /* Function contents */}
// 
// It just looks better. There are differences between these two notations
// but it is nothing to be worried about at this point.
//
// The purpose of the function is to set variables defined above to expected
// values and to schedule text animating function.
const startTextAnimation = (text, targetId) => {
    targetElement = document.getElementById(targetId);
    string = text;

    // With delay of 100ms after calling startTextAnimation function, the 
    // animateAndReschedule function is called.
    //
    // We use setTimeout function, to start animateAndReschedule function only
    // once.
    // In contrast to that, the setInterval function with same parameters 
    // exists. That function, however, runs the specified function EVERY X ms
    // (100 in our case, had it been used below). 
    // We want to use setTimeout, because we want to delay each consequent
    // function run by different time. To make it look more like a human is
    // actually typing it.
    setTimeout(animateAndReschedule, 100);
}


// (4) This function is doing the heavy lifting. Split into two branches - or 
// conditions if you wish. One animates when we are typing the string out, the
// other does the deletion part.
const animateAndReschedule = () => {
    // Branch (a) - pointer into the string is less than length of the string 
    // to type out and also the typeForward is set to true (default value).
    if (letterPointer < string.length && typeForward) {
        targetElement.innerText = string.substring(0, letterPointer);
        letterPointer += 1;
        
        // When string pointer is equal to the string length we want to start
        // deleting the string. So we flip the typeForward value to false.
        // Next time the animateAndReschedule function runs, it falls to the
        // (b) branch. 
        if (letterPointer == string.length) {
            typeForward = false;
        }
    } 
    // Branch (b) - This is "the default else" branch that gets executed when
    // we want to delete pieces of the string.
    else {
        targetElement.innerText = string.substring(0, letterPointer);
        letterPointer -= 1;

        // As above - once we reach the first character of the string, we flip
        // the direction in which we are typing the string out.
        if (letterPointer == 0) {
            typeForward = true;
        }
    }

    // (5) Whether we go forward or backward, here we set after how long the 
    // next animateAndReschedule call takes place. To somewhat emulate the user
    // behavior, the delay time is randomized.
    //
    // It is not top notch randomization and it does not account for characters
    // that may be typed out faster by the real user, because they for example
    // are located in different parts of the keyboard and so user can use two
    // hands to type each one, making it slightly faster. Such use cases are
    // not accounted for, but they might be a great exercise for the reader.
    setTimeout(animateAndReschedule, pickNextKeyStrokeSpeed());
}

// (6) Typical (pseudo)random generators give number in range of 0.0 to 1.0 
// with some randomness distribution. Inside the following function, the logic
// to make such numbers pseudorandom integer in interval is wrapped.
// Lower and top boundaries can be updated in `keyStrokeSpeedRange` list above.
// It contains two elements, first one (0-th index) specifying the lower bound,
// second one the other bound.
const pickNextKeyStrokeSpeed = () => {
    return Math.floor(
        Math.random() * (keyStrokeSpeedRange[1] - keyStrokeSpeedRange[0]) + keyStrokeSpeedRange[0]
    );
}