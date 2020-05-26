%Написати предикат indexOf для знаходження індексу
%першого входження елемента у список.

indexOf([H|_], H, 0).
indexOf([_|T], H, Index):-
  indexOf(T, H, Index_T),
  Index is Index_T+1.

%Test data
%indexOf([x, c, d], c, Res)
%indexOf([c, k, d], c, Res)
%indexOf([y, o, m, c, k, d], c, Res)
