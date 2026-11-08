cmake_minimum_required(VERSION 3.16)

project(SolarSystem
    VERSION 1.0
    LANGUAGES C
)

# C-Standard festlegen
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

# Quelldateien
add_executable(SolarSystem
    src/main.c
    src/modules/physik.c
)

# Header-Dateien finden
target_include_directories(SolarSystem PRIVATE
    src/modules
)

# Mathematische Bibliothek einbinden (z. B. für GCC unter Linux)
if(NOT EMSCRIPTEN)
    target_link_libraries(SolarSystem PRIVATE m)
endif()

# Emscripten / WebAssembly
if(EMSCRIPTEN)
    set_target_properties(SolarSystem PROPERTIES
        SUFFIX ".html"
    )

    target_link_options(SolarSystem PRIVATE
        "-sWASM=1"
        "-sALLOW_MEMORY_GROWTH=1"
    )
endif()

