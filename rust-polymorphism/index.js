
const wasmFile = "target/wasm32-unknown-unknown/release/rust_polymorphism.wasm"
const wasm = WebAssembly.instantiateStreaming(fetch(wasmFile), {});

wasm.then((obj) => {
    const tableSize = document.getElementById("wasm-table-size");
    tableSize.innerText = `WASM Table Size: ${obj.instance.exports.__indirect_function_table.length}`;
});

function getFiguresAreas() {
    const result = document.getElementById("figure-areas");
    wasm.then((obj) => {
        const length = obj.instance.exports.get_figures_len();
        let str = "";
        for(let idx = 0; idx < length; idx++) {
            str = str.concat('\n', obj.instance.exports.figure_area_at(idx));
        }
        result.innerText = str;
    });
}

function addCircle() {
    const radius = parseFloat(document.getElementById("circle-radius").value);
    wasm.then((obj) => {
        obj.instance.exports.add_circle(radius);
        getFiguresAreas();
    });
}

function addRectangle() {
    const edge = parseFloat(document.getElementById("rectangle-edge").value);
    wasm.then((obj) => {
        obj.instance.exports.add_rectangle(edge);
        getFiguresAreas();
    });
}