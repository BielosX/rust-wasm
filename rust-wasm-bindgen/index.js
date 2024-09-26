import init_wasm, {describe_person, greet, init} from './pkg/rust_wasm_bindgen.js';

let wasm = init_wasm();

wasm.then(() => {
    init();
    greet();
});

window.handleDescribePerson = () => {
    let personName = document.getElementById("person-name").value;
    let personAge = parseInt(document.getElementById("person-age").value);
    let personCountry = document.getElementById("person-country").value;
    let result = document.getElementById("person-describe-result");
    let personJson = JSON.stringify({
        age: personAge,
        name: personName,
        country: personCountry,
    });
    console.log(personJson);
    result.innerText = describe_person(personJson);
}