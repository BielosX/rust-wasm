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
        const textDecoder = new TextDecoder("utf-8");
        obj.instance.exports.toUpper(0, textToConvert.length);
        result.innerText = textDecoder.decode(memory.buffer);
    })
}