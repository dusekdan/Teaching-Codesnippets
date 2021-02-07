// (1) První učící moment je tady: Použití window.addEventListener místo
// nastavení <body onload="startTextAnimation()"> v HTML.
//
// Když pracuješ na komplexnějších projektech, kde používáš víc knihoven
// nechceš modifikovat chování jediné sdílené onload funkce (třeba kvůli
// tomu, že někdo jinej to už dělá).
//
// Nastavením attributu HTML tagu na onload říkáš: "v moment co se načte 
// stránka, bude onload funkce nastavená na můj skript". Nezaručíš tím 
// ale, že to někdo z jiné knihovny hned po tom nepřepíše - typicky nechtěně.
//
// Zápis níže v říká: "jakmile prohlížeč řekne, že onload event nastal, pusť
// moji funkci startTextAnimation()". Prohlížeč řekne, že onload event nastal
// v moment co se načte HTML. Ta startTextAnimation() funkce musí začít běhat
// až v moment, co máme HTML, se kterým můžeme pracovat. Kdyby začala běhat
// dříve, než je k dispozici HTML, nějaké z volání `document.funkce()` může
// skončit (a typicky skončí) chybou, protože element document, nebo element
// na který chceš sahat ještě neexistuje. Nic se nespustí a žádnej text se
// nebude hýbat.
window.addEventListener("load", () => {
    startTextAnimation(
        "Hey, welcome to my page!",
        "textholder"
    );
});

// (2) Globálně dostupné proměnné co použijeme k tomu, abychom si drželi 
// aktuální stav textu který vypisujeme, kam ho vypisujeme, jak rychle a taky
// kde zrovna výpisu jsme a jestli vypisujeme směrem dopředu, nebo naopak text
// mažeme.
let letterPointer = 0;
let keyStrokeSpeedRange = [100, 200];
let typeForward = true;
let targetElement;
let string;

// (3) Tenhle zápis je téměř ekvivalentní k zápisu
// function startTextAnimation(text, targetId) { /* Obsah funkce */}
// 
// Jenom to vypadá lépe. Existují odlišnosti mezi těmito dvěma zápisy
// které Tě v tenhle moment nemusí trápit.
//
// Účel funkce je nastavit proměnné definované výše, aby měly správné hodnoty
// a spustit animační funkci, která potom bude řešit samotné vypisování.
const startTextAnimation = (text, targetId) => {
    targetElement = document.getElementById(targetId);
    string = text;

    // Se zpožděním 100 milisekund po zavolání startTextAnimation se spustí
    // funkce animateAndReschedule níže, co vypisuje písmeno po písmenu. 
    // 
    // Je použita setTimeout funkce, která tu animateAndReschedule funkci
    // pustí jen jednou.
    // V kontrastu k tomu existuje ještě funkce setInterval, která se používá
    // úplně stejně, ale pouští určenou funkci každých X (zde 100) milisekund.
    // My ale chceme použít setTimeout, protože chceme každé spuštění funkce
    // udělat po jiném čase, aby to vypadalo víc, že to píše člověk.
    setTimeout(animateAndReschedule, 100);
}


// (4) Tahle funkce je to pomyslné železo co se hýbe. Je rozdělená do dvou 
// větví - jedna pro animaci která text vypisuje a druhá pro tu co text maže.
const animateAndReschedule = () => {
    // Větev (a) - ukazatel do řetězce je menší než celková délka řetězce
    // a zároveň směr animace je "dopředu".
    if (letterPointer < string.length && typeForward) {
        targetElement.innerText = string.substring(0, letterPointer);
        letterPointer += 1;
        
        // V moment, co je ukazatel do řetězce roven délce řetězce (poslední
        // vypsané písmeno bylo poslední písmeno řetězce), chceme začít mazat
        // otočíme hodnotu tedy `typeForward` proměnné, aby při příštím průběhu
        // animateAndReschedule() nebyla podmínka (a) platná a pokračovali jsme
        // do větve (b). 
        if (letterPointer == string.length) {
            typeForward = false;
        }
    } 
    // Větev (b) - Do téhle větve spadneme vždycky, když budeme potřebovat umazat
    // znaky z řetězce, protože jedeme zpátky.
    else {
        targetElement.innerText = string.substring(0, letterPointer);
        letterPointer -= 1;

        // Podobně jako nahoře, v moment, co dojdeme na první písmeno (nultou
        // pozici) v řetězci, otočíme směr psaní a při dalším provedení funkce
        // animateAndReschedule() půjdeme do větve (a) - psát dopředu. 
        if (letterPointer == 0) {
            typeForward = true;
        }
    }

    // (5) Ať jdeme dopředu, nebo dozadu, nastavujeme kdy (za jak dlouho) se má
    // vykonat animateAndReschedule() funkce znovu. Abychom tak trochu emulovali
    // chování uživatele, randomizujeme čas, za jak dlouho se znova vykoná.
    //
    // Není to úplně super náhodné a neřeší to možnost psát rychleji znaky, na 
    // které by uživatel dosáhl rychleji, protože píše např. oběma rukama, nebo
    // protože jsou hned vedle sebe - a tedy by je psal jinými prsty v rychlém
    // sledu.
    setTimeout(animateAndReschedule, pickNextKeyStrokeSpeed());
}

// (6) Klasické generátory (pseudo)náhodných čísel dávají číslo z rozmezí 0.0
// až 1.0 s nějakou distribucí. Uvnitř téhle funkce je zabalená logika, která 
// z takových čísel udělá "náhodné celé číslo v intervalu".
// Interval je vymezen výše jako `keyStrokeSpeedRange` seznam o dvou prvcích.
// Prvek na nulté pozici je spodní hranice, prvek na první je horní hranice.
const pickNextKeyStrokeSpeed = () => {
    return Math.floor(
        Math.random() * (keyStrokeSpeedRange[1] - keyStrokeSpeedRange[0]) + keyStrokeSpeedRange[0]
    );
}