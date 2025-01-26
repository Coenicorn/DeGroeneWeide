async function call() {
    await fetch("http://localhost:3000/api/cards/getAllCards", {
        headers: {
            "x-api-key": "lma"
        }
    });
}

let calls = 0;

while (1) {
    await call();
    console.log(calls++);
}