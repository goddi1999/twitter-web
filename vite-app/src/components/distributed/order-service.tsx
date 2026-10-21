import { useState, type ReactNode } from 'react'

import { DocsCodeBlock } from '@/components/docs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Lang = 'en' | 'de'

const ORDER_EXAMPLE_ID = 'd76b2e52'
const BASE_URL = 'http://localhost:6010'

const BASE_PACKAGE_JSON = `{
  "name": "0000-base-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "crypto": "^1.0.1",
    "express": "^5.3.0"
  }
}`

const BASE_INDEX_JS = `const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_CREATED = 201;
const STATUS_OK = 200;

//Start Server
const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.info(\`Server is running on port \${PORT}\`)
});`

const SERVER_START_CODE =`const PORT = 6010;
app.listen(PORT, () => {
   console.info(\`Server is running on port \${PORT}\`)
});`

const ROUTE_EXAMPLE_CODE = `app.post('/orders', async (req, res) => { ... });`

const CREATE_BODY = `{
   "name":"Netflix",
   "isin":"US64110L1061",
   "amount":10
}`

const CREATE_RETURN = `{
   "id": "${ORDER_EXAMPLE_ID}",
   "name": "Netflix",
   "isin": "US64110L1061",
   "amount": 10,
   "price": 0,
   "state": 0
}`

const AMOUNT_BODY = `{
   "amount": 40
}`

const STATE_BODY = `{
   "state": 1
}`

const TRANSITIONS_CODE = `const validTransitions = {[STATE_CREATED] : [STATE_EXECUTED], ...}`

type Endpoint = {
  name: string
  url: string
  method: string
  goal: Record<Lang, string>
}

const ENDPOINTS: Endpoint[] = [
  {
    name: 'Create Order',
    url: '/orders',
    method: 'POST',
    goal: { en: 'Add an order', de: 'Hinzufügen einer Order' },
  },
  {
    name: 'Read All',
    url: '/orders',
    method: 'GET',
    goal: { en: 'Return all orders', de: 'Rückgabe aller Orders' },
  },
  {
    name: 'Read With ID',
    url: '/orders/{id}',
    method: 'GET',
    goal: { en: 'Return a specific order', de: 'Rückgabe einer bestimmten Order' },
  },
  {
    name: 'Update Amount',
    url: '/orders/{id}/amount',
    method: 'PATCH',
    goal: { en: 'Adjust amount of an order', de: 'Anpassen der Menge einer Order' },
  },
  {
    name: 'Update State',
    url: '/orders/{id}/state',
    method: 'PATCH',
    goal: { en: 'Adjust state of an order', de: 'Anpassen des Status einer Order' },
  },
  {
    name: 'Delete Order',
    url: '/orders/{id}',
    method: 'DELETE',
    goal: { en: 'Delete an order', de: 'Löschen einer Order' },
  },
]

type Copy = {
  title: string
  subtitle: string
  version: string
  baseTitle: string
  baseIntro: string
  baseFiles: string[]
  baseSteps: string[]
  baseInstallNote: string
  helloTitle: string
  helloIntro: string
  helloTest: string
  initialTitle: string
  initial: string[]
  setupTitle: string
  setupIntro: string
  tools: string[]
  setupCheck: string
  setupPostman: string
  projectTitle: string
  projectIntro: string
  projectExpress: string
  projectBodyParser: string
  projectCrypto: string
  projectCors: string
  projectInstall: string
  procedureTitle: string
  procedureIntro: string
  tableTitle: string
  tableHeaders: [string, string, string, string]
  structureIntro: string
  structureNext: string
  diagram: {
    app: string
    service: string
    express: string
    memory: string
    postman: string
    testing: string
    insert: string
    request: string
    response: string
  }
  startTitle: string
  startIntro: string
  startRun: string
  createTitle: string
  createIntro: string
  createFieldsIntro: string
  createFields: string[]
  createNote: string
  createDefaults: string
  createResponse: string
  createResponseReturn: string
  exampleBody: string
  exampleReturn: string
  readAllTitle: string
  readAllIntro: string
  readAllTest: string
  readAllSave: string
  readAllLost: string
  readAllFilter: string
  readAllFilterUse: string
  readAllFilterCheck: string
  readIdTitle: string
  readIdIntro: string
  readIdParams: string
  readIdRoute: string
  amountTitle: string
  amountIntro: string
  exampleUrl: string
  stateTitle: string
  stateIntro: string
  statesIntro: string
  states: string[]
  transitionsIntro: string
  transitions: string[]
  transitionsEnsure: string
  transitionsHint: string
  deleteTitle: string
  deleteIntro: string
  deleteOnly: string
  loggingTitle: string
  loggingIntro: string
  loggingTypes: string
  loggingApply: string
  errorsTitle: string
  errorsIntro: string
  errors: string[]
  optional: string
}

const COPY: Record<Lang, Copy> = {
  en: {
    title: 'Stock Order Service',
    subtitle: 'Build an in-memory REST service with Node.js and Express to buy, sell, and adjust stocks.',
    version: 'v1.2 – 22.10.2025',
    baseTitle: 'Base Project (Start Here)',
    baseIntro: 'Create a folder with these two files. This is the starting point for the whole exercise.',
    baseFiles: [
      'package.json - lists the packages the project needs',
      'index.js - starts the Express server',
    ],
    baseSteps: [
      'Save the first block as package.json and the second as index.js in the same folder.',
      'Open a terminal in that folder and run npm install. This downloads the packages into node_modules.',
      'Run npm start. You should see "Server is running on port 6010".',
    ],
    baseInstallNote: 'Without npm install the server will not start, because the packages are missing.',
    helloTitle: 'Try it: your first GET request',
    helloIntro:
      'Add this route to index.js above the "Start Server" part. A GET request asks the server for data. Here the server answers with a text.',
    helloTest:
      'Restart the server (stop it, then run npm start again). Open the URL below in your browser or in Postman with GET. You should see: Hallo Welt',
    initialTitle: 'Initial Situation',
    initial: [
      'Your task is to develop a system that allows users to buy, sell, and adjust stocks. Later, users should also be able to query prices and view information about their portfolios.',
      'Initially, to provide users with a demo version as quickly as possible, only orders should be created and edited. For simplicity, the information should be stored entirely in memory, meaning it will only be available during runtime.',
    ],
    setupTitle: 'System Setup',
    setupIntro: 'To develop the Order Service, the following tools need to be installed:',
    tools: [
      'Node.js - ideally a Long-Term-Support version (v22.21.0)',
      'VS Code - latest version',
      'Postman',
    ],
    setupCheck: 'To check the correct installation of Node.js, the command node -v can be executed.',
    setupPostman: 'For Postman, in addition to the installation, an account must also be created.',
    projectTitle: 'Project Setup',
    projectIntro:
      'Node.js and Express.js should be used to implement the service. A base project is provided, which includes an index.js file with the necessary imports and a package.json with the required packages.',
    projectExpress:
      'Express is used to enable simple structuring of interfaces. Here, the method of the call is defined, and then you can directly work with request and response objects.',
    projectBodyParser:
      'BodyParser is used to simplify request processing. It is a middleware that adjusts passed bodies to simplify processing (req.body).',
    projectCrypto:
      'Crypto is used to encrypt or decrypt data. crypto.randomBytes is used to generate random strings.',
    projectCors:
      'Cors (Cross-Origin Resource Sharing) allows access to the programmed interface from all origins easily.',
    projectInstall:
      'To start programming, you must first run the command npm install, which installs all packages specified in package.json into a node_modules folder.',
    procedureTitle: 'Procedure',
    procedureIntro:
      'The service to be developed should define a REST interface that can be easily accessed from the outside. To enable the functionality of the service, the following CRUD methods should be developed. Each CRUD operation (Create, Read, Update, Delete) should have at least one method.',
    tableTitle: 'Order Service',
    tableHeaders: ['Name', 'URL', 'Method', 'Goal'],
    structureIntro: 'The service to be developed has the following structure:',
    structureNext: 'Next, each method will be discussed in more detail.',
    diagram: {
      app: 'Order Application',
      service: 'Order Service',
      express: 'Express API',
      memory: 'Storage in memory',
      postman: 'Postman',
      testing: 'Used for testing',
      insert: 'Insert Data',
      request: 'Request',
      response: 'Response',
    },
    startTitle: '1. Starting the Server',
    startIntro: 'The following code is used to start the server:',
    startRun: 'To start the server, run node index.js in the console.',
    createTitle: '2. Create Order',
    createIntro:
      'A request should save an order in the service. Use the post() method from Express for this. A simple JavaScript list can be used to store the orders.',
    createFieldsIntro: 'An order should contain the following information:',
    createFields: [
      'Unique ID (32-bit, hexadecimal) - use the Crypto package for this.',
      'Name of the stock',
      'ISIN of the stock - use the actual ISIN.',
      'Quantity of the purchased shares',
      'Price of the purchased stock',
      'Status of the order (created vs. executed vs. sold)',
    ],
    createNote:
      'Note: The price is not further used in this exercise but should be included for future tasks.',
    createDefaults:
      'When creating, name, ISIN, and quantity are specified. The ID should be generated automatically, and the state and price should be set to 0 by default.',
    createResponse:
      'Each request must also return a response. The syntax res.status(<status>).send(<reply>) can always be used for this. The status is a simple HTTP status. This website can help with status selection.',
    createResponseReturn: 'As a response, the (complete) created object should be returned.',
    exampleBody: 'Example Body',
    exampleReturn: 'Example Return',
    readAllTitle: '3. Read All',
    readAllIntro:
      'To check if the addition was successful, a READ query should be created to output all added elements. Use the get() method from Express for this.',
    readAllTest:
      'To test Create Order and Read All, use Postman. First, add several orders (POST) and then query them (GET). Always pass the correct URL and body in Postman.',
    readAllSave: 'Note: Calls in Postman can be saved.',
    readAllLost: 'Please note: The saved orders are lost when the application restarts.',
    readAllFilter:
      'To filter the results, an additional query parameter should be introduced, allowing only orders with a specific status to be returned.',
    readAllFilterUse:
      'Use req.query.state from Express for this. The URL should be specified as follows:',
    readAllFilterCheck:
      'To enable concrete filtering, add a query to your JavaScript code to check if the query parameter state is set. If yes, only return orders with that status; otherwise, return all orders.',
    readIdTitle: '4. Read With ID',
    readIdIntro:
      'To get information on specific orders, another READ method should be introduced to return a single order based on its ID. Implement another method using get() and use the ID as part of the URL call: /orders/{id}',
    readIdParams: 'Use req.params.id from Express for this.',
    readIdRoute: 'The route in Express should be /orders/:id',
    amountTitle: '5. Update Amount',
    amountIntro:
      'In addition to adding orders, orders should also be adjustable as long as they are in state 0 (created). The amount can be increased or decreased. Program an update request using the patch() method from Express. patch is used instead of put as the element is not replaced, only adjusted. The ID of the request is set in the URL, and the new amount in the body. If accessing a non-existent object, an error is thrown.',
    exampleUrl: 'Example URL',
    stateTitle: '6. Update State',
    stateIntro:
      'Currently, orders are only created, not executed. Program a request to execute an order, receiving the ID and the new state of a specific order and adjusting the state accordingly.',
    statesIntro: 'The used states are coded as numbers:',
    states: ['created: 0', 'executed: 1', 'sold: 2'],
    transitionsIntro: 'Not all status changes are possible. Valid transitions are:',
    transitions: ['created - executed', 'executed - sold'],
    transitionsEnsure: 'Ensure no invalid states or transitions are possible.',
    transitionsHint:
      'Hint: You can save time later by defining a data structure containing all valid state changes:',
    deleteTitle: '7. Delete Order',
    deleteIntro: 'Program the functionality to delete an order using the delete() method from Express.',
    deleteOnly:
      'It\'s important that orders can only be deleted in the "created" state. Ensure orders in other states cannot be deleted.',
    loggingTitle: '8. Logging',
    loggingIntro:
      'console.log() provides limited options for communicating errors and information to users. To add more information to logs, use other log types in JS.',
    loggingTypes: 'These include:',
    loggingApply:
      'Apply these log levels to all console.log() commands created during development.',
    errorsTitle: '9. Error Handling',
    errorsIntro:
      'To minimize potential errors from the start, implement error handling for all methods. For example:',
    errors: [
      'What happens with incorrect values in POST',
      'What happens with an incorrect request URL',
      'What happens if values cannot be read',
      'What happens if an incorrect status is passed',
      'What happens with unauthorized status changes',
      'etc.',
    ],
    optional: 'Optional',
  },
  de: {
    title: 'Aktienorder-Service',
    subtitle:
      'Einen In-Memory REST-Service mit Node.js und Express zum Kaufen, Verkaufen und Anpassen von Aktien entwickeln.',
    version: 'v1.2 - 22.10.2025',
    baseTitle: 'Base Project (Hier starten)',
    baseIntro: 'Legen Sie einen Ordner mit diesen zwei Dateien an. Das ist der Startpunkt für die ganze Übung.',
    baseFiles: [
      'package.json - listet die benötigten Pakete auf',
      'index.js - startet den Express-Server',
    ],
    baseSteps: [
      'Speichern Sie den ersten Block als package.json und den zweiten als index.js im selben Ordner.',
      'Öffnen Sie ein Terminal in diesem Ordner und führen Sie npm install aus. Dadurch werden die Pakete in node_modules geladen.',
      'Führen Sie npm start aus. Sie sollten "Server is running on port 6010" sehen.',
    ],
    baseInstallNote: 'Ohne npm install startet der Server nicht, weil die Pakete fehlen.',
    helloTitle: 'Ausprobieren: Ihr erster GET-Request',
    helloIntro:
      'Fügen Sie diese Route in index.js oberhalb von "Start Server" ein. Ein GET-Request fragt Daten vom Server ab. Hier antwortet der Server mit einem Text.',
    helloTest:
      'Starten Sie den Server neu (stoppen, dann erneut npm start). Öffnen Sie die URL unten im Browser oder in Postman mit GET. Sie sollten sehen: Hallo Welt',
    initialTitle: 'Ausgangssituation',
    initial: [
      'Ihre Aufgabe ist es, ein System zu entwickeln, welches es Nutzern ermöglicht Aktien zu kaufen, zu verkaufen und anzupassen. Später sollen Nutzer auch Preise abfragen und Informationen zu ihren Portfolios einsehen können.',
      'Um Nutzern möglichst schnell Funktionalität im Umfang einer ersten Demo zur Verfügung zu stellen, sollen zunächst nur Order erstellt und bearbeitet werden können. Zur Vereinfachung sollen die Informationen vollständig im Arbeitsspeicher abgelegt werden, also nur während der Laufzeit verfügbar sein.',
    ],
    setupTitle: 'System Setup',
    setupIntro: 'Um den Order Service entwickeln zu können, müssen folgende Tools installiert werden:',
    tools: [
      'Node.js - Im Idealfall eine Long-Term-Support Version (v22.21.0)',
      'VS Code - Aktuellste Version',
      'Postman',
    ],
    setupCheck: 'Zum Prüfen der korrekten Installation von Node.js kann der Befehl node -v ausgeführt werden.',
    setupPostman: 'Für Postman muss zusätzlich zur Installation auch ein Account angelegt werden.',
    projectTitle: 'Projekt Setup',
    projectIntro:
      'Zur Umsetzung des Services sollen Node.js und Express.js verwendet werden. Hierzu wird ein Base Project bereitgestellt, welches eine index.js Datei mit den nötigen Imports und eine package.json mit den benötigten Paketen enthält.',
    projectExpress:
      'Express wird verwendet, um einfache Strukturierung von Schnittstellen zu ermöglichen. Hierzu muss nur die Methode des Aufrufs definiert werden, dann kann direkt mit Request und Response Objekten gearbeitet werden.',
    projectBodyParser:
      'BodyParser wird verwendet, um die Verarbeitung von Requests zu vereinfachen. Es handelt sich um eine Middleware, welche übergebene Bodies anpasst, um die Verarbeitung zu vereinfachen. (req.body)',
    projectCrypto:
      'Crypto wird verwendet, um Daten zu verschlüsseln oder zu entschlüsseln. Crypto random bytes wird verwendet, um zufällige Strings zu generieren.',
    projectCors:
      'Cors bedeutet Cross Origing Resource Sharing. Das Paket ermöglicht es einfach von allen Ausgangspunkten (Origins) auf die programmierte Schnittstelle zuzugreifen.',
    projectInstall:
      'Um mit dem Programmieren beginnen zu können müssen Sie zunächst den Befehl npm install ausführen, dieser installiert alle in package.json spezifizierten Pakete in einem node_modules Ordner.',
    procedureTitle: 'Vorgehen',
    procedureIntro:
      'Der zu entwickelnde Service soll eine REST Schnittstelle definieren, auf welche von außerhalb einfach zugegriffen werden kann. Um die Funktionalität des Services zu ermöglichen, sollen folgende CRUD Methoden entwickelt werden. Es werden für Create, Read, Update und Delete jeweils mindestens eine Methode eingeführt.',
    tableTitle: 'Order Service',
    tableHeaders: ['Name', 'URL', 'Methode', 'Ziel'],
    structureIntro: 'Der zu entwickelnde Service hat die folgende Struktur:',
    structureNext: 'Im Folgenden wird auf die einzelnen Methoden näher eingegangen.',
    diagram: {
      app: 'Order Application',
      service: 'Order Service',
      express: 'Express API',
      memory: 'Speicherung im Arbeitsspeicher',
      postman: 'Postman',
      testing: 'Zum Testen',
      insert: 'Daten eingeben',
      request: 'Request',
      response: 'Response',
    },
    startTitle: '1. Server Starten',
    startIntro: 'Folgender Code wird zum Starten des Servers verwendet:',
    startRun: 'Um den Server zu Starten muss in der Konsole node index.js ausgeführt werden.',
    createTitle: '2. Create Order',
    createIntro:
      'Mittels eines Requests soll eine Order im Service gespeichert werden. Dazu soll die Methode post() von Express verwendet werden. Zum Speichern der Orders kann eine einfache JavaScript Liste verwendet werden.',
    createFieldsIntro: 'Eine Order soll folgende Informationen beinhalten:',
    createFields: [
      'Einzigartige ID (32 Bit, Hexadezimalschreibweise) - hierzu kann das Paket Crypto verwendet werden.',
      'Name der Aktie',
      'ISIN der Aktie - Hier sollte die tatsächliche ISIN verwendet werden.',
      'Menge der gekauften Aktien',
      'Preis der gekauften Aktie',
      'Status der Order (erstellt vs. ausgeführt vs. verkauft)',
    ],
    createNote:
      'Hinweis: Der Preis wird in dieser Übung nicht weiter verwendet, wird aber für spätere Aufgaben benötigt und sollte daher mit eingebunden werden.',
    createDefaults:
      'Bei der Erstellung werden Name, ISIN und Menge angegeben. Die ID soll automatisch generiert werden, der Zustand und der Preis werden standardmäßig auf 0 gesetzt.',
    createResponse:
      'Jeder Request muss auch eine Response zurückgeben. Dazu kann immer die Syntax res.status(<status>).send(<reply>) verwendet werden. Der Status ist dabei ein einfacher HTTP Status. Zur Unterstützung bei der Statuswahl kann diese Website verwendet werden.',
    createResponseReturn:
      'Als Antwort sollte nach dem Erstellen das (vollständige) erzeugte Objekt zurückgegeben werden.',
    exampleBody: 'Beispiel Body',
    exampleReturn: 'Beispiel Return',
    readAllTitle: '3. Read All',
    readAllIntro:
      'Um zu prüfen, ob das Hinzufügen erfolgreich war, soll eine READ Abfrage erstellt werden, mit der alle hinzugefügten Elemente ausgegeben werden. Dazu kann die get() Methode von Express verwendet werden.',
    readAllTest:
      'Zum Testen von Create Order und Read All soll Postman verwendet werden. Zunächst sollen hierzu mehrere Orders hinzugefügt (POST) und dann abgefragt (GET) werden. In Postman müssen immer die richtige URL und der richtige Body übergeben werden.',
    readAllSave: 'Hinweis: Aufrufe in Postman können gespeichert werden.',
    readAllLost: 'Bitte beachten Sie: Bei Neustart der Anwendung gehen die gespeicherten Orders verloren.',
    readAllFilter:
      'Zum Filtern der Ergebnisse soll zusätzlich ein Query Parameter eingeführt werden, mit dessen Hilfe nur Orders zurückgegeben werden können, die einen bestimmten Status haben.',
    readAllFilterUse:
      'Hierzu wird req.query.state von Express verwendet. Zum Aufruf wird die URL folgenderweise angegeben:',
    readAllFilterCheck:
      'Um das konkrete Filtern zu ermöglichen, fügen Sie ihrem Javascript Code eine Abfrage hinzu in der geprüft wird, ob der Query Parameter state gesetzt ist. Wenn ja, sollen nur die Orders zurückgegeben werden, welche den Status haben, falls nein sollen alle Orders zurückgegeben werden.',
    readIdTitle: '4. Read With ID',
    readIdIntro:
      'Um Informationen zu bestimmten Orders zu erhalten, soll eine weitere READ Methode eingeführt werden, mit der man eine einzelne Order basierend auf ihrer ID zurückgeben kann. Implementieren Sie hierzu eine weitere Methode mit get() und verwenden Sie die ID als Teil der URL des Aufrufs: /orders/{id}',
    readIdParams: 'Hierzu wird req.params.id von Express verwendet.',
    readIdRoute: 'Die zu definierende Route in Express ist /orders/:id',
    amountTitle: '5. Update Amount',
    amountIntro:
      'Zusätzlich zum Hinzufügen von Orders sollen Orders auch wieder geändert werden können, solange diese im Zustand 0 (erstellt) sind. Dabei soll die Menge erhöht oder reduziert werden können. Programmieren Sie einen Update Request mit der Express Methode patch(). Es wird patch verwendet und nicht put, da das Element nicht ersetzt, sondern nur angepasst wird. Die ID des Requests wird in der URL gesetzt, die neue Menge im Body. Wird auf ein nicht existierendes Objekt zugegriffen, wird ein Fehler geworfen.',
    exampleUrl: 'Beispiel URL',
    stateTitle: '6. Update State',
    stateIntro:
      'Aktuell werden Orders nur erstellt, aber nicht ausgeführt. Programmieren Sie zum Ausführen einen Request, der die ID und den neuen Status einer bestimmten Order erhält und den Status entsprechend anpasst.',
    statesIntro: 'Die verwendeten Zustände werden als Zahlen kodiert:',
    states: ['erstellt: 0', 'ausgeführt: 1', 'verkauft: 2'],
    transitionsIntro:
      'Es kann nicht von jedem Status in jeden anderen Status gewechselt werden. Mögliche Wechsel sind:',
    transitions: ['erstellt - ausgeführt', 'ausgeführt - verkauft'],
    transitionsEnsure:
      'Achten Sie darauf, dass keine ungültigen Zustände und Zustandswechsel möglich sind.',
    transitionsHint:
      'Hinweis: Sie können später Zeit sparen, indem Sie eine Datenstruktur mit allen gültigen Übergängen definieren:',
    deleteTitle: '7. Delete Order',
    deleteIntro:
      'Programmieren Sie die Funktionalität zum Löschen einer Order. Verwenden Sie dazu die Methode delete() von Express.',
    deleteOnly:
      'Wichtig ist hierbei, dass Orders nur im Zustand “erstellt” gelöscht werden können. Stellen Sie sicher, dass Orders in anderen Zuständen nicht gelöscht werden können.',
    loggingTitle: '8. Logging',
    loggingIntro:
      'Logging mit console.log() bietet nur begrenzte Möglichkeiten zur Mitteilung von Fehlern und Informationen an Nutzer. Um zusätzlich zur bereitgestellten Nachrichten auch weitere Informationen in Logs mitzugeben, können in JS auch andere Arten von Logs verwendet werden.',
    loggingTypes: 'Bei diesen handelt es sich um:',
    loggingApply:
      'Wenden Sie diese Log-Level auf alle im Verlauf der Entwicklung erstellten console.log() Befehle an.',
    errorsTitle: '9. Fehlerbehandlung',
    errorsIntro:
      'Um Fehlerquellen von Beginn an zu minimieren, soll entsprechende Fehlerbehandlung für alle Methoden eingeführt werden. Beispielsweise:',
    errors: [
      'Was passiert bei falschen Werten im POST',
      'Was passiert bei einer Falschen Request URL',
      'Was passiert, wenn Werte nicht gelesen werden können',
      'Was passiert, wenn ein Falscher Status übergeben wird',
      'Was passiert bei unerlaubten Statuswechseln',
      'etc.',
    ],
    optional: 'Optional',
  },
}

const LINKS = [
  { label: 'Node.js', href: 'https://nodejs.org/en' },
  { label: 'VS Code', href: 'https://code.visualstudio.com/download' },
  { label: 'Postman', href: 'https://www.postman.com/downloads/' },
  { label: 'Express', href: 'https://expressjs.com/' },
  {
    label: 'BodyParser',
    href: 'https://expressjs.com/en/resources/middleware/body-parser.html',
  },
  { label: 'Crypto', href: 'https://nodejs.org/api/crypto.html' },
  { label: 'Cors', href: 'https://expressjs.com/en/resources/middleware/cors.html' },
  { label: 'HTTP Status', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
]

const LOG_METHODS = ['console.info()', 'console.warn()', 'console.error()']

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-xs text-foreground">{children}</code>
}

function Para({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
}

const HIGHLIGHT = /(package\.json|index\.js|node_modules|npm install|npm start)/g

function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(HIGHLIGHT).map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  )
}

function Bullets({ items, mono = false }: { items: string[]; mono?: boolean }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className={mono ? 'font-mono text-xs' : undefined}>
          {item}
        </li>
      ))}
    </ul>
  )
}

function Section({
  title,
  badge,
  children,
}: {
  title: string
  badge?: string
  children: ReactNode
}) {
  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
            {badge ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                {badge}
              </span>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </li>
  )
}

function StructureDiagram({ labels }: { labels: Copy['diagram'] }) {
  return (
    <svg
      viewBox="0 0 560 300"
      role="img"
      aria-label={`${labels.app}: ${labels.service}, ${labels.postman}`}
      className="h-auto w-full max-w-xl text-foreground"
    >
      <defs>
        <marker
          id="os-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="10" y="40" width="230" height="250" rx="22" />
        <rect x="45" y="90" width="160" height="150" rx="20" />
        <rect x="340" y="90" width="150" height="150" rx="20" />
        <line x1="415" y1="52" x2="415" y2="86" markerEnd="url(#os-arrow)" />
        <line x1="338" y1="130" x2="207" y2="130" markerEnd="url(#os-arrow)" />
        <line x1="207" y1="200" x2="338" y2="200" markerEnd="url(#os-arrow)" />
      </g>
      <g fill="currentColor" textAnchor="middle" fontFamily="inherit">
        <text x="125" y="28" fontSize="14" fontWeight="600">
          {labels.app}
        </text>
        <text x="125" y="128" fontSize="13" fontWeight="600">
          {labels.service}
        </text>
        <text x="125" y="156" fontSize="11">
          • {labels.express}
        </text>
        <text x="125" y="176" fontSize="11">
          • {labels.memory}
        </text>
        <text x="415" y="128" fontSize="13" fontWeight="600">
          {labels.postman}
        </text>
        <text x="415" y="156" fontSize="11">
          • {labels.testing}
        </text>
        <text x="448" y="30" fontSize="11" textAnchor="start">
          {labels.insert}
        </text>
        <text x="272" y="122" fontSize="11">
          {labels.request}
        </text>
        <text x="272" y="192" fontSize="11">
          {labels.response}
        </text>
        <circle cx="415" cy="14" r="8" />
        <path d="M399 38 a16 16 0 0 1 32 0 z" />
      </g>
    </svg>
  )
}

export function OrderServiceGuide() {
  const [lang, setLang] = useState<Lang>('en')
  const t = COPY[lang]

  return (
    <section className="flex flex-col gap-6" aria-labelledby="order-service-heading">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {t.version}
            </p>
            <h2
              id="order-service-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              {t.title}
            </h2>
          </div>
          <div role="group" aria-label="Language" className="flex gap-1">
            {(['en', 'de'] as const).map((code) => (
              <Button
                key={code}
                type="button"
                size="sm"
                variant={lang === code ? 'default' : 'outline'}
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{t.subtitle}</p>
      </header>

      <ul className="flex list-none flex-col gap-4 p-0">
        <Section title={t.baseTitle}>
          <Para>{t.baseIntro}</Para>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
            {t.baseFiles.map((file) => (
              <li key={file}>
                <Highlight text={file} />
              </li>
            ))}
          </ul>
          <DocsCodeBlock title="package.json" language="json" code={BASE_PACKAGE_JSON} />
          <DocsCodeBlock title="index.js" language="javascript" code={BASE_INDEX_JS} />
          <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
            {t.baseSteps.map((step) => (
              <li key={step}>
                <Highlight text={step} />
              </li>
            ))}
          </ol>
          <DocsCodeBlock title="terminal" language="bash" code={'npm install\nnpm start'} />
          <Para>
            <Highlight text={t.baseInstallNote} />
          </Para>
          <h3 className="text-sm font-semibold">{t.helloTitle}</h3>
          <Para>
            <Highlight text={t.helloIntro} />
          </Para>
          <DocsCodeBlock title="index.js" language="javascript" code={HELLO_CODE} />
          <Para>
            <Highlight text={t.helloTest} />
          </Para>
          <DocsCodeBlock title="URL (GET)" language="bash" code={`${BASE_URL}/hello`} />
        </Section>

        <Section title={t.initialTitle}>
          {t.initial.map((paragraph) => (
            <Para key={paragraph}>{paragraph}</Para>
          ))}
        </Section>

        <Section title={t.setupTitle}>
          <Para>{t.setupIntro}</Para>
          <Bullets items={t.tools} />
          <Para>
            {t.setupCheck.split('node -v')[0]}
            <Code>node -v</Code>
            {t.setupCheck.split('node -v')[1]}
          </Para>
          <Para>{t.setupPostman}</Para>
        </Section>

        <Section title={t.projectTitle}>
          <Para>{t.projectIntro}</Para>
          <Para>{t.projectExpress}</Para>
          <DocsCodeBlock title="index.js" language="javascript" code={ROUTE_EXAMPLE_CODE} />
          <Para>{t.projectBodyParser}</Para>
          <Para>{t.projectCrypto}</Para>
          <Para>{t.projectCors}</Para>
          <Para>{t.projectInstall}</Para>
          <DocsCodeBlock title="terminal" language="bash" code="npm install" />
        </Section>

        <Section title={t.procedureTitle}>
          <Para>{t.procedureIntro}</Para>
          <div className="overflow-hidden rounded-lg border">
            <p className="border-b px-4 py-2 text-center text-sm font-semibold">
              {t.tableTitle}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  {t.tableHeaders.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ENDPOINTS.map((endpoint) => (
                  <TableRow key={endpoint.name}>
                    <TableCell className="font-medium">{endpoint.name}</TableCell>
                    <TableCell className="font-mono text-xs">{endpoint.url}</TableCell>
                    <TableCell className="font-mono text-xs">{endpoint.method}</TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {endpoint.goal[lang]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Para>{t.structureIntro}</Para>
          <StructureDiagram labels={t.diagram} />
          <Para>{t.structureNext}</Para>
        </Section>

        <Section title={t.startTitle}>
          <Para>{t.startIntro}</Para>
          <DocsCodeBlock title="index.js" language="javascript" code={SERVER_START_CODE} />
          <Para>
            {t.startRun.split('node index.js')[0]}
            <Code>node index.js</Code>
            {t.startRun.split('node index.js')[1]}
          </Para>
        </Section>

        <Section title={t.createTitle}>
          <Para>{t.createIntro}</Para>
          <Para>{t.createFieldsIntro}</Para>
          <Bullets items={t.createFields} />
          <Para>{t.createNote}</Para>
          <Para>{t.createDefaults}</Para>
          <Para>{t.createResponse}</Para>
          <Para>{t.createResponseReturn}</Para>
          <DocsCodeBlock title={t.exampleBody} language="json" code={CREATE_BODY} />
          <DocsCodeBlock title={t.exampleReturn} language="json" code={CREATE_RETURN} />
        </Section>

        <Section title={t.readAllTitle}>
          <Para>{t.readAllIntro}</Para>
          <Para>{t.readAllTest}</Para>
          <Para>{t.readAllSave}</Para>
          <Para>{t.readAllLost}</Para>
          <Para>{t.readAllFilter}</Para>
          <Para>{t.readAllFilterUse}</Para>
          <DocsCodeBlock title="URL" language="bash" code={`${BASE_URL}/orders?state=0`} />
          <Para>{t.readAllFilterCheck}</Para>
        </Section>

        <Section title={t.readIdTitle}>
          <Para>{t.readIdIntro}</Para>
          <Para>{t.readIdParams}</Para>
          <Para>{t.readIdRoute}</Para>
          <DocsCodeBlock title="route" language="javascript" code="/orders/:id" />
        </Section>

        <Section title={t.amountTitle}>
          <Para>{t.amountIntro}</Para>
          <DocsCodeBlock
            title={t.exampleUrl}
            language="bash"
            code={`${BASE_URL}/orders/${ORDER_EXAMPLE_ID}/amount`}
          />
          <DocsCodeBlock title={t.exampleBody} language="json" code={AMOUNT_BODY} />
        </Section>

        <Section title={t.stateTitle}>
          <Para>{t.stateIntro}</Para>
          <Para>{t.statesIntro}</Para>
          <Bullets items={t.states} />
          <Para>{t.transitionsIntro}</Para>
          <Bullets items={t.transitions} />
          <Para>{t.transitionsEnsure}</Para>
          <Para>{t.transitionsHint}</Para>
          <DocsCodeBlock title="index.js" language="javascript" code={TRANSITIONS_CODE} />
          <DocsCodeBlock
            title={t.exampleUrl}
            language="bash"
            code={`${BASE_URL}/orders/${ORDER_EXAMPLE_ID}/state`}
          />
          <DocsCodeBlock title={t.exampleBody} language="json" code={STATE_BODY} />
        </Section>

        <Section title={t.deleteTitle}>
          <Para>{t.deleteIntro}</Para>
          <DocsCodeBlock
            title={t.exampleUrl}
            language="bash"
            code={`${BASE_URL}/orders/${ORDER_EXAMPLE_ID}`}
          />
          <Para>{t.deleteOnly}</Para>
        </Section>

        <Section title={t.loggingTitle} badge={t.optional}>
          <Para>{t.loggingIntro}</Para>
          <Para>{t.loggingTypes}</Para>
          <Bullets items={LOG_METHODS} mono />
          <Para>{t.loggingApply}</Para>
        </Section>

        <Section title={t.errorsTitle} badge={t.optional}>
          <Para>{t.errorsIntro}</Para>
          <Bullets items={t.errors} />
        </Section>

        <Section title="Links">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-4"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </ul>
    </section>
  )
}
