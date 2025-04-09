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
    ),
    (
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
        1,
        '102938475610293 BG',
        'left neck',
        'microchip',
        '2022-05-06'
    ),
    (
        2,
        '019283746501923 BG',
        'left neck',
        'microchip',
        '2024-04-22'
    );
insert into public.owners (
        "external_id",
        "firstname",
        "lastname",
        "address",
        "city",
        "country",
        "postcode",
        "phone"
    )
values (
        'google-oauth2|109188191634718673937',
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
    ),
    (
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
values ('BG01VP112233', '2022-05-06', 1, 1, 1, null),
    ('BG01VK990087', '2024-04-22', 2, 2, 1, null);
insert into public.anti_parasite_treatments (
        name,
        manufacturer,
        administered_on,
        administered_by,
        pet_id
    )
values ('Advantix', 'Bayer', '2022-07-04 00:00:00', 1, 1),
    ('Advantix', null, '2022-08-04 00:00:00', 1, 1),
    ('Vectra 3D', null, '2023-07-09 09:30:00', 1, 1);
insert into public.anti_echinococcus_treatments (
        name,
        manufacturer,
        administered_on,
        administered_by,
        pet_id
    )
values ('Fenpradin', null, '2022-05-16 00:00:00', 1, 1),
    ('Fenpradin', null, '2022-06-15 00:00:00', 1, 1),
    ('Cestal Plus', null, '2022-09-15 00:00:00', 1, 1),
    ('Milpro', null, '2024-06-28 00:00:00', 1, 1),
    ('Milprazon', null, '2025-03-21 00:00:00', 1, 1);
insert into public.vaccinations (
        name,
        manufacturer,
        lot_number,
        expiry_date,
        administered_on,
        administered_by,
        valid_from,
        valid_until,
        pet_id,
        type
    )
values (
        'DAPPi LR',
        'Eurican',
        'L492185',
        '2023-02-24',
        '2022-06-22',
        1,
        '2022-07-13',
        '2023-06-22',
        1,
        'rabies'
    ),
    (
        'DHPPi L4R',
        'Biocan',
        '35530',
        '2024-09-01',
        '2023-06-10',
        1,
        '2023-07-01',
        '2024-06-10',
        1,
        'rabies'
    ),
    (
        'LR',
        'Biocan',
        '295130A',
        '2024-12-01',
        '2024-06-04',
        1,
        '2024-06-25',
        '2025-06-04',
        1,
        'rabies'
    ),
    (
        'DHP',
        'Nobivac',
        'A145E01',
        '2023-06-01',
        '2022-05-06',
        1,
        null,
        '2023-06-05',
        1,
        'other'
    ),
    (
        'DHPPi',
        'Nobivac',
        'A668C01',
        '2023-11-01',
        '2022-05-22',
        1,
        null,
        '2023-05-22',
        1,
        'other'
    ),
    (
        'DAPPi LR',
        'Eurican',
        'L492185',
        '2023-02-24',
        '2022-06-22',
        1,
        null,
        '2023-06-22',
        1,
        'other'
    ),
    (
        'DHPPi L4R',
        'Biocan',
        '35530',
        '2024-09-01',
        '2023-06-10',
        1,
        null,
        '2024-06-10',
        1,
        'other'
    ),
    (
        'DHPPi',
        'Biocan',
        '655430',
        '2025-01-01',
        '2024-06-04',
        1,
        null,
        '2025-06-04',
        1,
        'other'
    );
