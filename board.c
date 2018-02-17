#include "board.h"

#include <stdlib.h>

int dx[] = {0, 0, -1, 1, -1, 1, -1, 1};
int dy[] = {-1, 1, 0, 0, -1, 1, 1, -1};

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
	pt->table = malloc(sizeof(double*) * 8);
	pt->sum = malloc(sizeof(double*) * 8);
	for(int i=0; i<8; i++){
		pt->table[i] = malloc(sizeof(double) * 8);
		pt->sum[i] = malloc(sizeof(double) * 8);
	}
	return pt; 
}

void pt_delete(ProbTable *pt)
{
	for(int i=0; i<8; i++){
		free(pt->table[i]);
		free(pt->sum[i]);
	}
	free(pt->table);
	free(pt->sum);
	free(pt);
}

ProbTable *board_get_probtable(Board *board, int x, int y, int turn)
{
	ProbTable *pt = pt_create();

	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){ pt->table[i][j] = 0; }

		double pr = 1.0; int j;
		for(j=0; j<7; j++){
			x += dx[j]; y += dy[j];
			if((x<0) || (x>7) || (y<0) || (y>7)
				|| (board->disk[x][y] == false)){
				break;
			}
			if(turn){
				pt->table[i][j] = pr * board->prob[x][y];
				pr *= (1-board->prob[x][y]);
			} else {
				pt->table[i][j] = pr * (1-board->prob[x][y]);
				pr *= board->prob[x][y];
			}
		}
		pt->table[i][j] = pr;

		pt->sum[i][j] = 0;
		for(int k=j-1; k>0; k++){
			pt->sum[i][k] += pt->table[i][k];
		}
	}
	return pt;
}

BoardProb *board_get_prob(Board *board)
{
	BoardProb *bp = malloc(sizeof(ProbTable*) * 8);
	for(int i=0; i<8; i++){
		bp[i] = malloc(sizeof(ProbTable) * 8);
		for(int j=0; j<8; j++){
			bp[i][j][0] = board_get_probtable(board, i, j, true);
			bp[i][j][1] = board_get_probtable(board, i, j, false);
		}
	}
	return bp;
}

Board *board_move(Board *board, int x, int y, double prob, BoardProb *bp)
{
	if( (prob * bp[x][y][0]->prob + (1-prob) * bp[x][y][1]->prob) <= 0.5){
		return NULL;
	}

	return NULL;
}

