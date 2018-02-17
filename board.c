#include "board.h"

#include <stdio.h>
#include <stdlib.h>

int dx[] = {0, 0, -1, 1, -1, 1, -1, 1};
int dy[] = {-1, 1, 0, 0, -1, 1, 1, -1};

Board *board_create(double prob)
{
	Board *board = malloc(sizeof(Board));
	board->disk = malloc(sizeof(bool*) * 8);
	board->prob = malloc(sizeof(double*) * 8);
	for(int i=0; i<8; i++){
		board->disk[i] = malloc(sizeof(bool) * 8);
		board->prob[i] = malloc(sizeof(double) * 8);
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
	pt->n = malloc(sizeof(int) * 8);
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
	free(pt->n);
	free(pt);
}

ProbTable *board_get_probtable(Board *board, int x, int y, int turn)
{
	ProbTable *pt = pt_create();

	double nprob = 1;
	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			pt->table[i][j] = 0;
			pt->sum[i][j] = 0;
		}

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
		pt->n[i] = j;
		pt->table[i][j] = pr;

		for(int k=j-1; k>0; k++){
			pt->sum[i][k] += pt->table[i][k];
		}
		nprob *= (1 - pt->sum[i][1]);
	}
	pt->prob = (1 - nprob);

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

void board_can_move(BoardProb *bp, double prob, bool **res)
{
	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			if(
				(prob * bp[i][j][0]->prob
				+ (1-prob) * bp[i][j][1]->prob) <= 0.5){
				res[i][j] = false;
			} else {
				res[i][j] = true;
			}
		}
	}
}

Board *board_move(Board *board, int x, int y, double prob, BoardProb *bp)
{
	if( (prob * bp[x][y][0]->prob + (1-prob) * bp[x][y][1]->prob) <= 0.5){
		return NULL;
	}

	Board *a = board_create(0);

	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			a->disk[i][j] = board->disk[i][j];
			a->prob[i][j] = board->prob[i][j];
		}
	}

	// calculate flip

	return a;
}

void board_get(Board *board, char *str)
{
}

void board_set(Board *board, char *str)
{
}

void board_print(Board *board)
{
	printf("\n  *A |B |C |D |E |F |G |H *\n");
	for(int i=0; i<8; i++){
		printf(" %d|", i+1);
		for(int j=0; j<8; j++){
			if(board->disk[i][j] == false){
				printf("--|");
			} else {
				int res = board->prob[i][j] * 100 + 0.5;
				if(res>99){ res=99; }
				if(res<0){ res=0; }
				printf("%02d|", res);
			}
		}
		printf("\n");
	}
	printf("\n");
}

