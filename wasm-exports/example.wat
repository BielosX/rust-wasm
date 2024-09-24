(module
    (memory $memory 2) ;; memory with 2 pages allocated (64kb each)
    (table $table 4 funcref) ;; function reference table with 4 entries
    (data (i32.const 0) "Hello World\00") ;; \00 encodes 0x00 ascii
    (elem (i32.const 0) $strLen $charIndex) ;; save strLen and charIndex references in table
    (func $charIndex (param $addr i32) (param $char i32) (result i32)
        (local $index i32)
        (local.set $index (i32.const -1))
        (loop $countLen
            i32.const 1
            local.get $index
            i32.add
            local.set $index

            local.get $addr
            local.get $index
            i32.add
            i32.load8_u
            local.get $char
            i32.ne
            br_if $countLen
        )
        local.get $index
    )
    (func $strLen (param $addr i32) (result i32)
        local.get $addr
        i32.const 0
        call $charIndex
    )
    (export "strLen" (func $strLen))
    (export "charIndex" (func $charIndex))
    (export "memory" (memory $memory))
    (export "table" (table $table))
)