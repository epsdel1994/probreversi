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
	return 0;
}

void EMSCRIPTEN_KEEPALIVE ems_get_str(char *str)
{
	game_str(game, str);
}

int EMSCRIPTEN_KEEPALIVE ems_can_undo()
{
	return 0;
}

int EMSCRIPTEN_KEEPALIVE ems_can_redo()
{
	return 0;
}
