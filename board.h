#ifndef _BOARD_H
#define _BOARD_H

#include <stdint.h>
#include <stdbool.h>

typedef struct { bool **disk; double **prob; } Board;
typedef struct { double *prob; double **table; } ProbTable;

Board *board_create(double prob);
void board_delete(Board *board);

ProbTable *board_get_probtable(Board *board, uint8_t x, uint8_t y,
	double prob);
bool board_can_move(ProbTable *pt, double prob);
bool board_move(Board *board, uint8_t x, uint8_t y,
	double prob, ProbTable *pt);

#endif
