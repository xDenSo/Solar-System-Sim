CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2
LDLIBS = -lm

TARGET = SolarSystem

SRC = src/main.c \
      src/modules/physik.c

OBJ = $(SRC:src/%.c=build/%.o)

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(OBJ) -o $@ $(LDLIBS)

build/%.o: src/%.c
	mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -Isrc/modules -c $< -o $@

clean:
	rm -rf build $(TARGET)

.PHONY: all clean
EMCC = emcc

WASM_SRC = src/modules/physik.c src/wasm_api.c

wasm:
	mkdir -p web
	$(EMCC) -O2 -Isrc/modules $(WASM_SRC) \
		--no-entry \
		-sMODULARIZE=1 \
		-sEXPORT_NAME=SolarSystemModule \
		-sEXPORTED_FUNCTIONS='["_get_planet_count","_get_planet_x","_get_planet_y"]' \
		-sEXPORTED_RUNTIME_METHODS='["ccall"]' \
		-o web/physics.js

.PHONY: wasm
