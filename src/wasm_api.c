#include "modules/physik.h"

int get_planet_count(void){
	return planet_count;
}

double get_planet_x(int index, double t){
	if(index <0 || index >= planet_count){
		return 0.0;
	}
	const Planet *planet = &planets[index];
	double M = calculate_middle_anomalie(planet, t);
	double E = calculate_eccentric_anomalie(planet, M);

    	Position pos = calculate_pos(planet, E);

    	return pos.x;
}

double get_planet_y(int index, double t)
{
    if (index < 0 || index >= planet_count)
        return 0.0;

    const Planet *planet = &planets[index];

    double M = calculate_middle_anomalie(planet, t);
    double E = calculate_eccentric_anomalie(planet, M);

    Position pos = calculate_pos(planet, E);

    return pos.y;
}
