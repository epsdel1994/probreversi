#ifndef _BOARD_H
#define _BOARD_H

#include <stdint.h>
#include <stdbool.h>

typedef struct { bool **disk; double **prob; } Board;
typedef struct { double prob; double **table; double **sum; } ProbTable;
typedef ProbTable ***BoardProb;

Board *board_create(double prob);
void board_delete(Board *board);

BoardProb *board_get_prob(Board *board);
bool board_can_move(ProbTable *pt, double prob);
Board *board_move(Board *board, int x, int y, double prob, BoardProb *bp);

#endif
