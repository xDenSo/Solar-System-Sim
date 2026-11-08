#include <stdio.h>
#include "modules/physik.h"
#include <unistd.h>

int main(void){
	double M,E,t, dt;
	t = 0.0;
	Planet *merkur = &planets[0];
	while(1){
		M = calculate_middle_anomalie(merkur, t);
		E = calculate_eccentric_anomalie(merkur, M);
		calculate_pos(merkur, E);
		

		t += 0.01;
		sleep(2);
	}
	return 0;
}
