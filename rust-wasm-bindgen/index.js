import init, {greet} from './pkg/rust_wasm_bindgen.js';

init().then(() => {
    greet();
});