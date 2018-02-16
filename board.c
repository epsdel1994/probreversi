#include "board.h"

#include <stdlib.h>

Board *board_create(double prob)
{
	Board *board = malloc(sizeof(Board));
	board->disk = malloc(sizeof(bool*) * 8);
	board->prob = malloc(sizeof(float*) * 8);
	for(int i=0; i<8; i++){
		board->disk[i] = malloc(sizeof(bool) * 8);
		board->prob[i] = malloc(sizeof(float) * 8);
		for(int j=0; j<8; j++){
			board->disk[i][j] = false;
		}
	}
	return board;
}

void board_delete(Board *board)
{
	for(int i=0; i<8; i++){
		free(board->disk[i]);
		free(board->prob[i]);
	}
	free(board->disk);
	free(board->prob);
	free(board);
}

ProbTable *pt_create()
{
	ProbTable *pt = malloc(sizeof(ProbTable));
	pt->prob = malloc(sizeof(double) * 2);
	pt->table = malloc(sizeof(double*) * 8);
	for(int i=0; i<8; i++){
		pt->table[i] = malloc(sizeof(double) * 6);
	}
	return pt; 
}

void pt_delete(ProbTable *pt)
{
	for(int i=0; i<8; i++){
		free(pt->table[i]);
	}
	free(pt->table);
	free(pt->prob);
	free(pt);
}

ProbTable *board_get_probtable(Board *board, uint8_t x, uint8_t y,
	double prob)
{
	ProbTable *pt = pt_create();
	return pt;
}

bool board_move(Board *board, uint8_t x, uint8_t y,
	double prob, ProbTable *pt)
{
	return false;
}

