use serde::{Deserialize, Serialize};
use std::slice::from_raw_parts;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct User {
    first_name: String,
    last_name: String,
}

#[no_mangle]
pub extern "C" fn add(first: i32, second: i32) -> i32 {
    first + second
}

#[no_mangle]
pub extern "C" fn to_lower(offset: i32, length: i32) {
    unsafe {
        let ptr: *mut u8 = offset as *mut u8;
        for n in 0..length {
            let address = ptr.add(n as usize);
            if *address >= 0x41 && *address <= 0x5A {
                *address = *address | 0b00100000;
            }
        }
    }
}

#[no_mangle]
pub extern "C" fn user_stringify(offset: i32, length: i32) -> (i32, i32) {
    unsafe {
        let len = length as usize;
        let ptr = offset as *mut u8;
        let json = from_raw_parts(ptr, len);
        let user: User = serde_json::from_slice(json).unwrap();
        let result = String::from(format!("{} {}", user.first_name, user.last_name));
        let result_offset = 20000;
        let result_ptr = result_offset as *mut u8;
        let bytes = result.into_bytes();
        let bytes_len = bytes.len();
        for n in 0..bytes_len {
            *(result_ptr.add(n)) = bytes[n];
        }
        (result_ptr as i32, (result_ptr.add(bytes_len)) as i32)
    }
}
