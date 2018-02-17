#include "board.h"

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
	bool **movable = malloc(sizeof(bool*) * 8);
	for(int i=0; i<8; i++){ movable[i] = malloc(sizeof(bool) * 8); }
	Board *b = board_create(0.8);
	BoardProb *bp = board_get_prob(b);
	board_can_move(bp, 0.8, movable);
	board_print(b, movable);
	board_delete(b);
	return 0;
}
