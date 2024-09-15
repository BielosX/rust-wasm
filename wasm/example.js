function loadWasm() {
    return WebAssembly.instantiateStreaming(fetch("out/example.wasm"));
}

function clickHandler() {
    const result = document.getElementById("result");
    const first = parseInt(document.getElementById("first").value);
    const second = parseInt(document.getElementById("second").value);
    loadWasm().then((obj) => {
        result.innerText = obj.instance.exports.add(first, second);
    });
}
