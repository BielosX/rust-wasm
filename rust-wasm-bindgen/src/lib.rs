mod utils;

use std::mem;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use web_sys::wasm_bindgen::JsCast;
use web_sys::{Document, FormData, HtmlFormElement, SubmitEvent};

trait Speak {
    fn speak(&self) -> String;
}

struct Cat {
    age: u32,
    name: String,
}

struct Dog {
    age: u32,
    name: String,
}

impl Speak for Cat {
    fn speak(&self) -> String {
        format!("MEOW! Name: {}, Age: {}\n", self.name, self.age)
    }
}

impl Speak for Dog {
    fn speak(&self) -> String {
        format!("BARK! Name: {}, Age: {}\n", self.name, self.age)
    }
}

/*
    https://doc.rust-lang.org/std/keyword.dyn.html

    A dyn Trait reference contains two pointers. One pointer goes to the data (e.g., an instance of a struct).
    Another pointer goes to a map of method call names to function pointers (known as a virtual method table or vtable).

    Box<dyn T> is essentially equivalent to (*mut {data}, *mut {vtable})
 */
static mut ANIMALS: Vec<Box<dyn Speak>> = Vec::new();

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

fn add_animal(name: &String, age: &String, animal_type: &String) {
    match animal_type.as_str() {
        "cat" => unsafe {
            ANIMALS.push(Box::new(Cat {
                name: name.clone(),
                age: age.parse::<u32>().unwrap(),
            }));
        },
        "dog" => unsafe {
            ANIMALS.push(Box::new(Dog {
                name: name.clone(),
                age: age.parse::<u32>().unwrap(),
            }));
        },
        _ => {}
    }
}

unsafe fn describe_animals() -> String {
    let mut result = String::new();
    ANIMALS
        .iter()
        .for_each(|item| {
            let (pointer, vtable) = mem::transmute_copy::<Box<_>, (*const u8, *const usize)>(item);
            log(format!("pointer: {}, vtable: {}", pointer as u32, vtable as u32).as_str());
            result.push_str(item.speak().as_str())
        });
    result
}

unsafe fn handle_submit_event(
    document: &Document,
    html_element: &HtmlFormElement,
    event: SubmitEvent,
) {
    let form_data = FormData::new_with_form(html_element).unwrap();
    let name = form_data.get("animal-name").as_string().unwrap();
    let age = form_data.get("animal-age").as_string().unwrap();
    let animal_type = form_data.get("animal-type").as_string().unwrap();
    add_animal(&name, &age, &animal_type);
    let age_element = document.get_element_by_id("animal-count").unwrap();
    let speak_element = document.get_element_by_id("animal-speak").unwrap();
    age_element.set_text_content(Some(ANIMALS.len().to_string().as_str()));
    let animals = describe_animals();
    speak_element.set_text_content(Some(animals.as_str()));
    event.prevent_default();
}

unsafe fn setup_animal_form(document: &Document) {
    let doc = document.clone();
    let form = document
        .get_element_by_id("animal-form")
        .expect("animal-form should be available");
    let form_html_element = form.dyn_ref::<HtmlFormElement>().unwrap().clone();
    let callback = Closure::<dyn FnMut(_)>::new(move |event| {
        handle_submit_event(&doc, &form_html_element, event);
    });
    form.add_event_listener_with_callback("submit", callback.as_ref().unchecked_ref())
        .expect("Submit callback should be added");
    callback.forget();
}

#[wasm_bindgen]
pub fn init() {
    utils::set_panic_hook();
    let window = web_sys::window().expect("Window should be available");
    let document = window.document().expect("Document should be available");

    unsafe {
        setup_animal_form(&document);
    }
}

#[wasm_bindgen]
pub fn greet() {
    log("Hello, wasm-bindgen!");
}

#[derive(Serialize, Deserialize, Debug)]
struct Person {
    age: u32,
    country: String,
    name: String,
}

/*
   https://rustwasm.github.io/wasm-bindgen/contributing/design/js-objects-in-rust.html
   One of the main goals of wasm-bindgen is to allow working with and passing around JS objects in wasm,
   but that's not allowed today!
*/
#[wasm_bindgen]
pub fn describe_person(person: &str) -> String {
    log(person);
    let decoded: Person = serde_json::from_str(person).expect("Person expected");
    format!(
        "Hello, my name is {}, i'm {} years old and i'm from {}",
        decoded.name, decoded.age, decoded.country
    )
}
