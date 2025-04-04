insert into public.pets (
        "name",
        "dob",
        "sex",
        "species",
        "breed",
        "colors",
        "notes"
    )
values (
        'Bella',
        '2022-03-23',
        'female',
        'dog',
        'Golden Retriever',
        '{cream}',
        null
    );
insert into public.pet_markings(id, code, place, application_date)
values (
        1,
        '102938475610293 BG',
        'left neck',
        '2022-05-06'
    );
insert into public.pets (
        "name",
        "dob",
        "sex",
        "species",
        "breed",
        "colors",
        "notes"
    )
values (
        'Blaze',
        '2024-03-12',
        'female',
        'dog',
        'Border Collie',
        '{black, white}',
        null
    );
insert into public.pet_markings(
        "id",
        "code",
        "place",
        "type",
        "application_date"
    )
values (
        2,
        '019283746501923 BG',
        'left neck',
        'microchip',
        '2024-04-22'
    );
insert into public.owners (
        "firstname",
        "lastname",
        "address",
        "city",
        "country",
        "postcode",
        "phone"
    )
values (
        'Vladislav',
        'Hadzhiyski',
        'South Park 42',
        'Sofia',
        'Bulgaria',
        '1404',
        '+359879012345'
    );
insert into public.veterinarians (
        "name",
        "address",
        "postcode",
        "city",
        "country",
        "phone",
        "email",
        "website"
    )
values (
        'Dr Petrov',
        'Vitosha 1',
        null,
        'Sofia',
        'Bulgaria',
        null,
        null,
        null
    );
insert into public.veterinarians (
        "name",
        "address",
        "postcode",
        "city",
        "country",
        "phone",
        "email",
        "website"
    )
values (
        'Dr Georgiev',
        'Kutlovica 12 str.',
        '3400',
        'Montana',
        'Bulgaria',
        '+359888123456',
        'dr.georgiev@vet.test',
        null
    );
insert into public.passports (
        "serial_number",
        "issue_date",
        "issued_by",
        "pet_id",
        "owner1_id",
        "owner2_id"
    )
values ('BG01VP112233', '2022-05-06', 1, 1, 1, null);
insert into public.passports (
        "serial_number",
        "issue_date",
        "issued_by",
        "pet_id",
        "owner1_id",
        "owner2_id"
    )
values ('BG01VK990087', '2024-04-22', 2, 2, 1, null);
