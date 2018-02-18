#ifndef _BOARD_H
#define _BOARD_H

#include <stdint.h>
#include <stdbool.h>

typedef struct _Board Board;
typedef struct _ProbTable ProbTable;
typedef ProbTable ***BoardProb;

Board *board_create(double prob);
void board_delete(Board *board);

BoardProb *board_get_prob(Board *board);
void board_can_move(Board *board, BoardProb *bp, double prob, bool **table);
Board *board_move(Board *board, int x, int y, double prob, BoardProb *bp);

void board_get(Board *board, bool **movable, char *str);
void board_set(Board *board, char *str);
void board_print(Board *board, bool **movable);

#endif
