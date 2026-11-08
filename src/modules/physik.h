#ifndef PHYSIK_H
#define PHYSIK_H

#include <stdio.h>
#include <math.h>

#define G 6.673e-11
#define PI 3.14159265359


typedef struct{
	char *name;
	double a;
	double epsilon;
	double T;
	double M0;
}Planet;

typedef struct{
	double x;
	double y;
}Position;

extern const int planet_count;
extern Planet planets[];
double calculate_middle_anomalie(const Planet *planet, double t);
double calculate_eccentric_anomalie(const Planet *planet, double M);
Position calculate_pos(const Planet *planet, double E);

#endif

