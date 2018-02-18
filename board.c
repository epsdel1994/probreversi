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

		double pr = 1.0; int j, lx=x, ly=y;
		for(j=0; j<7; j++){
			lx += dx[i]; ly += dy[i];
			if((lx<0) || (lx>7) || (ly<0) || (ly>7)
				|| (board->disk[lx][ly] == false)){
				break;
			}
			if(turn){
				pt->table[i][j] = pr * board->prob[lx][ly];
				pr *= (1-board->prob[lx][ly]);
			} else {
				pt->table[i][j] = pr * (1-board->prob[lx][ly]);
				pr *= board->prob[lx][ly];
			}
		}
		pt->n[i] = j;
		pt->table[i][j] = pr;

		for(int k=j-1; k>=0; k--){
			pt->sum[i][k] += pt->table[i][k];
		}
		nprob *= (1 - pt->sum[i][1]);
	}
	pt->prob = (1 - nprob);

	return pt;
}

BoardProb *board_get_prob(Board *board)
{
	BoardProb *bp = malloc(sizeof(ProbTable***) * 8);
	for(int i=0; i<8; i++){
		bp[i] = malloc(sizeof(ProbTable**) * 8);
		for(int j=0; j<8; j++){
			bp[i][j] = malloc(sizeof(ProbTable*) * 2);
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
			res[i][j] = (prob * bp[i][j][0]->prob
				+ (1-prob) * bp[i][j][1]->prob > 0.5);
		}
	}
}

Board *board_move(Board *board, int x, int y, double prob, BoardProb *bp)
{
	if( (prob * bp[x][y][0]->prob + (1-prob) * bp[x][y][1]->prob) <= 0.5){
		return NULL;
	}

	Board *r = board_create(0);
	Board *a1 = board_create(0);
	Board *a2 = board_create(0);
	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			r->disk[i][j] = board->disk[i][j];
			a1->disk[i][j] = board->disk[i][j];
			a1->prob[i][j] = board->prob[i][j];
			a2->disk[i][j] = board->disk[i][j];
			a2->prob[i][j] = board->prob[i][j];
		}
	}

	r->disk[x][y] = true;
	a1->disk[x][y] = true;
	a2->disk[x][y] = true;
	a1->prob[x][y] = 1.0;
	a2->prob[x][y] = 0.0;

	for(int i=0; i<8; i++){
		double C1, C2;
		if(bp[x][y][0]->n[i]>1){
			double P1 = bp[x][y][0]->sum[i][1] / bp[x][y][0]->prob;
			double P2 = 1 - P1;
			C1 = P1 / bp[x][y][0]->sum[i][1];
			C2 = P2 / (1 - bp[x][y][0]->sum[i][1]);
		} else {
			continue;
		}

		int lx=x, ly=y;

		lx += dx[i]; ly += dy[i];
		a1->prob[lx][ly]
			= C2 * 1 * bp[x][y][0]->table[i][0]
			+ C1 * 1 * bp[x][y][0]->sum[i][1];

		for(int j=1; j<bp[x][y][0]->n[i]; j++){
			lx += dx[i]; ly += dy[i];
			a1->prob[lx][ly]
				= C2 * a1->prob[lx][ly]
					* bp[x][y][0]->table[i][j]
				+ C1 * 1 * bp[x][y][0]->sum[i][j];
		}
	}

	for(int i=0; i<8; i++){
		double C1, C2;
		if(bp[x][y][1]->n[i]>1){
			double P1 = bp[x][y][1]->sum[i][1] / bp[x][y][1]->prob;
			double P2 = 1 - P1;
			C1 = P1 / bp[x][y][1]->sum[i][1];
			C2 = P2 / (1 - bp[x][y][1]->sum[i][1]);
		} else {
			continue;
		}

		int lx=x, ly=y;

		lx += dx[i]; ly += dy[i];
		a2->prob[lx][ly]
			= C2 * 0 * bp[x][y][1]->table[i][0]
			+ C1 * 0 * bp[x][y][1]->sum[i][1]
			+ C2 * 1 * bp[x][y][1]->table[i][
				bp[x][y][1]->n[i]];

		for(int j=1; j<bp[x][y][1]->n[i]; j++){
			lx += dx[i]; ly += dy[i];
			a2->prob[lx][ly]
				= C2 * a1->prob[lx][ly]
					* bp[x][y][1]->table[i][j]
				+ C1 * 0 * bp[x][y][1]->sum[i][j]
				+ C2 * 1 * bp[x][y][1]->table[i][
					bp[x][y][1]->n[i]];
		}
	}

	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			r->prob[i][j] = prob * a1->prob[i][j]
				+ (1 - prob) * a2->prob[i][j];
		}
	}

	board_delete(a1);
	board_delete(a2);

	return r;
}

void board_get(Board *board, char *str)
{
	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			if(board->disk[i][j] == false){
				printf("--");
			} else {
				int res = board->prob[i][j] * 100 + 0.5;
				if(res>99){ res = 99; }
				if(res<0){ res = 0; }
				printf("%02d", res);
			}
		}
	}
}

void board_set(Board *board, char *str)
{
}

void board_print(Board *board, bool **movable)
{
	printf("\n  *A |B |C |D |E |F |G |H *\n");
	for(int i=0; i<8; i++){
		printf(" %d|", i+1);
		for(int j=0; j<8; j++){
			if(board->disk[i][j] == false){
				if(movable[i][j] == false){
					printf("--|");
				} else {
					printf("[]|");
				}
			} else {
				int res = board->prob[i][j] * 100 + 0.5;
				if(res>99){ res = 99; }
				if(res<0){ res = 0; }
				printf("%02d|", res);
			}
		}
		printf("\n");
	}
	printf("\n");
}

