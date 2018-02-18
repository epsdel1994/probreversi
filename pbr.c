#include "board.c"
#include "game.c"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv)
{
	Game *game = game_create(0.8);
	game_print(game, NULL);
	printf("\n> ");

	char buf[8];
	while(1){
		gets(buf);
		if(!strcmp(buf, "exit"))exit(0);
		if(game_move(game, buf[1]-'1', buf[0]-'a') == false){
			printf("illegal move.\n");
		}
		game_print(game, NULL);
		printf("\n> ");
	}
	return 0;
}
