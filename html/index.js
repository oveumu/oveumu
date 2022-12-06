let sequence, timeout, boxesEnabled = false, input = [], stage = 0;
const boxes = [...document.getElementsByClassName("box")];
const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];

function sleep(ms){
    return new Promise(r => setTimeout(r, ms));
}

function genSequence(len = 8){
    return new Array(len).fill(0).map(e => ~~(Math.random() * 4));
}

function startupSequence(){
    let seq = [0, 1, 2, 3, 2, 1, 0];
    return displaySequence(seq, colors, 7);
}

function invalidSequence(){
    return Promise.all([
        displayColor(0, "#ff0000"),
        displayColor(1, "#ff0000"),
        displayColor(2, "#ff0000"),
        displayColor(3, "#ff0000"),
    ]);
}

function resetSequence(){
    clearTimeout(timeout);
    boxesEnabled = false;
    input = [];
    stage = 0;
    return invalidSequence()
    .then(() => sleep(2000))
    .then(() => startupSequence())
    .then(() => {
        sequence = genSequence();
        displaySequence();
    })
}

function displaySequence(seq = sequence, col = colors, cStage = stage){
    return new Promise(async resolve => {
        clearTimeout(timeout);
        boxesEnabled = false;
        for(let s of seq.slice(0, cStage+1)){
            await displayColor(s, col[s]);
            await sleep(250);
        }
        timeout = setTimeout(() => resetSequence(), 1000 * 10);
        await sleep(250)
        .then(() => boxesEnabled = true)
        .then(() => resolve());
    });
}

function displayColor(i, color){
    boxes[i].style.backgroundColor = color;
    return sleep(1000)
    .then(() => boxes[i].style.backgroundColor = "transparent");
}

function main(){
    sequence = genSequence();
    startupSequence()
    .then(() => displaySequence());
}

boxes.forEach((box, i) => {
    box.addEventListener("click", e => {
        if(!boxesEnabled)
            return;
        boxesEnabled = false;
        input.push(i);
        for(let j = 0;j < input.length;j++){
            if(sequence[j] !== input[j]){
                return resetSequence();
            }
        }
        displayColor(i, colors[i])
        .then(async () => {
            if(input.length >= stage+1){
                boxesEnabled = false;
                await sleep(500);
                for(let j = 0;j < input.length;j++){
                    if(sequence[j] !== input[j]){
                        return resetSequence();
                    }
                }
                stage++;
                if(stage+1 == sequence.length){
                    document.body.innerHTML = "";
                    clearTimeout(timeout);
                    return alert("lmao, nerd");
                }
                boxesEnabled = true;
                input = [];
                displaySequence();
            }
            else {
                await sleep(250)
                .then(() => boxesEnabled = true);
            }
        });
    });
});

sleep(1000)
.then(() => main());
