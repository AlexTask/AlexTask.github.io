%Написати предикат containsListItem(L) для перевірки того,
%що серед елементів списку L зустрічаються списки.

is_list(X) :- var(X).
	is_list([_|Xs]) :- is_list(Xs).
	is_list([]).

notContainsListItem([ ]):- !.
notContainsListItem([H|T]):- 
    notContainsListItem(T),
    not(is_list(H)).


containsListItem(L):- \+notContainsListItem(L).