(module
    (func $add (param $lhs i32) (param $rhs i32) (result i32)
        local.get $lhs
        local.get $rhs
        ;; The return value of a function is just the final value left on the stack.
        i32.add)
    (export "add" (func $add))
)