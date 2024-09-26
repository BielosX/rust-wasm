import init_wasm, {greet, init} from './pkg/rust_wasm_bindgen.js';

let state;

init_wasm().then(() => {
    init();
    greet();
});