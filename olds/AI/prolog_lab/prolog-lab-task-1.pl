%У Пролог-програмі визначені відношення movie(X, Y, Z) (X — назва фільму, Y — рік випуску,
%Z — жанр (трилер, комедія, драма і т.п.)), 
%performer(X, Y) (X — назва фільму, Y — прізвище актора).
%Написати правила для наступних відношень:
%a. partner(X, Y): актори X та Y грали в тому самому фільмі;
%b. comedian(X): актор Х грав у лише комедіях;
%c. debut(X, Y): фільм X є першим за часом фільмом, у якому грав актор Y.

movie(fantasy1, 2001, fantasy).
movie(fantasy2, 2012, fantasy).
movie(comedy1, 2003, comedy).
movie(comedy2, 2020, comedy).
movie(thriller1, 1990, thriller).
movie(drama1, 2000, drama).
movie(drama2, 2005, drama).

performer(fantasy1, perf1).
performer(fantasy1, perf2).
performer(fantasy2, perf1).
performer(comedy2, perf3).
performer(comedy2, perf4).
performer(drama1, perf4).
performer(comedy1, perf5).
performer(comedy2, perf5).


getmov(X, Y):-performer(Mov, X), performer(Mov, Y).
partner(X, Y) :- not(\+getmov(X,Y)).


notcom(X):- performer(Mov, X), \+movie(Mov, _, comedy).
comedian(X) :- \+notcom(X).


minYear(X, Y):- movie(X, Y1, _), movie(Y, Y2, _), X \== Y, Y1 > Y2.
hasMinForPerf(X, Y):-minYear(X, M), performer(M, Y).
debut(X, Y) :- not(hasMinForPerf(X,Y)).
