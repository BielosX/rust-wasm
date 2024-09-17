memory = new WebAssembly.Memory({
    initial: 10,
    maximum: 100,
})
importObject = {
    js: {
        memory
    },
};

const wasm = WebAssembly.instantiateStreaming(fetch("out/example.wasm"),
    importObject);

function getTextFromMemory(from, to) {
    const textDecoder = new TextDecoder("utf-8");
    const slice = memory.buffer.slice(from, to);
    return textDecoder.decode(slice);
}

function addNumbersHandler() {
    const result = document.getElementById("result");
    const first = parseInt(document.getElementById("first").value);
    const second = parseInt(document.getElementById("second").value);
    wasm.then((obj) => {
        result.innerText = obj.instance.exports.add(first, second);
    });
}

function toUpperCase() {
    const textToConvert = document.getElementById("to-upper-text-area").value;
    const result = document.getElementById("to-upper-result");
    const dataView = new DataView(memory.buffer);
    for (let i = 0; i < textToConvert.length; i++) {
        dataView.setUint8(i, textToConvert.charCodeAt(i));
    }
    wasm.then((obj) => {
        obj.instance.exports.toUpper(0, textToConvert.length);
        result.innerText = getTextFromMemory(0, 2000);
    });
}

function handleCounter() {
    const result = document.getElementById("counter-result");
    wasm.then((obj) => {
        obj.instance.exports.incCounter();
        result.innerText = obj.instance.exports.getCounter();
    });
}



function handleCopyText() {
    const result = document.getElementById("copy-text-result");
    wasm.then((obj) => {
        obj.instance.exports.copyStringTo(4000);
        result.innerText = getTextFromMemory(4000, 4050);
    });
}

function handleCleanText() {
    const result = document.getElementById("copy-text-result");
    wasm.then((obj) => {
        obj.instance.exports.memset(4000, 0, 50);
        result.innerText = getTextFromMemory(4000, 4050);
    });
}