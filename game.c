#include "game.h"

struct _Game {
	Board *cur, *hist[60][60];
	bool **movable, turn, turnhist[60][60];
	BoardProb *bp;
	int hist_num, hist_cur[60], hist_max[60];
	double prob;
};

Game *game_create(double prob)
{
	Game *game = malloc(sizeof(Game));
	game->movable = malloc(sizeof(bool*) * 8);
	for(int i=0; i<8; i++){
		game->movable[i] = malloc(sizeof(bool) * 8);
	}
	game_set_prob(game, prob);
	game_new(game);
	return game;
}

void game_delete(Game *game)
{
	game_free_boards(game);
	free(game);
}

void game_set_prob(Game *game, double prob)
{
	game->prob = prob;
}

void game_reset_prob(Game *game)
{
	game->bp = board_get_prob(game->cur);
	board_can_move(game->cur, game->bp,
		( game->turn ? game->prob : (1 - game->prob)), game->movable);
}

void game_set_board(Game *game, Board *board)
{
	game->cur = board;
	game->turn = !(game->turn);
	game->hist_cur[game->hist_num] += 1;
	game->hist_max[game->hist_num] = game->hist_cur[game->hist_num];
	game->hist[game->hist_num]
		[game->hist_cur[game->hist_num]] = game->cur;
	game->turnhist[game->hist_num]
		[game->hist_cur[game->hist_num]] = game->turn;
}

void game_free_boards(Game *game)
{
	for(int i=0; i<game->hist_num; i++){
		for(int j=0; j<game->hist_max[i]; j++){
			board_delete(game->hist[i][j]);
		}
	}
}

void game_new(Game *game)
{
	game->hist_num = 0;
	game->hist_cur[0] = -1;
	game->hist_max[0] = -1;
	game->turn = false;
	game_set_board(game, board_create(game->prob));
	game_reset_prob(game);
}

void game_reset(Game *game)
{
	game_free_boards(game);
	game_new(game);
}

bool game_move(Game *game, int x, int y)
{
	if((x<0) || (x>7) || (y<0) || (y>7)){ return false; }
	if(game->movable[x][y] == false){ return false; }
	game_set_board(game, board_move( game->cur, x, y,
		(game->turn ? game->prob : (1 - game->prob)), game->bp));
	game_reset_prob(game);
	return true;
}

bool game_undo(Game *game)
{
	return false;
}

bool game_redo(Game *game)
{
	return false;
}

bool game_brunch(Game *game)
{
	return false;
}

bool game_trunk(Game *game)
{
	return false;
}

void game_str(Game *game, char *str)
{
	board_get(game->cur, game->movable, str);
	str[128] = 'p';
	sprintf(str+129, "%02d", (int)((game->turn ? game->prob :
		(1 - game->prob)) * 100 + 0.5));
	
}

void game_print(Game *game, char *str)
{
	board_print(game->cur, game->movable);
	printf("Black probability of next disk is [%02d]",
		(int)((game->turn ? game->prob :
			(1 - game->prob)) * 100 + 0.5));
}

