#include <emscripten.h>

#include "board.c"
#include "game.c"

Game *game;

int EMSCRIPTEN_KEEPALIVE ems_setup(double prob)
{
	game = game_create(prob);
	if(game == NULL){
		return 0;
	} else {
		return 1;
	}
}

int EMSCRIPTEN_KEEPALIVE ems_move(int x, int y)
{
	return (game_move(game, y, x) ? 1 : 0);
}

void EMSCRIPTEN_KEEPALIVE ems_get_str(char *str)
{
	game_str(game, str);
}

int EMSCRIPTEN_KEEPALIVE ems_can_undo()
{
	return (game_can_undo(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_can_redo()
{
	return (game_can_redo(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_can_branch()
{
	return (game_can_branch(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_can_trunk()
{
	return (game_can_trunk(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_undo()
{
	return (game_undo(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_redo()
{
	return (game_redo(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_branch()
{
	return (game_branch(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_trunk()
{
	return (game_trunk(game) ? 1 : 0);
}

int EMSCRIPTEN_KEEPALIVE ems_count()
{
	return game_count(game);
}

double EMSCRIPTEN_KEEPALIVE ems_get_prob_base()
{
	return game_get_prob(game);
}

int EMSCRIPTEN_KEEPALIVE ems_get_prob_next()
{
	return game_get_prob_next(game);
}

void EMSCRIPTEN_KEEPALIVE ems_set_prob_base(double prob)
{
	game_set_prob(game, prob);
	game_update_probtable(game);
}

void EMSCRIPTEN_KEEPALIVE ems_new()
{
	game_new(game);
}

