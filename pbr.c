#include "board.h"

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
	bool **movable = malloc(sizeof(bool*) * 8);
	bool **movable2 = malloc(sizeof(bool*) * 8);
	bool **movable3 = malloc(sizeof(bool*) * 8);
	for(int i=0; i<8; i++){ movable[i] = malloc(sizeof(bool) * 8); }
	for(int i=0; i<8; i++){ movable2[i] = malloc(sizeof(bool) * 8); }
	for(int i=0; i<8; i++){ movable3[i] = malloc(sizeof(bool) * 8); }

	Board *b = board_create(0.8);
	BoardProb *bp = board_get_prob(b);
	board_can_move(bp, 0.8, movable);
	board_print(b, movable);

	Board *b2 = board_move(b, 2, 3, 0.8, bp);
	BoardProb *bp2 = board_get_prob(b2);
	board_can_move(bp2, 0.2, movable2);
	board_print(b2, movable2);
	board_delete(b);

	Board *b3 = board_move(b2, 2, 4, 0.2, bp);
	BoardProb *bp3 = board_get_prob(b3);
	board_can_move(bp3, 0.8, movable3);
	board_print(b3, movable3);
	board_delete(b2);

	return 0;
}
