#ifndef _GAME_H
#define _GAME_H

#include "board.h"

typedef struct _Game Game;

void game_set_prob(Game *game, double prob);
Game *game_create();
void game_delete(Game *game);
bool game_move(Game *game, int x, int y);
bool game_undo(Game *game);
bool game_redo(Game *game);
bool game_brunch(Game *game);
bool game_trunk(Game *game);
void game_free_boards(Game *game);
void game_new(Game *game);
void game_reset(Game *game);
void game_str(Game *game, char *str);
void game_print(Game *game, char *str);

#endif
