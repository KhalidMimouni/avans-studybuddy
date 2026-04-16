import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import mermaid from 'mermaid';

const ERD_DEFINITION = `erDiagram
    User {
        int id PK
        string firstName
        string lastName
        string email UK
        string passwordHash
        string studentNumber
        string program
        datetime createdAt
        datetime updatedAt
    }

    Course {
        int id PK
        string name
        string code UK
        string description
        int studyYear
        int semester
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    StudyGroup {
        int id PK
        string title
        string description
        string meetingLocation
        int maxMembers
        boolean isPrivate
        int ownerId FK
        int courseId FK
        datetime createdAt
        datetime updatedAt
    }

    StudySession {
        int id PK
        string title
        date sessionDate
        datetime startTime
        datetime endTime
        string status
        string notes
        int studyGroupId FK
        datetime createdAt
        datetime updatedAt
    }

    Enrollment {
        int id PK
        int userId FK
        int studySessionId FK
        datetime joinedAt
        string attendanceStatus
        string motivation
        datetime createdAt
        datetime updatedAt
    }

    User ||--o{ StudyGroup : ""
    Course ||--o{ StudyGroup : ""
    StudyGroup ||--o{ StudySession : ""
    User ||--o{ Enrollment : ""
    StudySession ||--o{ Enrollment : ""
`;

interface FunctionalRequirement {
  id: string;
  requirement: string;
  criteria: string[];
  priority: string;
}

const FUNCTIONAL_REQUIREMENTS: FunctionalRequirement[] = [
  {
    id: 'F-01',
    requirement:
      'Als bezoeker wil ik een account kunnen registreren, zodanig dat ik toegang kan krijgen tot persoonlijke functionaliteiten binnen StudyBuddy.',
    criteria: [
      'Er is een registratieformulier met minimaal voornaam, achternaam, e-mailadres, studentnummer, opleiding en wachtwoord.',
      'Een gebruiker kan na succesvolle registratie inloggen.',
      'Een e-mailadres mag maar een keer in het systeem voorkomen.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-02',
    requirement:
      'Als gebruiker wil ik kunnen inloggen en uitloggen, zodanig dat mijn persoonlijke gegevens en acties beveiligd zijn.',
    criteria: [
      'Er is een loginformulier met e-mailadres en wachtwoord.',
      'Een ingelogde gebruiker krijgt toegang tot afgeschermde functionaliteiten.',
      'Na uitloggen zijn afgeschermde onderdelen niet meer toegankelijk.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-03',
    requirement:
      'Als gebruiker wil ik een lijst van vakken kunnen bekijken en een detailpagina van een vak kunnen openen, zodanig dat ik relevante vakinformatie kan terugvinden.',
    criteria: [
      'Er is een overzichtspagina met vakken.',
      'Per vak zijn minimaal naam, code, studiejaar en semester zichtbaar.',
      'Vanuit het overzicht kan naar een detailpagina van een vak genavigeerd worden.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-04',
    requirement:
      'Als gebruiker wil ik een lijst van studiegroepen kunnen bekijken en een detailpagina van een studiegroep kunnen openen, zodanig dat ik passende groepen voor mijn vakken kan vinden.',
    criteria: [
      'Er is een overzichtspagina met studiegroepen.',
      'Per studiegroep zijn minimaal titel, gekoppeld vak, locatie en maximale groepsgrootte zichtbaar.',
      'Vanuit het overzicht kan naar een detailpagina van een studiegroep genavigeerd worden.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-05',
    requirement:
      'Als gebruiker wil ik een lijst van studiesessies kunnen bekijken en een detailpagina van een studiesessie kunnen openen, zodanig dat ik weet welke sessies gepland staan en wanneer ze plaatsvinden.',
    criteria: [
      'Er is een overzichtspagina met studiesessies.',
      'Per sessie zijn minimaal titel, datum, begin- en eindtijd en gekoppelde studiegroep zichtbaar.',
      'Vanuit het overzicht kan naar een detailpagina van een studiesessie genavigeerd worden.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-06',
    requirement:
      'Als ingelogde gebruiker wil ik een studiegroep kunnen aanmaken, zodanig dat ik andere studenten kan uitnodigen om samen te studeren.',
    criteria: [
      'Alleen ingelogde gebruikers mogen een studiegroep aanmaken.',
      'Bij het aanmaken kunnen minimaal titel, beschrijving, locatie, maximum aantal leden en gekoppeld vak ingevoerd worden.',
      'De aangemaakte studiegroep wordt zichtbaar in het overzicht.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-07',
    requirement:
      'Als eigenaar van een studiegroep wil ik mijn eigen studiegroep kunnen wijzigen en verwijderen, zodanig dat ik de inhoud actueel kan houden.',
    criteria: [
      'Alleen de eigenaar van een studiegroep mag deze wijzigen of verwijderen.',
      'Niet-ingelogde gebruikers mogen deze acties niet uitvoeren.',
      'Andere gebruikers mogen de studiegroep niet wijzigen of verwijderen.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-08',
    requirement:
      'Als eigenaar van een studiegroep wil ik een studiesessie kunnen aanmaken, zodanig dat ik gezamenlijke leermomenten kan plannen.',
    criteria: [
      'Alleen de eigenaar van de gekoppelde studiegroep mag een studiesessie aanmaken.',
      'Bij het aanmaken kunnen minimaal titel, datum, begin- en eindtijd, status en notities ingevoerd worden.',
      'De aangemaakte studiesessie wordt zichtbaar in het overzicht.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-09',
    requirement:
      'Als eigenaar van een studiegroep wil ik studiesessies kunnen wijzigen en verwijderen, zodanig dat ik de planning actueel kan houden.',
    criteria: [
      'Alleen de eigenaar van de gekoppelde studiegroep mag sessies wijzigen of verwijderen.',
      'Niet-ingelogde gebruikers mogen deze acties niet uitvoeren.',
      'Een verwijderde sessie is niet meer zichtbaar in het overzicht.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-10',
    requirement:
      'Als ingelogde gebruiker wil ik mij kunnen aan- en afmelden voor een studiesessie, zodanig dat ik kan deelnemen aan of afzien van deelname aan een sessie.',
    criteria: [
      'Alleen ingelogde gebruikers mogen zich aan- of afmelden voor een sessie.',
      'Een gebruiker mag zich maar een keer per sessie aanmelden.',
      'Na aanmelding is de gebruiker zichtbaar in de deelnemerslijst van die sessie.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-11',
    requirement:
      'Als gebruiker wil ik vakken, studiegroepen en studiesessies kunnen zoeken en filteren, zodanig dat ik snel relevante informatie kan vinden.',
    criteria: [
      'Er kan gefilterd worden op minimaal vak, studiejaar, datum en locatie.',
      'De filterresultaten worden direct zichtbaar in het overzicht.',
      'De filterfunctionaliteit is beschikbaar over alle drie de domeinentiteiten waar dat relevant is.',
    ],
    priority: 'Must',
  },
  {
    id: 'F-12',
    requirement:
      'Als gebruiker wil ik een About-page kunnen bekijken, zodanig dat ik inzicht krijg in de casus, het datamodel en de functionaliteiten van de applicatie.',
    criteria: [
      'De About-page bevat de naam van de student en het studentnummer.',
      'De About-page bevat een beschrijving van de casus.',
      'De About-page bevat een ERD en een tabel met functionele requirements.',
    ],
    priority: 'Must',
  },
];

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-5xl mx-auto px-4 py-10">

        <h1 class="text-3xl font-bold text-gray-900 mb-2">Over StudyBuddy</h1>
        <p class="text-gray-500 mb-8">
          Khalid Mimouni &mdash; 2175124
        </p>

        <section class="bg-white rounded border border-gray-200 p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-3">Casusbeschrijving</h2>
          <p class="text-gray-700 leading-relaxed mb-3">
            StudyBuddy is een full-stack single page webapplicatie voor studenten die samen willen
            studeren. De applicatie stelt gebruikers in staat om vakken te bekijken, studiegroepen aan
            te maken en te beheren, studiesessies te plannen en zich aan te melden voor sessies van
            andere studiegroepen.
          </p>
          <p class="text-gray-700 leading-relaxed mb-3">
            Een gebruiker maakt een account aan, bladert door beschikbare vakken, maakt een
            studiegroep aan of sluit zich aan bij een bestaande groep, en neemt vervolgens deel aan
            concrete studiesessies. De eigenaar van een studiegroep beheert de sessies en kan
            deelnemers inzien.
          </p>
          <p class="text-gray-700 leading-relaxed">
            Het domeinmodel bestaat uit vijf entiteiten: <strong>User</strong>,
            <strong>Course</strong>, <strong>StudyGroup</strong>, <strong>StudySession</strong> en
            <strong>Enrollment</strong>. Enrollment functioneert als koppeltabel (zwakke entiteit)
            tussen User en StudySession en maakt de N:M-relatie mogelijk.
          </p>
        </section>

        <section class="bg-white rounded border border-gray-200 p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Entity Relationship Diagram</h2>
          <div class="overflow-x-auto">
            <div #erdContainer class="flex justify-center"></div>
          </div>
        </section>

        <section class="bg-white rounded border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Functionele requirements</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-300">
                  <th class="py-3 pr-3 font-semibold text-gray-900 whitespace-nowrap">ID</th>
                  <th class="py-3 pr-3 font-semibold text-gray-900">Functional Requirement</th>
                  <th class="py-3 pr-3 font-semibold text-gray-900">Acceptatiecriteria</th>
                  <th class="py-3 font-semibold text-gray-900 whitespace-nowrap">Prioriteit</th>
                </tr>
              </thead>
              <tbody>
                @for (fr of requirements; track fr.id) {
                  <tr class="border-b border-gray-200 align-top">
                    <td class="py-3 pr-3 font-medium text-gray-900 whitespace-nowrap">{{ fr.id }}</td>
                    <td class="py-3 pr-3 text-gray-700">{{ fr.requirement }}</td>
                    <td class="py-3 pr-3 text-gray-700">
                      <ul class="list-disc pl-4 space-y-1">
                        @for (c of fr.criteria; track c) {
                          <li>{{ c }}</li>
                        }
                      </ul>
                    </td>
                    <td class="py-3 text-gray-700 whitespace-nowrap">{{ fr.priority }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  `,
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('erdContainer', { static: true }) erdContainer!: ElementRef;

  requirements = FUNCTIONAL_REQUIREMENTS;

  async ngAfterViewInit() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });

    const { svg } = await mermaid.render('erd-diagram', ERD_DEFINITION);
    this.erdContainer.nativeElement.innerHTML = svg;
  }
}
