#include "board.h"

int main(int argc, char **argv)
{
	Board *b = board_create(0.8);
	board_print(b);
	board_delete(b);
	return 0;
}
