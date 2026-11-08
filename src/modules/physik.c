#include "physik.h"
#include <math.h>

double t = 0.0;

Planet planets[] = {
	{"Merkur", 0.387, 0.206, 0.2408, 0.0},
	{"Venus", 0.723, 0.007, 0,6152, 0.0},
	{"Erde", 1.0000, 0.017, 1.0000, 0.0},
	{"Mars", 1.524, 0.093, 1.8808, 0.0},
	{"Jupiter", 5.203, 0.048, 11.86, 0.0},
	{"Saturn", 9.5555, 0.056, 29.42, 0.0},
	{"Uranus", 19.218, 0.046, 83.75, 0.0},
	{"Neptun", 30.110, 0.009, 163.73, 0.0}
};

const int planet_count = sizeof(planets)/ sizeof(planets[0]);

double calculate_middle_anomalie(const Planet *planet, double t){
	double M = planets->M0  + (2.0 * M_PI / planet->T)*t; 
	
	return M;
}
