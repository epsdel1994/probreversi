#include "board.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv)
{
	double turnprob[] = {0.8, 0.2};
	int turn = 0;
	Board *cur = board_create(0.8);
	bool **movable = malloc(sizeof(bool*) * 8);
	for(int i=0; i<8; i++){ movable[i] = malloc(sizeof(bool) * 8); }
	char buf[8];
	while(1){
		BoardProb *bp = board_get_prob(cur);
		board_can_move(bp, turnprob[turn], movable);
		board_print(cur, movable);
		printf("\n> ");

		gets(buf);
		if(!strcmp(buf, "exit")){ exit(0); }
		int y = buf[0] - 'a';
		int x = buf[1] - '1';

		if((x<0) || (x>7) || (y<0) || (y>7)){ continue; }
		if(movable[x][y] == false){ continue; }
		Board *b2 = board_move(cur, x, y, turnprob[turn], bp);
		board_delete(cur); cur = b2;
		turn ^= 0x01;
	}
	return 0;
}
