/* generates battery percentage lookup table */ 

const table = [
	420, 415, 411, 408, 402, 398, 395, 391, 387, 385, 384, 382, 380, 379, 377, 375, 373, 371, 369, 361, 327
];

function findClosest(val) {
    let c = 0;
    for (let i = table.length - 1; i >= 0; i--) {
        let t = table[i];
        let tt = table[c];

        let d = Math.abs(val - t);
        let dd = Math.abs(val - tt);
        if (d < dd) {
            c = i;
        }
    }
    return 100- c * 5;
}

let final = "";
let num = 0;

for (let i = 327; i < 420; i += 1) {
    final += (findClosest(i) + ", ");
    let t = findClosest(i);
    let c = "";
    for (let j = 0; j < t; j++) c += "*";
    console.log(c);
    num++;
}
console.log(final);
console.log(num);