#ifndef PHYSIK_H
#define PHYSIK_H

#include <stdio.h>

#define G 6.673e-11
#define PI 3.14159265359


typedef struct{
	char *name;
	double a;
	double epsilon;
	double T;
	double M0;
}Planet;

extern const int planet_count;
double calculate_middle_anomalie(const Planet *planet, double t);

#endif

