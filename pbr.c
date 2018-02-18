#include "board.c"
#include "game.c"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv)
{
	Game *game = game_create(0.8);

	char buf[8];
	while(1){
		game_print(game, NULL);
		printf("\n> ");
		gets(buf);
		if(!strcmp(buf, "exit")){ exit(0); }
		if(!strcmp(buf, "new")){
			game_new(game);
			continue;
		}
		if(!strcmp(buf, "undo")){
			if(game_undo(game) == false){
				printf("cannot undo.\n");
			}
			continue;
		}
		if(!strcmp(buf, "redo")){
			if(game_redo(game) == false){
				printf("cannot redo.\n");
			}
			continue;
		}
		if(game_move(game, buf[1]-'1', buf[0]-'a') == false){
			printf("illegal move.\n");
		}
	}
	return 0;
}
