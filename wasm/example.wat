(module
    (import "js" "table" (table 4 funcref))
    (import "js" "memory" (memory 1))
    (import "js" "onWasmLoad" (func $onWasmLoad (param i32) (param i32)))
    (global $counter (mut i32) (i32.const 0))
    (data (i32.const 2000) "Hello World")
    (data (i32.const 2011) "WebAssembly initialized")
    (elem (i32.const 0) $add $sub $mul)
    (start $start)
    (func $start
        i32.const 2011 ;; init string address
        i32.const 23 ;; init string length
        call $onWasmLoad
    )
    (func (export "copyStringTo") (param $offset i32)
        local.get $offset
        i32.const 2000 ;; Hello World address
        i32.const 11 ;; Hello World length
        memory.copy
    )
    (func (export "memset") (param $offset i32) (param $value i32) (param $bytes i32)
        local.get $offset
        local.get $value
        local.get $bytes
        memory.fill
    )
    (func (export "getCounter") (result i32)
        global.get $counter
    )
    (func (export "incCounter")
        global.get $counter
        i32.const 1
        i32.add
        global.set $counter
    )
    (func $add (param $lhs i32) (param $rhs i32) (result i32)
        local.get $lhs
        local.get $rhs
        ;; The return value of a function is just the final value left on the stack.
        i32.add)
    (export "add" (func $add))
    (func $sub (param $lhs i32) (param $rhs i32) (result i32)
        local.get $lhs
        local.get $rhs
        i32.sub
    )
    (func $mul (param $lhs i32) (param $rhs i32) (result i32)
        local.get $lhs
        local.get $rhs
        i32.mul
    )
    (type $calculate_value (func (param i32) (param i32) (result i32)))
    (func $calculate (param $index i32) (param $lhs i32) (param $rhs i32) (result i32)
        local.get $lhs
        local.get $rhs
        local.get $index
        call_indirect (type $calculate_value)
    )
    (export "calculate" (func $calculate))
    (func $isLetter (param $arg i32) (result i32)
        (local $result i32)
        (local.set $result (i32.const 0))
        (block $checkIfLetter
            local.get $arg
            i32.const 0x41
            i32.lt_u
            br_if $checkIfLetter

            local.get $arg
            i32.const 0x7A
            i32.gt_u
            br_if $checkIfLetter

            local.get $arg
            i32.const 0x5A
            i32.gt_u
            local.get $arg
            i32.const 0x61
            i32.lt_u
            i32.and
            br_if $checkIfLetter

            (local.set $result (i32.const 1))
        )
        local.get $result
    )
    (func $toUpper (param $offset i32) (param $length i32)
        (local $counter i32)
        (local $address i32)
        (local $char i32)
        (local.set $counter (i32.const 0))
        (local.set $address (i32.const 0))
        (loop $func_loop
            local.get $offset
            local.get $counter
            i32.add
            local.set $address

            (block $charToUpper
                local.get $address
                i32.load8_u
                local.tee $char ;; Loaded value stored in $char and kept on stack
                call $isLetter
                i32.const 0x01
                i32.xor
                br_if $charToUpper

                local.get $address
                local.get $char
                i32.const 0xDF
                i32.and
                i32.store8
            )

            local.get $counter
            i32.const 1
            i32.add
            local.set $counter

            local.get $counter
            local.get $length
            i32.lt_s
            br_if $func_loop
        )
    )
    (export "toUpper" (func $toUpper))
)