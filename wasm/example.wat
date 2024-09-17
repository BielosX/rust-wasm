(module
    (import "js" "memory" (memory 1))
    (global $counter (mut i32) (i32.const 0))
    (data (i32.const 2000) "Hello World")
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

            (block $character
                local.get $address
                i32.load8_u
                local.tee $char
                i32.const 0x61
                i32.lt_u
                br_if $character

                local.get $char
                i32.const 0x7A
                i32.gt_u
                br_if $character

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