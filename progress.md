# StudyBuddy - Voortgang

## Infrastructuur

- [x] Nx monorepo opgezet (studybuddy-web + studybuddy-api)
- [x] TypeORM + SQLite database geconfigureerd
- [x] Entities: User, Course, StudyGroup, StudySession, Enrollment
- [x] Seed data (3 users, 5 courses, 4 groups, 6 sessions, 8 enrollments)
- [x] NestJS modules/controllers/services per entiteit (auth, courses, study-groups, study-sessions, enrollments)
- [x] JWT authenticatie (register, login, guards)
- [x] DTO validation met class-validator
- [x] API proxy configuratie (Angular -> NestJS)
- [x] Ownership checks op study-groups en study-sessions
- [x] CORS enabled

---

## F-01: Registratie

> Als bezoeker wil ik een account kunnen registreren, zodanig dat ik toegang kan krijgen tot persoonlijke functionaliteiten binnen StudyBuddy.

- [x] Registratieformulier met voornaam, achternaam, e-mail, studentnummer, opleiding, wachtwoord
- [x] Na succesvolle registratie kan de gebruiker inloggen
- [x] E-mailadres mag maar een keer voorkomen

## F-02: Inloggen en uitloggen

> Als gebruiker wil ik kunnen inloggen en uitloggen, zodanig dat mijn persoonlijke gegevens en acties beveiligd zijn.

- [x] Loginformulier met e-mailadres en wachtwoord
- [x] Ingelogde gebruiker krijgt toegang tot afgeschermde functionaliteiten
- [x] Na uitloggen zijn afgeschermde onderdelen niet meer toegankelijk

## F-03: Vakken overzicht en detail

> Als gebruiker wil ik een lijst van vakken kunnen bekijken en een detailpagina van een vak kunnen openen, zodanig dat ik relevante vakinformatie kan terugvinden.

- [x] Overzichtspagina met vakken
- [x] Per vak minimaal naam, code, studiejaar en semester zichtbaar
- [x] Vanuit het overzicht navigeren naar een detailpagina van een vak

## F-04: Studiegroepen overzicht en detail

> Als gebruiker wil ik een lijst van studiegroepen kunnen bekijken en een detailpagina van een studiegroep kunnen openen, zodanig dat ik passende groepen voor mijn vakken kan vinden.

- [ ] Overzichtspagina met studiegroepen
- [ ] Per studiegroep minimaal titel, gekoppeld vak, locatie en maximale groepsgrootte zichtbaar
- [ ] Vanuit het overzicht navigeren naar een detailpagina van een studiegroep

## F-05: Studiesessies overzicht en detail

> Als gebruiker wil ik een lijst van studiesessies kunnen bekijken en een detailpagina van een studiesessie kunnen openen, zodanig dat ik weet welke sessies gepland staan en wanneer ze plaatsvinden.

- [ ] Overzichtspagina met studiesessies
- [ ] Per sessie minimaal titel, datum, begin- en eindtijd en gekoppelde studiegroep zichtbaar
- [ ] Vanuit het overzicht navigeren naar een detailpagina van een studiesessie

## F-06: Studiegroep aanmaken

> Als ingelogde gebruiker wil ik een studiegroep kunnen aanmaken, zodanig dat ik andere studenten kan uitnodigen om samen te studeren.

- [ ] Alleen ingelogde gebruikers mogen een studiegroep aanmaken
- [ ] Bij het aanmaken: titel, beschrijving, locatie, max leden, gekoppeld vak
- [ ] De aangemaakte studiegroep wordt zichtbaar in het overzicht

## F-07: Studiegroep wijzigen en verwijderen

> Als eigenaar van een studiegroep wil ik mijn eigen studiegroep kunnen wijzigen en verwijderen, zodanig dat ik de inhoud actueel kan houden.

- [ ] Alleen de eigenaar mag de studiegroep wijzigen of verwijderen
- [ ] Niet-ingelogde gebruikers mogen deze acties niet uitvoeren
- [ ] Andere gebruikers mogen de studiegroep niet wijzigen of verwijderen

## F-08: Studiesessies CRUD

> Als eigenaar van een studiegroep wil ik studiesessies kunnen aanmaken, wijzigen en verwijderen, zodanig dat ik gezamenlijke leermomenten kan plannen en beheren.

- [ ] Alleen de eigenaar van de gekoppelde studiegroep mag sessies aanmaken, wijzigen of verwijderen
- [ ] Bij aanmaken/wijzigen: titel, datum, begin- en eindtijd, status, notities
- [ ] Een verwijderde sessie is niet meer zichtbaar in het overzicht

## F-09: Aan- en afmelden voor sessie

> Als ingelogde gebruiker wil ik mij kunnen aan- en afmelden voor een studiesessie, zodanig dat ik kan deelnemen aan of afzien van deelname aan een sessie.

- [ ] Alleen ingelogde gebruikers mogen zich aan- of afmelden
- [ ] Een gebruiker mag zich maar een keer per sessie aanmelden
- [ ] Na aanmelding is de gebruiker zichtbaar in de deelnemerslijst

## F-10: Zoeken en filteren

> Als gebruiker wil ik vakken, studiegroepen en studiesessies kunnen zoeken en filteren, zodanig dat ik snel relevante informatie kan vinden.

- [ ] Filteren op minimaal vak, studiejaar, datum en locatie
- [ ] Filterresultaten worden direct zichtbaar in het overzicht
- [ ] Filterfunctionaliteit beschikbaar over alle drie de domeinentiteiten

## F-11: About-page

> Als gebruiker wil ik een About-page kunnen bekijken, zodanig dat ik inzicht krijg in de casus, het datamodel en de functionaliteiten van de applicatie.

- [ ] Naam van de student en studentnummer
- [ ] Beschrijving van de casus
- [ ] ERD en tabel met functionele requirements
