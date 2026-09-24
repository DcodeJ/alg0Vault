# Your C# and .NET career roadmap

Prepared for Damian · 7 September 2026 · Version 2

**Goal:** become a credible candidate for an internship or junior C#/.NET backend developer role, then succeed in your first months at work.

**Starting point:** you have created console projects, used Visual Studio and `Practice.slnx`, and are learning input, nullable strings, validation and loops. You have started small practice applications. That is useful progress; begin with the diagnostic below rather than reinstalling everything.

**Planning assumption:** 12 focused hours per week, mostly free learning resources, Windows, GitHub, and a Poland-based job search. Your actual weekly availability has not been confirmed. The schedule is a planning estimate, not a promise of employment.

## Contents

1. [Start here](#1-start-here)
2. [The target and technology choices](#2-the-target-and-technology-choices)
3. [How to study](#3-how-to-study)
4. [Your first seven days](#4-your-first-seven-days)
5. [The complete 40-week plan](#5-the-complete-40-week-plan)
6. [Your flagship project](#6-your-flagship-project)
7. [Git, tools and troubleshooting](#7-git-tools-and-troubleshooting)
8. [Applications and interviews](#8-applications-and-interviews)
9. [Readiness and the first job](#9-readiness-and-the-first-job)
10. [Progress templates](#10-progress-templates)
11. [The reusable master prompt](#11-the-reusable-master-prompt)
12. [Resources and evidence](#12-resources-and-evidence)

## 1. Start here

Your next milestone is a calculator that accepts valid numbers and operators, repeats after a calculation, and exits cleanly. Complete it yourself before moving to database or web development.

Take this diagnostic in about 60–90 minutes. Documentation is allowed; tutorial solutions and generated implementations are not part of this assessment.

1. Ask for a name. Reject empty and whitespace-only input and ask again.
2. Explain the difference between `null`, `""`, `" "`, `string?` and `??`.
3. Ask for an integer from 1 to 100. Reject text and out-of-range values.
4. Read five numbers and calculate their average without losing fractional values.
5. Put one repeated operation into a method.
6. Use a breakpoint to inspect a variable inside a loop.
7. Find the correct project file, run it and record the change with Git.

Mark each item **independent**, **with hints**, or **not yet**. Start at week 1 unless you can complete all seven independently. If you can, attempt the phase A completion task and move forward only when that also passes.

### What changed in this version

- The calendar is consistent: 40 weeks × 12 hours = 480 planned hours.
- Your existing exercises become practice material; you do not need a collection of new repositories.
- One flagship grows from console application to database-backed service to deployed product.
- Tests, debugging and Git enter early and recur throughout.
- Applications begin when you can demonstrate useful work; they do not depend on finishing every optional topic.
- The plan includes recovery time, feedback and the first 90 days at work.

At 8 hours per week, the same 480 hours take about 60 weeks. At 20 hours, they take about 24 weeks. These are arithmetic estimates: difficult topics, exams, feedback and recruitment add variation. A five-week sprint can establish foundations but should not be treated as a guaranteed path from beginner to employment.

## 2. The target and technology choices

A junior backend developer should be able to take a small requirement, clarify it, implement it, test it, use source control and explain the result. You are preparing to do that with guidance from a team.

| Area | Default choice | What you need to do with it |
|---|---|---|
| Language/runtime | C# with .NET 10 LTS | Write and debug maintainable applications |
| Editor | Your existing Visual Studio installation compatible with .NET 10 | Navigate code, inspect variables and run tests |
| Source control | Git locally, GitHub remotely | Use commits, branches and pull requests |
| Database | SQL Server Developer for local development | Model relationships and write SQL |
| Data access | EF Core 10 with a compatible SQL Server provider | Query data and manage schema changes |
| Web | ASP.NET Core, starting with controllers | Build HTTP APIs; later read Minimal APIs |
| Tests | One framework, such as xUnit | Check business rules and API/database behavior |
| Delivery | GitHub Actions and Docker Compose | Build/test automatically and reproduce local setup |
| Hosting | One suitable Azure deployment | Publish, configure and diagnose a working app |
| Optional UI | Razor Pages | Demonstrate the backend with a small usable interface |

.NET 10 is an LTS release supported until 14 November 2028. .NET 8 and 9 reach end of support on 10 November 2026, so use .NET 10 for new work and keep its patches current. Existing employers may use older versions. See the [official support policy](https://dotnet.microsoft.com/en-us/platform/support/policy).

Use one database for your main project. SQLite is fine for a short introductory EF tutorial, but it has different behavior from SQL Server; return to your chosen database for the flagship and its integration tests.

### Essential, later and optional

**Essential before serious junior interviews:** C# fundamentals, collections, methods, basic object design, debugging, Git, SQL, HTTP, ASP.NET Core, EF Core, asynchronous I/O, tests and basic authorization.

**Useful as you apply:** Docker, CI, deployment, reading unfamiliar code, English technical communication and a small UI.

**Learn when target advertisements or your employer require it:** Angular/React, Azure DevOps, .NET Framework, WPF, messaging, caching and particular architecture patterns.

**Defer:** Kubernetes, microservices, event sourcing, elaborate CQRS, advanced DDD, multiple cloud providers and certification collecting. These are not prerequisites for the project described here.

This is a backend learning recommendation, not a statistical survey of Polish vacancies. You will use a small sample of current advertisements to refine priorities in weeks 2, 20 and 32.

## 3. How to study

### A repeatable 12-hour week

| Activity | Hours |
|---|---:|
| Documentation or one selected course | 2 |
| Building the current feature | 6 |
| Testing, debugging and refactoring | 2 |
| Recall practice and explaining code aloud | 1 |
| Career work, peer feedback and weekly planning | 1 |
| Total | 12 |

Once applications begin, move two hours from feature development into applications and interviews. These activities stay inside the weekly budget.

For a 90-minute session: recall yesterday's lesson for 10 minutes, study one idea for 20 minutes, implement it for 45 minutes, and spend 15 minutes checking, explaining and recording the result.

### The learning loop

1. Write what the feature should do, including one failure case.
2. Predict the result of a small example.
3. Implement a first attempt.
4. Run it with normal, boundary and invalid inputs.
5. Inspect any failure with a breakpoint or useful log.
6. Explain why the corrected code works.
7. Commit one meaningful change.
8. Rebuild a smaller version the next day from memory.

Read documentation while coding; you do not need to memorize every method. Independence means choosing and explaining a solution with reference material, not working without references.

### Using AI as a tutor

Ask for a hint, explanation, counterexample or review before asking for a complete implementation. For example: “Here is my loop and the input that breaks it. Give me one hint and ask me to predict the next iteration.”

When you use a suggested solution, explain each changed line and reproduce the idea in a different example. In each phase, complete the assessment without generated code. This gives you an honest measure of what you can do during an interview.

### When you get stuck

After 20–30 focused minutes, write down expected behavior, actual behavior, exact error and the smallest reproducing example. Consult the relevant resource, ask for a hint or get a peer review. Record the cause once solved.

If a phase assessment fails, spend the next two sessions on its failed behaviors. Retest with a different example. If it still fails, reduce the feature and seek feedback. Shift subsequent weeks; do not rush through prerequisites to preserve a date.

During exams, keep two short recall/coding sessions each week and resume the normal pace afterward. Missing a week does not mean restarting the roadmap.

### Where the Bro Code video fits

Use [C# Full Course for free](https://www.youtube.com/watch?v=wxznTygnRfQ) as a companion in weeks 1–8. The chapter times below come from the outline previously inspected in this conversation. The earlier video notes remain a separate reference; this roadmap does not depend on treating them as a complete verified transcript.

| Study block | Video chapters | Apply the ideas |
|---|---|---|
| Weeks 1–2 | 1–17: setup through nested loops; 00:00–01:18:28 | Input validation and repeating menus |
| Weeks 3–4 | 18–30: games, arrays, methods, exceptions; 01:18:28–02:25:23 | Build and refactor a calculator |
| Weeks 5–6 | 31–39: classes through objects as arguments; 02:25:23–03:05:15 | Model orders and items |
| Weeks 7–8 | 40–49: overriding, interfaces, lists, properties, generics; 03:05:15–03:52:56 | Test business rules and save data |
| Week 12 | 50: threading, from 03:52:56 | Compare threading with asynchronous I/O |

Modern console templates can omit an explicit `Main` method through top-level statements. Your existing `Program`/`Main` style is also valid. Modern practice adds `TryParse`, nullable-reference handling and async I/O to the course's foundations. Salary figures or installation screens in an older video should not guide current decisions.

## 4. Your first seven days

This first week overlaps phase A. Do not add it as an extra week.

### Day 1 — Diagnose and locate your project, 2 hours

Run the diagnostic. In your existing `Practice` directory, use `Get-Location`, `Get-ChildItem` and `dotnet sln .\Practice.slnx list`. Find `week-2-practice`; identify `Program.cs` and the `.csproj` file. Run the project if your environment permits it. Explain the difference between a folder, project and solution.

### Day 2 — Validate text, 2 hours

Read input, reject blank text and ask again. Test `hello`, an empty line and spaces. Handle end-of-input separately: `ReadLine()` can return `null`, and repeatedly prompting after the input stream closes can create an endless loop. For this exercise, exit on `null` and retry blank strings.

Write a short explanation of why `IsNullOrWhiteSpace` needs an explicit condition and why `?? ""` produces a zero-character string.

### Day 3 — Validate numbers, 2 hours

Use `int.TryParse`, then check the allowed range. Test `42`, `abc`, `0`, `101` and a number too large for `int`. Separate conversion success from your business rule: a parsed integer can still be outside the allowed range.

### Day 4 — Start the calculator, 2 hours

Read two numbers and an operator. Implement addition and subtraction first, then multiplication and division. Use a switch, reject unsupported operators and check division by zero before calculating. Investigate which decimal separator your current culture accepts.

### Day 5 — Repeat, exit and debug, 2 hours

Add Calculate Again and Exit. Check that bad input does not lose control of the menu. Put a breakpoint inside the loop and inspect values through two attempts. Commit the improvement with a descriptive message.

### Day 6 — Rebuild and explain, 2 hours

Recreate the numeric input loop in a fresh scratch exercise without copying. Demonstrate the calculator's normal and failure cases. Write five sentences about what you learned and one question you still have.

### Day 7 — Rest

If you want, explain the loop aloud for five minutes. There is no required seventh study session.

## 5. The complete 40-week plan

The weekly deliverables below are proposed assignments. Completion depends on passing the practical checks, not checking off video chapters. Use the [resource list](#12-resources-and-evidence) selectively; each phase identifies its main references.

### Phase A — Write reliable small programs: weeks 1–4, 48 hours

**Purpose:** understand values, conditions, repetition and methods well enough to solve small problems.

| Week | Learn in order | Deliverable |
|---|---|---|
| 1 | Input/output; strings and null; conditions; loops; `TryParse` | Validating input and calculator first version |
| 2 | Numeric types; integer division; decimal culture; `switch`; `while`/`for`; debugging | Calculator with retry/exit; a grade calculator |
| 3 | Methods; parameters; return values; scope; arrays; `foreach` | Extract calculator operations and input helpers |
| 4 | Lists/dictionaries at an introductory level; normal vs exceptional failures; review | Rebuild an improved expense tracker from requirements |

Use [R2](#r2-c-foundations) as the primary curriculum and the video blocks above as optional demonstrations. Reuse your temperature, rectangle, shipment or expense exercises for variations.

Week 2 career task: find 10 relevant internship/junior advertisements you would actually consider. Record location, student eligibility, language, hours and recurring technical requirements. This is observation, not a reason to add every technology to week 3.

**Completion task:** a menu-driven expense tracker with add/list/remove, positive monetary amounts using `decimal`, totals and graceful exit. Keep data in memory at this stage. Test blank input, text instead of a number, unknown ID and repeated operations.

**Pass:** you can explain the control flow, add a new menu option independently and fix a deliberately introduced boundary bug using the debugger. End-of-input exits rather than causing an infinite prompt loop.

### Phase B — Model a problem and start testing: weeks 5–8, 48 hours

**Purpose:** move from one long `Main` method to understandable objects and testable operations.

| Week | Learn in order | Deliverable |
|---|---|---|
| 5 | Classes, objects, fields, properties, constructors, access modifiers | Start the OrderDesk console project with orders and items |
| 6 | Enums; lists of objects; composition; value/reference behavior; equality basics | Add/remove items and change order status with clear rules |
| 7 | Interfaces when needed; inheritance/virtual methods in small exercises; unit tests | Extract total calculation and test its boundaries |
| 8 | JSON; files; `using`/disposal; specific exceptions; review | Save/reload orders and document the console release |

Use [R3](#r3-types-and-design), [R4](#r4-tests) and [R5](#r5-json-and-files). Start with folders inside one console project plus a test project. Extract a small class library if it gives the tests a clear home for business logic. You do not need five architecture projects to learn classes.

Implement these rules: quantity must be positive; price cannot be negative; an empty order cannot be submitted; cancelled orders cannot be submitted. Define which other status transitions are allowed before coding them.

**Completion task:** add an order, calculate its total, submit it and reload it after a restart. Keep UI code separate from calculation and validation. Test missing and malformed JSON without silently overwriting the user's stored data.

**Pass:** automated tests prove at least six meaningful behaviors, including invalid quantities and empty submission. The count is a planning target; each test needs a reason. Explain why an interface helps at a storage boundary and why every class does not need an interface.

### Phase C — Work confidently with collections and I/O: weeks 9–12, 48 hours

**Purpose:** transform data and call external resources while keeping the code understandable.

| Week | Learn in order | Deliverable |
|---|---|---|
| 9 | Generics, lambdas, `Where`, `Select`, sorting, grouping, aggregates | Order reports by status/customer/month |
| 10 | Deferred execution; list/dictionary/set tradeoffs; basic complexity | Explain and improve one inefficient lookup |
| 11 | HTTP/JSON introduction; `HttpClient`; network failure handling | Small separate HTTP client exercise |
| 12 | `Task`, `async`/`await`, cancellation; async errors; review | Asynchronous load/save or HTTP operations with cancellation |

Use [R6](#r6-linq), [R7](#r7-asynchronous-programming) and [R8](#r8-http-basics). Learn what O(1), O(n) and O(n²) mean through collections you already use. Spend about one hour a week on short string/list/dictionary problems, with explanation and edge cases.

**Completion task:** create a filtered report, explain when its LINQ query executes, then cancel a network request cleanly. Handle an unsuccessful HTTP status and malformed response in the separate client exercise.

**Pass:** explain why async does not automatically create a thread, why `.Result` blocks, and why a dictionary is useful for keyed lookup. You may consult API documentation.

### Phase D — Understand relational data: weeks 13–16, 48 hours

**Purpose:** reason about persistent data before adding an object mapper.

| Week | Learn in order | Deliverable |
|---|---|---|
| 13 | SQL Server setup; tables; primary/foreign keys; constraints; CRUD | OrderDesk schema and fictional seed data |
| 14 | Joins; `NULL`; aggregation; `GROUP BY`; `HAVING` | SQL report queries with expected results |
| 15 | Normalization; transactions; parameterization; decimal/date choices | A transaction exercise and documented schema decisions |
| 16 | Index basics; query plans; review | Diagnose one query and justify an index |

Use [R9](#r9-sql). Work in a development database. Model customers, orders and order items; add products only if you want a real catalog. Store the price agreed at ordering time on the order item so a future catalog-price change does not rewrite order history.

Suggested SQL exercises: customers with no orders; orders with totals; monthly sales excluding cancelled orders; top customers; items belonging to a given order; orders whose totals exceed a threshold. Avoid double-counting caused by joins.

**Completion task:** rebuild the database from committed scripts, produce the reports and demonstrate rollback when one operation in a transaction fails.

**Pass:** write a join and aggregate query independently; explain a foreign key, the effect of SQL `NULL`, and one index tradeoff. Your scripts reproduce the same expected sample results.

### Phase E — Add Entity Framework Core: weeks 17–19, 36 hours

**Purpose:** connect C# objects to your database while understanding the SQL involved.

| Week | Learn in order | Deliverable |
|---|---|---|
| 17 | `DbContext`; provider; entity mapping; relationships; migrations | EF-backed persistence for OrderDesk |
| 18 | Projections; tracking; `AsNoTracking`; loading relationships; pagination | Bounded, sorted data queries with inspected SQL |
| 19 | Database constraints; migrations with existing data; transactions; review | Database integration tests and migration instructions |

Use [R10](#r10-entity-framework-core). Keep EF packages, provider and tooling on compatible stable versions; for this plan use the 10.x family. Pin selected versions through normal project/tool configuration rather than copying a patch number from an old tutorial.

Learn that `DbContext` is not thread-safe. Do not run concurrent operations on the same context. Distinguish a database query (`IQueryable`) from in-memory enumeration (`IEnumerable`), and inspect the generated SQL before guessing performance.

**Completion task:** migrate an existing development database without losing sample orders, then reproduce it from scratch. Verify persistence and constraints using the selected relational engine, not just an in-memory substitute.

**Pass:** demonstrate the migration, an async query with projection/pagination and a failed constraint test. Explain when `SaveChanges` commits changes and where a broader transaction might be needed.

### Phase F — Deliver an HTTP API: weeks 20–24, 60 hours

**Purpose:** expose useful operations through an interface another application can call.

| Week | Learn in order | Deliverable |
|---|---|---|
| 20 | HTTP methods/statuses; routes; controllers; dependency injection | API with a health endpoint and read-only order endpoint |
| 21 | Request/response DTOs; model binding; validation; services | Create order and add item operations |
| 22 | Middleware; configuration; logs; exception responses | Consistent errors and status-change endpoint |
| 23 | OpenAPI; pagination/filtering; cancellation; API clients | Usable documented API with saved `.http` requests |
| 24 | API integration testing; review; first complete vertical feature | Reproducible API/database demonstration |

Use [R8](#r8-http-basics), [R11](#r11-aspnet-core), [R12](#r12-dependency-injection) and [R13](#r13-api-integration-tests).

A vertical feature is a complete small operation: request → validation → business rule → database → response → test. Finish “create an order” this way before creating 20 incomplete endpoints.

Start with controllers, then spend one session rewriting a tiny endpoint as a Minimal API so you can recognize both. Learn transient, scoped and singleton lifetimes through actual dependencies. Do not let a singleton retain a request-scoped context.

**Completion task:** demonstrate create, retrieve, change status and paginated list. Test invalid input, missing order, invalid transition and persistence after restart. Keep database entities separate from externally accepted fields to prevent clients setting internal values.

**Pass:** another person can run the API from your instructions and complete the scenario. You can trace the request and justify the response status. Automated tests cover both successful and failing requests.

Career work: refresh your 10-advertisement sample in week 20 and draft your CV. Start targeted junior applications once this phase passes. Apply earlier to internships explicitly aimed at beginners or students if you meet their eligibility conditions.

### Phase G — Protect data and make behavior dependable: weeks 25–28, 48 hours

**Purpose:** control access, test business behavior and diagnose failures.

| Week | Learn in order | Deliverable |
|---|---|---|
| 25 | Authentication vs authorization; established identity tools | Login using ASP.NET Core Identity or an established provider |
| 26 | Resource ownership; roles/policies; common web threats | User/admin rules and cross-user access tests |
| 27 | Relational API tests; structured logging; concurrency basics | Tests for critical behaviors and stale updates |
| 28 | Secrets/configuration; health checks; review | Security and reliability review with resolved findings |

Use [R13](#r13-api-integration-tests) and [R14](#r14-authentication-and-security). For the optional same-origin Razor Pages interface, Identity cookies are a reasonable starting choice. Learn antiforgery protection for cookie-authenticated state changes. Learn bearer tokens/OIDC conceptually and implement them when a chosen client or employer requires them. Do not build your own token issuer merely to tick a box.

Test with two users: a valid login does not grant access to every order. Enforce ownership on the server, including reads and updates. CORS is a browser-origin mechanism, not an authorization system. Handle secrets with development user-secrets and the hosting platform's supported secret facilities; avoid logging credentials or tokens.

**Completion task:** prove that anonymous users and user B cannot perform user A's restricted actions, while the intended administrator operations work. Simulate an outdated update and give a deliberate response instead of silently losing a change.

**Pass:** you can describe the threat each test covers, explain password hashing at a high level, and locate a failing request in logs without exposing sensitive data.

### Phase H — Build and deploy repeatably: weeks 29–32, 48 hours

**Purpose:** make your work usable outside your development session.

| Week | Learn in order | Deliverable |
|---|---|---|
| 29 | GitHub Actions; restore/build/test; configuration | CI runs on changes and detects a deliberately failing test |
| 30 | Images/containers; ports; volumes; Compose; environment settings | API and database run through documented container setup |
| 31 | Publishing; hosting; HTTPS; production configuration | Public demo or reproducible deployment exercise |
| 32 | Deployment logs; migration/rollback plan; review | Verified setup from a clean checkout and tagged release |

Use [R15](#r15-containers), [R16](#r16-continuous-integration) and [R17](#r17-deployment). The CI job should restore, build and run your actual unit and integration tests. Include the database service/setup needed for the latter rather than quietly skipping them.

Choose a hosting plan only after checking its current cost and your student eligibility. Documentation access is free; cloud resources may cost money. Set a budget alert, remember alerts are not necessarily a spending cap, and remove unused resources. If your budget is zero, keep a recorded demo and reproducible local setup while using an available student/free offer for a short deployment exercise. Do not claim a live demo that is offline.

**Completion task:** a clean environment can follow your README to start the app. CI is green. You can change a configuration value, deploy a small update and explain the process for recovering from a failed release. A database restore may be needed for destructive migrations; application rollback alone is not always enough.

**Pass:** show the deployed or recorded scenario, CI evidence and setup verification. Identify where logs, settings and secrets live.

### Phase I — Make your work easy to assess: weeks 33–36, 48 hours

**Purpose:** improve usability, demonstrate collaboration and prepare hiring evidence.

| Week | Learn in order | Deliverable |
|---|---|---|
| 33 | Basic HTML/forms; Razor Pages; client/server distinction | Minimal create/list/detail/status interface |
| 34 | Code review; pull-request explanation; unfamiliar code | One reviewed contribution with another student or community |
| 35 | README; demo; design decisions; CV evidence | Portfolio landing README and 3–5 minute demo |
| 36 | Timed unfamiliar change; defect repair; review | Completed take-home-style change with tests and explanation |

Use [R18](#r18-a-small-web-interface) and [R19](#r19-git-and-collaboration). If time is tight, a documented `.http` demo can substitute for a polished interface. Keep collaboration authentic: a reviewed student project is sufficient; do not send low-value public pull requests just to accumulate activity.

**Completion task:** ask someone to follow the README without your verbal help. Record what fails and fix it. Add a feature such as a new filter under a two-hour practice limit and explain remaining tradeoffs.

**Pass:** someone else can use and understand the application. Your portfolio descriptions accurately represent your own work and what you learned.

### Phase J — Turn evidence into interviews: weeks 37–40, 48 hours

**Purpose:** assess your readiness, improve weak areas and run a sustainable job search.

| Week | Main work | Deliverable |
|---|---|---|
| 37 | C#/SQL/API mock interview and project walkthrough | Scored answers and three priority gaps |
| 38 | CV/application review; targeted practice | Improved application package and focused submissions |
| 39 | Second unfamiliar task; communication practice | Smaller gap list and one demonstrable project improvement |
| 40 | Final readiness review; next four-week plan | Active application routine or first-job preparation |

Use the interview and readiness sections below. Employment may occur before or after week 40. If you have not received an offer, repeat a four-week cycle of targeted applications, feedback, gap repair and interviews. Add technologies only when there is evidence they address a real gap.

## 6. Your flagship project

### OrderDesk — a small order management system

This is an original practice specification proposed for you. It connects naturally to your existing shipment-quote and expense work, and provides concrete rules to test. It is not intended to process real payments or customer data.

**User story:** a small supplier needs staff to record customer orders, prepare them, mark them dispatched and review totals. Ordinary users see their permitted orders; administrators have explicitly defined broader access.

### Keep the first scope small

Include customers, orders, order items and users. A product catalog is optional. Use fictional data and one currency, PLN. Use `decimal` for amounts and define a rounding policy. Store timestamps consistently; learn `DateTimeOffset` for events and `DateOnly` for date-only requirements.

Suggested status flow: Draft → Submitted → Shipped. Draft and Submitted can be cancelled. Cancelled and Shipped are final for this exercise. Describe the transition rules in the README before implementing them.

Acceptance criteria:

- An order contains at least one item before submission.
- Quantity is positive and unit price is nonnegative.
- Total is calculated on the server from agreed item prices.
- Submitted orders cannot have items edited under the chosen rules.
- Illegal status transitions produce a meaningful failure.
- Listing supports a bounded page size and deterministic sorting.
- Users cannot access orders beyond their authorization.
- Stale updates have a documented concurrency behavior.
- A fresh environment can create the schema and load demo data.
- The README and tests demonstrate the main flow and failure cases.

### Releases

| Release | Target | Evidence |
|---|---|---|
| v0.1 | Week 8: console and JSON | Domain rules, tests and saved data |
| v0.2 | Week 19: relational persistence | Migration and SQL-backed tests |
| v0.3 | Week 24: API | Saved requests and HTTP tests |
| v0.4 | Week 28: identity and reliability | Ownership and failure tests |
| v1.0 | Week 32: reproducible delivery | CI, setup and deployment evidence |
| v1.1 | Week 36: portfolio polish | UI or demo, review and clear README |

Tag releases when they work; calendar dates do not make unfinished releases complete. Introduce architecture as responsibilities appear. A small API project, a business-logic library when useful, and test projects can be enough. EF Core already supplies change tracking and persistence abstractions; a generic repository wrapper is not an automatic requirement.

### Portfolio organization

Continue in your existing `csharp-job-foundation` repository. Keep `Practice` for exercises and add a clearly linked `OrderDesk` folder for the flagship. One well-organized repository is acceptable. A separate flagship repository is optional later if it makes review easier; it is not a hiring requirement.

Your root README should link directly to the flagship and one polished small application, describe your current skills honestly, and say how to run them. Keep incomplete experiments out of the main portfolio presentation while preserving your learning history.

Your flagship README should include purpose, feature scope, screenshots/demo, prerequisites, setup, configuration names, migrations/seed data, running/tests, API examples, data model, three design decisions, limitations and future work. Ask a peer to test the instructions.

## 7. Git, tools and troubleshooting

### Your folder/project/solution distinction

- A folder stores files on disk.
- A `.csproj` file describes one project and its dependencies.
- `Practice.slnx` groups projects for development.
- Adding a project to a solution does not copy it or make other projects reference it.

From your previously supplied directory, create a new exercise only when the name is unused:

```powershell
Set-Location 'C:\Users\damia\Documents\GitHub\csharp-job-foundation\Practice'
Get-Location
Get-ChildItem
dotnet new console -n InputValidationPractice -o .\InputValidationPractice
dotnet sln .\Practice.slnx add .\InputValidationPractice\InputValidationPractice.csproj
dotnet sln .\Practice.slnx list
dotnet run --project .\InputValidationPractice\InputValidationPractice.csproj
```

If the project already exists, skip creation. Verify paths with `Get-ChildItem -Recurse -Filter *.csproj`. The earlier screenshot's wrapped path was misread as containing an `active` directory; your supplied listing did not have one. Do not put a guessed folder into commands.

Use single-line commands while learning PowerShell. Backticks are line-continuation syntax, and Markdown code fences are formatting for messages/documents. Neither belongs in `Program.cs`.

### Git routine

Before work: inspect `git status` and choose a small requirement. Make a feature branch when practicing collaboration. After work: inspect `git diff`, stage intended files, commit the completed change, and push. Use pull requests for review even on a student collaboration.

Use messages such as `Validate order quantity before submission`. Avoid creating arbitrary commits to meet a quota. Exclude generated `bin`, `obj` and `.vs` folders and local secrets; commit source files, project/solution files, migration files and useful documentation.

### Distinguish failure types

| Symptom | First investigation |
|---|---|
| Project file does not exist | Check current directory and actual `.csproj` path |
| Compiler error | Read the first relevant error, filename and line |
| App starts but crashes | Read the exception and use a breakpoint |
| App gives a wrong answer | Reproduce with a tiny input; inspect intermediate values |
| Application Control blocks execution | Identify the responsible Windows policy; this is separate from a C# syntax error |
| API cannot reach database | Check connection configuration, database service and logs |

The previous advice described `UseAppHost=false` as a permanent fix for Application Control. More precisely, it changes how a framework-dependent .NET app is launched; it does not repair or authorize a Windows policy. On a managed machine, use an administrator-approved development setup. On your own machine, diagnose the policy before changing protection settings. See [Microsoft's troubleshooting guide](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/operations/appcontrol-debugging-and-troubleshooting).

## 8. Applications and interviews

### Use evidence from your target market

In weeks 2, 20 and 32, collect about 10–15 recent advertisements from company careers pages, your university careers service or a job board. Keep each URL and date. Separate required skills from optional ones and count repeated requirements. Discard senior roles accidentally mixed into a junior search.

Record: role, company, location/remote constraints, student eligibility, available hours, required technologies, interview format if known, and deadline. Search for internship, graduate, junior C#, junior .NET and Software Engineer I roles. Job titles alone do not establish seniority.

If many viable roles require Angular, add a focused frontend block after your API works. If a role is desktop-focused, recognize that it needs a different extension. Do not interpret one enormous advertisement as the whole market.

### When to start

Start networking and reading requirements early. Apply to suitable internships when their stated requirements fit. Start routine junior backend applications around the phase F gate: a working database-backed API you can explain, basic tests, and a readable CV/README. Continue improving security and delivery while applying; label unfinished features honestly.

Use 4–8 well-matched applications per week as an initial workload target, adjusted to available roles. Spend time understanding each employer and matching truthful evidence to its requirements. Meeting a percentage of a checklist is less useful than meeting the real essentials, eligibility and availability constraints.

### CV and project evidence

Aim for one clear page if your experience fits. Include contact details, education and expected graduation, availability, relevant skills, projects and experience. Link to the flagship and demo. Prepare an English version when the employer works in English.

An honest project bullet could be: “Built an ASP.NET Core order API with SQL Server persistence, ownership checks and automated tests; documented local setup with Docker Compose.” Include a measured improvement only if you recorded the measurement. Do not call portfolio work paid employment.

Practice a five-minute walkthrough: problem → one user flow → relevant code → tests → one tradeoff → next improvement. Be ready to open the code and change a small behavior.

### Interview practice

Spend two short sessions a week on recall and practical tasks from phase C onward.

| Area | Explain | Demonstrate |
|---|---|---|
| C# | Nullability, types, collections, exceptions | Validate input and transform a collection |
| Design | Composition, interfaces, responsibilities | Extract a testable business rule |
| Async | I/O vs CPU work and cancellation | Await an operation and handle failure |
| SQL | Joins, keys, transactions, indexes | Produce a report without double-counting |
| EF Core | Tracking, migrations, query execution | Inspect SQL and query only needed data |
| HTTP | Methods, statuses, request lifecycle | Implement a small endpoint |
| Security | Authentication vs authorization | Explain a cross-user access test |
| Delivery | Branch/PR, CI and configuration | Diagnose a failing build or deployment |

You also need basic data structures and complexity: arrays, lists, dictionaries, sets, stacks/queues and common loops. Learn them through practical examples and short exercises. Increase algorithm practice only if your target interviews require more.

Prepare examples of a difficult bug, a requirement you clarified, feedback you incorporated, a tradeoff and something you learned independently. Practice saying what you know, what you are unsure about and how you would check.

### Diagnose the application funnel every four weeks

- Few callbacks from a meaningful batch of suitable applications: review targeting, CV, availability and portfolio discoverability with another person.
- Calls but repeated technical failures: record the exact topic and practice it with a fresh task.
- Technical progress but no offers: improve project explanation, collaboration examples and role fit; request feedback when appropriate.
- Very few suitable openings: broaden geography, hybrid options, internship timing or adjacent entry roles within your constraints.

These are hypotheses to investigate, not guarantees about why an employer rejected an application. Recruitment can take time even when your preparation is good.

## 9. Readiness and the first job

### A practical assessment

Score each category from 0 to 3: 0 = cannot start; 1 = needs a copied solution; 2 = completes with documentation and occasional hints; 3 = completes independently and explains tradeoffs.

Assess C# fundamentals, object design, SQL, EF Core, HTTP/API, testing, authorization, Git and debugging. Add deployment as a portfolio strength. A useful self-assessment target is at least 2 in each core category, with several 3s. This is a mentoring rubric, not an industry hiring standard.

Use this final exercise: in a small unfamiliar API, add a status filter, validate input, write an integration test and explain the database query. Then reproduce and repair a deliberately introduced bug. Work for 90–120 minutes, record what remains and explain your choices. A clean partial solution with a clear explanation is more useful feedback than pretending everything is complete.

### Your first 30 days at work

Get the development environment running, learn the team's Git/review/deployment process, trace one feature end to end, ask about conventions, and deliver a small fix with tests. Keep concise notes. Clarify requirements and communicate blockers early.

### Days 31–60

Own a small feature with guidance. Break it into reviewable changes, handle feedback, diagnose a real defect and learn how the team observes deployed software. Understand the domain and existing architecture before proposing broad rewrites.

### Days 61–90

Deliver a modest feature through implementation, tests, review and release with the team's support. Ask your manager for specific feedback and choose two next learning goals tied to actual work.

The roadmap has achieved its career purpose when you have secured a suitable role and can contribute reliably with normal junior-level guidance. Getting an offer does not require knowing every technology in the ecosystem.

## 10. Progress templates

Copy these into your repository's notes when useful.

```markdown
## Weekly review — week/date
- Hours planned / completed:
- Feature or exercise completed:
- Evidence: file, commit, PR, test or demo:
- What I can now explain without notes:
- Bug encountered and root cause:
- Phase gate: not attempted / pass / repeat:
- Feedback received:
- Next week's three priorities:
```

```markdown
## Feature brief
- User need:
- Expected successful behavior:
- Invalid input and failure cases:
- Data affected:
- Smallest implementation:
- Tests or verification:
- Completion evidence:
```

```markdown
## Application tracker
| Date | Company / role | URL | Fit and eligibility | CV version | Stage | Follow-up | Feedback |
|---|---|---|---|---|---|---|---|
```

### Phase checklist

- [ ] A: calculator/expense tracker independently implemented
- [ ] B: domain rules, JSON persistence and tests
- [ ] C: LINQ reports and asynchronous I/O
- [ ] D: SQL schema, joins, reports and transactions
- [ ] E: EF persistence, migrations and database tests
- [ ] F: usable API and HTTP tests
- [ ] G: identity, ownership and reliability checks
- [ ] H: CI, reproducible setup and deployment evidence
- [ ] I: readable portfolio, peer review and unfamiliar change
- [ ] J: readiness review and sustained applications

## 11. The reusable master prompt

This is the brief used to structure this roadmap. Reuse it with updated progress and availability to revise the next stage. It is a planning prompt; it does not instruct a tool to modify your repository automatically.

```text
Act as an experienced C#/.NET mentor who understands junior hiring and teaches
beginners patiently. Create a complete, practical learning-to-employment roadmap
in Markdown, then review it for unrealistic scope, missing prerequisites and
conflicting schedules before delivering the final file.

LEARNER
- Student in Poland targeting an internship or junior .NET backend role.
- Windows, Visual Studio, .NET CLI, Git and GitHub.
- Existing repository: csharp-job-foundation, with Practice/Practice.slnx.
- Already created small console exercises; currently learning nullable strings,
  Console.ReadLine, TryParse, conditions, validation loops and methods.
- Uses Bro Code's C# course: https://www.youtube.com/watch?v=wxznTygnRfQ.
- Prefer free resources. Hosting costs must be explicit and optional.
- Default budget: 12 focused hours weekly unless I provide another figure.
- Actual progress, available hours and target jobs: [update these here].

OBJECTIVE
Prepare me to implement, test, explain and deliver small backend features, earn
interviews with credible project evidence, and succeed in my first junior role.
Do not promise a job by a date or mistake course completion for competence.

METHOD
1. Start with what I have demonstrated. Use a short practical diagnostic and
   state assumptions. Preserve relevant prior work and avoid needless setup.
2. Verify current supported .NET choices with official documentation. Link
   directly to relevant free lessons. Distinguish sources from your own advice.
3. Give one coherent main track and a realistic hours budget. Number every
   study week. Explain how to adjust for exams and slower/faster progress.
4. For each phase give prerequisites, learning order, a concrete deliverable,
   realistic edge cases, a pass test and a recovery action if I fail it.
5. Cover fundamentals, nullability, numeric input/culture, collections, methods,
   OOP, composition, LINQ, basic complexity, async/cancellation, debugging, Git,
   tests, SQL, EF Core, HTTP, ASP.NET Core, DI, configuration, logging, security,
   integration testing, Docker, CI and deployment in dependency order.
6. Evolve one bounded business application through console, database, API and
   deployed versions. Define user stories, data, rules, test cases and releases.
   Keep architecture proportional. Make frontend scope optional and small.
7. Introduce tests and debugging early. Distinguish relational integration tests
   from in-memory approximations. Teach server-side ownership authorization.
8. Include current-job-ad sampling as a learner activity; do not invent market
   statistics or claim postings were verified when they were not.
9. Explain when to apply, how to prepare a truthful CV and demo, what to practice
   for interviews, how to diagnose the application funnel, and the first 90 days.
10. Include a seven-day starting plan, weekly routine, progress templates,
    readiness rubric and optional topics to defer.
11. Teach in plain English. Define unfamiliar concepts when introduced. Give
    exercises and hints without turning the roadmap into a copied solution.
12. Keep commands appropriate to my known PowerShell paths. Verify a path before
    using it; never infer folders from wrapped screenshots. Treat Windows policy
    blocks separately from compiler errors and do not prescribe disabling security.

QUALITY REVIEW
- Are weeks/hours consistent and application time included in the budget?
- Does every phase have observable completion evidence?
- Can a beginner tell exactly what to do in their next session?
- Is every major skill used in an exercise, project or assessment?
- Does the project remain achievable by one student?
- Are assumptions, verified facts and recommendations distinguishable?
- Can I recover from failed assessments without restarting the entire course?

OUTPUT
Produce one navigable Markdown file containing the complete roadmap, resources
near their learning phases, the reusable prompt, and a dated assumptions note.
Do not create remote repositories, publish anything or apply for jobs on my
behalf unless separately authorized.
```

## 12. Resources and evidence

The learning sequence, hour allocations, assignments and assessment rubric are mentoring recommendations created for you. The links below provide primary technical references. Core .NET support, beginner C#, EF introductory material, ASP.NET API, integration-test and GitHub CI pages were checked during this revision. Other references are selected official documentation starting points; they are not claims that every lesson or code sample was independently executed.

### R1: Runtime and setup

- [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy) — select a supported runtime and revisit before a major upgrade.
- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0) — install the SDK, which includes development tools.
- [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/) — use a compatible version and relevant workloads.
- [`dotnet sln`](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-sln) — solution/project operations.

### R2: C# foundations

- [Get started with C#, Part 1](https://learn.microsoft.com/en-us/training/paths/get-started-c-sharp-part-1/) — begin here if the diagnostic is difficult; complete its exercises.
- [.NET training collection](https://learn.microsoft.com/en-us/training/dotnet/) — continue the beginner C# sequence selectively.
- [C# documentation](https://learn.microsoft.com/en-us/dotnet/csharp/) — look up a concept while practicing it.
- [Bro Code course](https://www.youtube.com/watch?v=wxznTygnRfQ) — optional visual explanation paired with exercises.

### R3: Types and design

- [Object-oriented programming](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop) — classes and relationships; implement a small model afterward.
- [Nullable reference types](https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references) — connect compiler warnings to your input examples.

### R4: Tests

- [.NET testing overview](https://learn.microsoft.com/en-us/dotnet/core/testing/) — choose one framework and follow its supported setup.
- [Unit-test practices](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices) — focus on readable behavior tests.

### R5: JSON and files

- [System.Text.Json serialization](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/how-to) — save and restore a small object model.

### R6: LINQ

- [Introduction to LINQ queries](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries) — apply filtering, projection and grouping to your data.

### R7: Asynchronous programming

- [Async and await](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/) — read alongside a small I/O exercise.
- [Async scenarios](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/async-scenarios) — distinguish CPU work from waiting for I/O.

### R8: HTTP basics

- [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — requests, responses and headers.
- [Making HTTP requests in .NET](https://learn.microsoft.com/en-us/dotnet/fundamentals/networking/http/httpclient) — implement your client exercise.

### R9: SQL

- [Querying with Transact-SQL](https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/) — selected modules on filtering, joins and grouping.
- [T-SQL introductory tutorial](https://learn.microsoft.com/en-us/sql/t-sql/tutorial-writing-transact-sql-statements) — first database operations; expand with the exercises in phase D.

### R10: Entity Framework Core

- [First EF Core application](https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app) — short introduction using SQLite, then adapt to the main database.
- [EF Core documentation](https://learn.microsoft.com/en-us/ef/core/) — consult relationships, migrations and query guidance as needed.

### R11: ASP.NET Core

- [Controller-based API tutorial](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0) — learn the basic request/response cycle, then implement your own feature.
- [ASP.NET Core fundamentals](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/?view=aspnetcore-10.0) — configuration, hosting and middleware.
- [OpenAPI overview](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0) — describe your API; generation and a visual UI are separate choices.

### R12: Dependency injection

- [.NET dependency injection tutorial](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/usage) — practice lifetimes using small services.

### R13: API integration tests

- [ASP.NET Core integration tests](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0) — exercise HTTP behavior through a test host and controlled dependencies.

### R14: Authentication and security

- [ASP.NET Core security](https://learn.microsoft.com/en-us/aspnet/core/security/?view=aspnetcore-10.0) — follow relevant authentication, authorization and secret-storage topics.
- [Introduction to Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0) — established user management for the proposed web application.

### R15: Containers

- [ASP.NET Core in Docker](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-10.0) — containerize the web application.
- [Docker Compose introduction](https://docs.docker.com/compose/gettingstarted/) — understand services, configuration and persistence.

### R16: Continuous integration

- [Build and test .NET with GitHub Actions](https://docs.github.com/en/actions/tutorials/build-and-test-code/net) — adapt the workflow to your real solution and test dependencies.

### R17: Deployment

- [ASP.NET on Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore) — follow the relevant ASP.NET Core route; review the selected tier's cost before creating resources.

### R18: A small web interface

- [Razor Pages tutorial](https://learn.microsoft.com/en-us/aspnet/core/tutorials/razor-pages/razor-pages-start?view=aspnetcore-10.0) — learn only enough to demonstrate your primary workflows.

### R19: Git and collaboration

- [Pro Git](https://git-scm.com/book/en/v2) — chapters 1–3 cover the core workflow; use later chapters as reference.
- [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world) — practice repository, branch and pull-request concepts.

Your next action: complete day 1's diagnostic and choose the first failed behavior to practice. The next successful step is a small program you can explain, run and change yourself.
