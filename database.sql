create table room(
	room_id SERIAL primary key,
	name VARCHAR(100) not null,
	street VARCHAR(255) not null,
	postal_code int not null,
	city VARCHAR(255) not null,
	nb_participants int not null,
	photos VARCHAR(100)
);

create table reservation(
	reservation_id SERIAL primary key,
	room_id int,
	email VARCHAR(50),
	check_in timestamp,
	check_out timestamp,
	constraint FK_reservation_room foreign key (room_id) references room(room_id)
);

create table equipment(
	equipment_id SERIAL primary key,
	name VARCHAR(255) null
);

create table equipment_room(
	equipment_id int,
	room_id int,
	quantity int,
	constraint PK_equipment_room primary key (equipment_id, room_id),
	constraint FK_equipment_room_equipment foreign key (equipment_id) references equipment(equipment_id),
	constraint FK_equipment_room_room foreign key (room_id) references room(room_id)
);

create table photos(
	photo_id SERIAL primary key,
	path VARCHAR(255),
	room_id int,
	constraint FK_photos_room foreign key (room_id) references room(room_id)
);

insert into room values (default, 'Sea side room', 'rue du port', '33120', 'Arcachon', '20', 'img/searoom.jpg');
insert into room values (default, 'Forest room', 'allée des Mimosas', '33120', 'Arcachon', '18', 'img/forestroom.jpg');
insert into room values (default, 'The big room', 'rue Danremont', '33120', 'Arcachon', '30', 'img/bigroom.jpg');
insert into room values (default, 'nature room', 'rue Fondaudege', '33000', 'Bordeaux', '10', 'img/natureroom.jpg');
insert into room values (default, 'Eco room', 'rue de la Boétie', '33000', 'Bordeaux', '8', 'img/ecoroom.jpg');
insert into room values (default, 'Seine room', 'rue Bonaparte', '75000', 'Paris', '12', 'img/seineroom.jpg');
insert into room values (default, 'Glass room', 'rue Las Cases', '75000', 'Paris', '10', 'img/glassroom.jpg');

insert into equipment values (default, 'coffee maker');
insert into equipment values (default, 'computer');
insert into equipment values (default, 'projector');
insert into equipment values (default, 'board');

insert into equipment_room values (1, 1, 1);
insert into equipment_room values (2, 1, 3);
insert into equipment_room values (4, 1, 2);

insert into equipment_room values (1, 2, 1);
insert into equipment_room values (3, 2, 1);

insert into equipment_room values (1, 3, 1);
insert into equipment_room values (2, 3, 1);
insert into equipment_room values (3, 3, 1);
insert into equipment_room values (4, 3, 1);

insert into equipment_room values (1, 4, 1);
insert into equipment_room values (4, 4, 1);

insert into equipment_room values (4, 5, 1);

insert into equipment_room values (1, 6, 1);
insert into equipment_room values (2, 6, 1);
insert into equipment_room values (4, 6, 1);

insert into equipment_room values (1, 7, 1);
insert into equipment_room values (2, 7, 4);
insert into equipment_room values (3, 7, 1);


