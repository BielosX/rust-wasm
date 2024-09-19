memory = new WebAssembly.Memory({
    initial: 100,
    maximum: 1000,
})
importObject = {
    env: {
        memory
    },
};

const wasmFile = "target/wasm32-unknown-unknown/release/pure_rust.wasm"
const wasm = WebAssembly.instantiateStreaming(fetch(wasmFile), importObject);

function getTextFromMemory(from, to) {
    const textDecoder = new TextDecoder("utf-8");
    const slice = memory.buffer.slice(from, to);
    return textDecoder.decode(slice);
}

function addNumbersHandler() {
    const firstNumber = parseInt(document.getElementById("first-number").value);
    const secondNumber = parseInt(document.getElementById("second-number").value);
    const result = document.getElementById("add-numbers-result");
    wasm.then((obj) => {
        result.innerText = obj.instance.exports.add(firstNumber, secondNumber);
    });
}

function toLowerCase() {
    const textToConvert = document.getElementById("to-lower-text-area").value;
    const result = document.getElementById("to-lower-result");
    const dataView = new DataView(memory.buffer);
    const offset = 10000;
    for (let i = 0; i < textToConvert.length; i++) {
        dataView.setUint8(i + offset, textToConvert.charCodeAt(i));
    }
    wasm.then((obj) => {
        obj.instance.exports.to_lower(offset, textToConvert.length);
        result.innerText = getTextFromMemory(offset, offset + 100);
    });
}

function concatUserName() {
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const result = document.getElementById("concat-user-name");
    const json = JSON.stringify({
        firstName,
        lastName,
    });
    const dataView = new DataView(memory.buffer);
    const offset = 15000;
    for (let i = 0; i < json.length; i++) {
        dataView.setUint8(offset + i, json.charCodeAt(i));
    }
    wasm.then((obj) => {
        [from, to] = obj.instance.exports.user_stringify(offset, json.length);
        console.log(`from ${from} to ${to}`);
        result.innerText = getTextFromMemory(from, to);
    });
}