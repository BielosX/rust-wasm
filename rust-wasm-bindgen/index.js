import init_wasm, {greet, init} from './pkg/rust_wasm_bindgen.js';

init_wasm().then(() => {
    init();
    greet();
});