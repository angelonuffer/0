
use std::env;
use std::fs;
use std::process;

mod analisador_sintatico;
mod analisador_semantico;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("🚀: ./0 <*.0>");
        process::exit(1);
    }

    let file_path = &args[1];

    let source_code = match fs::read_to_string(file_path) {
        Ok(code) => code,
        Err(_e) => {
            eprintln!("❌ 📄 {}", file_path);
            process::exit(1);
        }
    };

    let ast = match analisador_sintatico::parse(&source_code) {
        Ok(ast) => ast,
        Err(e) => {
            eprintln!("❌ 🧱 {}", e);
            process::exit(1);
        }
    };

    let result = match analisador_semantico::evaluate(ast) {
        Ok(value) => value,
        Err(e) => {
            eprintln!("❌ 💡 {}", e);
            process::exit(1);
        }
    };

    println!("{}", result);
    process::exit(0);
}
