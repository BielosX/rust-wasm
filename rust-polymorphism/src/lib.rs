trait Figure {
    fn area(&self) -> f32;
}

struct Circle {
    radius: f32
}

struct Rectangle {
    edge: f32
}

impl Figure for Circle {
    fn area(&self) -> f32 {
        std::f32::consts::PI * self.radius.powi(2)
    }
}

impl Figure for Rectangle {
    fn area(&self) -> f32 {
        self.edge.powi(2)
    }
}

static mut FIGURES: Vec<Box<dyn Figure>> = Vec::new();

#[no_mangle]
pub extern "C" fn add_rectangle(edge: f32) {
    unsafe {
        FIGURES.push(Box::new(Rectangle {
            edge
        }));
    }
}

#[no_mangle]
pub extern "C" fn add_circle(radius: f32) {
    unsafe {
        FIGURES.push(Box::new(Circle {
            radius
        }));
    }
}

#[no_mangle]
pub extern "C" fn get_figures_len() -> i32 {
    unsafe {
        FIGURES.len() as i32
    }
}

#[no_mangle]
pub extern "C" fn figure_area_at(index: i32) -> f32 {
    unsafe {
        let idx = index as usize;
        FIGURES[idx].area()
    }
}
