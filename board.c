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

	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			board->disk[i][j] = false;
		}
	}

	board->disk[3][3] = true;
	board->disk[4][3] = true;
	board->disk[3][4] = true;
	board->disk[4][4] = true;

	board->prob[3][4] = prob;
	board->prob[4][3] = prob;
	board->prob[3][3] = 1 - prob;
	board->prob[4][4] = 1 - prob;

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
	for(int i=0; i<8; i++){ pt->table[i] = malloc(sizeof(double) * 6); }
	return pt; 
}

void pt_delete(ProbTable *pt)
{
	for(int i=0; i<8; i++){ free(pt->table[i]); }
	free(pt->table);
	free(pt->prob);
	free(pt);
}

ProbTable *board_get_probtable(Board *board, int x, int y)
{
	ProbTable *pt = pt_create();

	// calculate probability for each cell

	return pt;
}

BoardProb *board_get_prob(Board *board)
{
	BoardProb *bp = malloc(sizeof(ProbTable*) * 8);
	for(int i=0; i<8; i++){
		bp[i] = malloc(sizeof(ProbTable) * 8);
		for(int j=0; j<8; j++){
			bp[i][j] = board_get_probtable(board, i, j);
		}
	}
	return bp;
}

Board *board_move(Board *board, int x, int y, double prob, BoardProb *bp)
{
	if( (prob * bp[x][y]->prob[0] + (1-prob) * bp[x][y]->prob[1]) <= 0.5){
		return NULL;
	}

	return NULL;
}

