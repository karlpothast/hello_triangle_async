# install wasm32-unknown-unknown target 
rustup target add wasm32-unknown-unknown
# install devserver
cargo install devserver
# install cargo watch
cargo watch -c -x "build --release"

# build wasm
cargo build --release --target wasm32-unknown-unknown
# run devserver (local http server)
devserver
# run cargo watch (autobuilds wasm and js/html)
cargo watch -c -x "build --release"

## references
## https://rust-tutorials.github.io/triangle-from-scratch/web_stuff/web_gl_with_bare_wasm.html
## https://github.com/kettle11/hello_triangle_wasm_rust
## https://www.tutorialspoint.com/webgl/webgl_drawing_a_triangle.htm
