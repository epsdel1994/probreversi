/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

#ifndef _GAME_H
#define _GAME_H

#include "board.h"

typedef struct _Game Game;

void game_set_prob(Game *game, double prob);
Game *game_create();
void game_delete(Game *game);
bool game_move(Game *game, int x, int y);
bool game_undo(Game *game);
bool game_can_undo(Game *game);
bool game_can_redo(Game *game);
bool game_redo(Game *game);
bool game_branch(Game *game);
bool game_trunk(Game *game);
void game_update_history(Game *game);
void game_free_boards(Game *game);
void game_new(Game *game);
void game_reset(Game *game);
void game_str(Game *game, char *str);
void game_print(Game *game, char *str);
bool game_can_move(Game *game);
void game_set_prob(Game *game, double prob);
double game_get_prob(Game *game);
int game_get_prob_next(Game *game);
int game_count(Game *game);

#endif
