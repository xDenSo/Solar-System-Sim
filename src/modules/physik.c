#include "physik.h"
#include <math.h>

double t;
double dt;

Planet planets[] = {
	{"Merkur", 0.387, 0.206, 0.2408, 0.0},
	{"Venus", 0.723, 0.007, 0.6152, 0.0},
	{"Erde", 1.0000, 0.017, 1.0000, 0.0},
	{"Mars", 1.524, 0.093, 1.8808, 0.0},
	{"Jupiter", 5.203, 0.048, 11.86, 0.0},
	{"Saturn", 9.5555, 0.056, 29.42, 0.0},
	{"Uranus", 19.218, 0.046, 83.75, 0.0},
	{"Neptun", 30.110, 0.009, 163.73, 0.0}
};

const int planet_count = sizeof(planets)/ sizeof(planets[0]);

double calculate_middle_anomalie(const Planet *planet, double t){
	double M = planet->M0  + (2.0 * PI / planet->T)*t; 
	
	return M;
}

double calculate_eccentric_anomalie(const Planet *planet, double M){
	double E = M;

	for(int i = 0;i < 20 ; i++){
		double f = E - planet->epsilon * sin(E) - M;
		double df = 1 - planet->epsilon *cos(E);

		double E_new = E - (f/df);

		if(fabs(E_new -E)<1e-10){
			E = E_new;
			break;
		}
		E = E_new;
	
	}
	return E;
}

Position calculate_pos(const Planet *planet, double E){
	Position pos;
	pos.x = planet->a*(cos(E) - planet->epsilon);
	pos.y = planet->a * sqrt(1.0 - pow(planet->epsilon, 2)) * sin(E);
	return pos;

}
