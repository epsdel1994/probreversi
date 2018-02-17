
CFLAGS = -std=c99 -g -O0

all: pbr

board.o: board.h

pbr.o: board.h

pbr: pbr.o board.o

clean:
	rm -rf *.o pbr

.PHONY: all clean
