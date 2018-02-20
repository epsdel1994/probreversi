/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

#include "game.h"

#include <stdlib.h>
#include <float.h>

struct _Game {
	Board *cur, *hist[60][60];
	bool **movable, turn, isover, turnhist[60][60];
	BoardProb *bp;
	int hist_num, hist_cur[60], hist_max[60];
	double prob;
};

int prob_to_int(double prob)
{
	return (prob + 0.0000000001) * 100;
}

Game *game_create(double prob)
{
	Game *game = malloc(sizeof(Game));
	game->movable = malloc(sizeof(bool*) * 8);
	for(int i=0; i<8; i++){
		game->movable[i] = malloc(sizeof(bool) * 8);
	}
	game_set_prob(game, prob);
	game->bp = NULL;
	game->cur = NULL;
	game_new(game);
	return game;
}

void game_delete(Game *game)
{
	game_free_boards(game);
	free(game);
}

int game_get_prob_next(Game *game)
{
	if(game->isover == false){
		return prob_to_int(game->turn ? game->prob :
			(1 - game->prob));
	} else {
		return -1;
	}
}

double game_get_prob(Game *game)
{
	return game->prob;
}

void game_set_prob(Game *game, double prob)
{
	game->prob = prob;
}

void game_update_probtable(Game *game)
{
	if(game->bp){ bp_delete(game->bp); };
	game->bp = board_get_prob(game->cur);
	board_get_movable(game->cur, game->bp,
		( game->turn ? game->prob : (1 - game->prob)), game->movable);

	game->isover = false;
	if(game_can_move(game) == false){
		game->turn = !(game->turn);
		if(game->bp){ bp_delete(game->bp); };
		game->bp = board_get_prob(game->cur);
		board_get_movable(game->cur, game->bp,
			( game->turn ? game->prob : (1 - game->prob)),
			game->movable);
		if(game_can_move(game) == false){
			game->turn = !(game->turn);
			game->isover = true;
		}
	}
}

void game_update_history(Game *game)
{
	for(int i=game->hist_cur[game->hist_num]+1;
		i<=game->hist_max[game->hist_num]; i++){
		board_delete(game->hist[game->hist_num][i]);
	}

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
	if(game->cur){ board_delete(game->cur); }
	game->cur = board_create(game->prob);
	game->turn = true;
	game_update_history(game);
	game_update_probtable(game);
}

void game_reset(Game *game)
{
	game_free_boards(game);
	game_new(game);
}

bool game_can_move(Game *game)
{
	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			if(game->movable[i][j] == true){
				return true;
			}
		}
	}
	return false;
}

bool game_move(Game *game, int x, int y)
{
	if((x<0) || (x>7) || (y<0) || (y>7)){ return false; }
	if(game->movable[x][y] == false){ return false; }
	game->cur = board_move(game->cur, x, y,
		(game->turn ? game->prob : (1 - game->prob)), game->bp);
	game->turn = !(game->turn);

	game_update_probtable(game);
/*
	if(game_can_move(game) == false){
		game->turn = !(game->turn);
		game_update_probtable(game);
		if(game_can_move(game) == false){
			game->turn = !(game->turn);
		}
	}
*/
	game_update_history(game);
	return true;
}

bool game_can_undo(Game *game)
{
	return game->hist_cur[game->hist_num] != 0;
}

bool game_undo(Game *game)
{
	if(game->hist_cur[game->hist_num] == 0){ return false; }
	game->hist_cur[game->hist_num] -= 1;
	game->cur = game->hist[game->hist_num]
		[game->hist_cur[game->hist_num]];
	game->turn = game->turnhist[game->hist_num]
		[game->hist_cur[game->hist_num]];
	game_update_probtable(game);
	return true;
}

bool game_can_redo(Game *game)
{
	return game->hist_cur[game->hist_num]
		!= game->hist_max[game->hist_num];
}

bool game_redo(Game *game)
{
	if(game->hist_cur[game->hist_num]
		== game->hist_max[game->hist_num]){ return false; }
	game->hist_cur[game->hist_num] += 1;
	game->cur = game->hist[game->hist_num]
		[game->hist_cur[game->hist_num]];
	game->turn = game->turnhist[game->hist_num]
		[game->hist_cur[game->hist_num]];
	game_update_probtable(game);
	return true;
}

bool game_can_branch(Game *game)
{
	return false;
}

bool game_branch(Game *game)
{
	return false;
}

bool game_can_trunk(Game *game)
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
	if(game->isover == false){
		str[128] = 'p';
		sprintf(str+129, "%02d", prob_to_int(game->turn ? game->prob :
			(1 - game->prob)));
	} else {
		sprintf(str+129, "o");
	}
}

void game_print(Game *game, char *str)
{
	board_print(game->cur, game->movable);
	if(game->isover == false){
		printf("Black probability of next disk is [%02d]\n",
			prob_to_int(game->turn ? game->prob :
				(1 - game->prob)));
	} else {
		printf("Game Over\n");
	}
}

int game_count(Game *game)
{
	int black=0, white=0;
	for(int i=0; i<8; i++){
		for(int j=0; j<8; j++){
			if(game->cur->disk[i][j] == true){
				if(game->cur->prob[i][j]>0.5){
					black++;
				} else if(game->cur->prob[i][j]<0.5){
					white++;
				}
			} 
		}
	}
	if(black > white){
		return 64 - white;
	} else if(black < white){
		return black;
	} else {
		return 32;
	}
}

