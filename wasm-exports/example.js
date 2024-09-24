const wasm = WebAssembly.instantiateStreaming(fetch("out/example.wasm"), {});

const textValue = document.getElementById("text-value");
const textLength = document.getElementById("text-length");
const charIndex = document.getElementById("char-index");
const helloWorldAddress = 0;

function getTextFromMemory(obj, from, to) {
    const textDecoder = new TextDecoder("utf-8");
    const slice = obj.instance.exports.memory.buffer.slice(from, to);
    return textDecoder.decode(slice);
}

wasm.then((obj) => {
    const len = obj.instance.exports.strLen(helloWorldAddress);
    textLength.innerText = len;
    textValue.innerText = getTextFromMemory(obj, helloWorldAddress, len);
    const func = obj.instance.exports.table.get(1);
    charIndex.innerText = func(helloWorldAddress, 'W'.charCodeAt(0));
});