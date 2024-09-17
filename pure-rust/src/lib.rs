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
