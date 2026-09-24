// Original introductory study guides, not a university syllabus or exam prediction.
// Titles preserve the student's Polish course list; explanations are in English.
const sources = {
  csharp: ['Microsoft Learn · C# documentation', 'https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/'],
  network: ['MDN · How the Internet works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'],
  os: ['Operating Systems: Three Easy Pieces · free textbook', 'https://pages.cs.wisc.edu/~remzi/OSTEP/'],
  algorithms: ['MIT OpenCourseWare · Introduction to Algorithms', 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/'],
  server: ['Ubuntu Server · administration documentation', 'https://ubuntu.com/server/docs/'],
  security: ['NIST · Cybersecurity Framework', 'https://www.nist.gov/cyberframework'],
  privacy: ['UODO · principles of personal-data processing (Polish PDF)', 'https://uodo.gov.pl/file/4400'],
  ip: ['WIPO · Copyright FAQ', 'https://www.wipo.int/en/web/copyright/faq-copyright'],
  business: ['Biznes.gov.pl · before registering a business (Polish)', 'https://biznes.gov.pl/pl/portal/00120'],
  ml: ['Google · Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course/'],
  web: ['MDN · Learn web development', 'https://developer.mozilla.org/en-US/docs/Learn_web_development'],
  access: ['W3C WAI · accessibility tutorials', 'https://www.w3.org/WAI/tutorials/'],
  database: ['PostgreSQL · relational database tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'],
  iot: ['Arduino · learning documentation', 'https://docs.arduino.cc/learn/'],
  portal: ['WordPress · Advanced Administration Handbook', 'https://developer.wordpress.org/advanced-administration/']
};
const courses = [
  {
    id:'programming', title:'Podstawy programowania', english:'Programming fundamentals', family:'Foundations', weeks:[1,3,5], related:['algorithms','software-engineering'], resources:['csharp'],
    before:'No programming prerequisite. Be comfortable opening files and running your existing console project.',
    overview:'Learn to translate a small requirement into instructions a computer can execute. C# is your practice language, but these ideas transfer to other languages.',
    points:[
      'Values, variables and types (wartości, zmienne, typy): a variable names stored data; its type determines allowed values and operations. Distinguish int, decimal, bool, char and string.',
      'Expressions and assignment: an expression calculates a value; = stores one and == compares two. Predict integer division before running it.',
      'Control flow (sterowanie): if and switch choose branches; while, for and foreach repeat work. Every input loop needs a deliberate retry and exit path.',
      'Methods (metody): divide work into named operations with parameters and return values. Printing a result is different from returning it.',
      'Input validation: parsing checks whether text can become a number; range checks enforce your rules. Null, empty text and whitespace are different cases.',
      'Debugging and tests: a compiler catches language errors, not every logic error. Use breakpoints, normal inputs, boundary inputs and failure cases.'
    ],
    practice:['Write a repeating calculator that exits cleanly when the user requests it or input ends.', 'Extract a ReadNumber helper; reject unsupported operators and division by zero.', 'Test blank text, abc, negative numbers and repeated calculations; explain one bug you fixed.'],
    questions:[['Why does 5 / 2 produce 2 in C#?','Both operands are integers; the operation uses integer division. Use an appropriate non-integer operand when fractions matter.'],['Why is an empty string not automatically invalid?','Invalidity depends on your rule; an explicit condition such as IsNullOrWhiteSpace performs the check.'],['What makes a method reusable?','A focused purpose, clear inputs and output, and limited dependence on unrelated state.']],
    mistake:'Copying a working solution without tracing its variables. Explain one loop iteration on paper before marking this guide reviewed.'
  },
  {
    id:'network-basics', title:'Podstawy sieci', english:'Networking fundamentals', family:'Systems & networks', weeks:[11,20], related:['advanced-networks','server-basics'], resources:['network'],
    before:'Basic computer use. Learn binary place values before doing subnet exercises.',
    overview:'Understand how computers exchange data and why a request can fail at different layers. The Internet is the network infrastructure; the Web is one service built on it.',
    points:[
      'Layers and encapsulation: applications send data through transport, internet and link mechanisms. Each layer adds information needed for delivery; OSI is a conceptual model, not a literal inventory of every implementation.',
      'Switch versus router: a switch forwards link-layer frames within a LAN; a router forwards IP packets between networks.',
      'Addressing: a MAC address serves a link-layer role; an IP address identifies an interface in an IP network. A subnet prefix separates network and host portions.',
      'TCP and UDP: TCP provides an ordered byte stream with reliability mechanisms. UDP provides datagrams without built-in delivery guarantees; applications may add their own reliability.',
      'DNS, DHCP and ports: DNS resolves names, DHCP can supply network configuration, and transport ports help identify application endpoints.',
      'Troubleshooting: distinguish link failure, addressing, routing, name resolution, transport reachability and application errors. A failed ping alone does not prove a server is down.'
    ],
    practice:['Draw the path from your browser through your router to a website; label DNS, IP and the web service.', 'Inspect your own computer’s IP configuration and DNS lookup results. Do not change a school or shared network.', 'Create a fault table: wrong DNS server, disconnected cable, closed service port. State which evidence distinguishes them.'],
    questions:[['Does DNS assign your computer an IP address?','No. DNS resolves names; DHCP commonly supplies host network configuration.'],['Why does reaching an IP not prove a website works?','The application, name, TLS configuration or requested route may still fail.'],['Is a port the same as an IP address?','No. IP identifies a network endpoint/interface; a transport port helps select a service endpoint.']],
    mistake:'Treating every connection problem as a DNS problem. Investigate one layer at a time using your own devices or an authorized lab.'
  },
  {
    id:'os-basics', title:'Podstawy systemów operacyjnych', english:'Operating-system fundamentals', family:'Systems & networks', weeks:[2,8], related:['operating-systems','server-basics'], resources:['os'],
    before:'Know what files, folders and installed programs are.',
    overview:'An operating system manages hardware resources and provides services to applications. Start with what you can observe on your computer before studying internal scheduling algorithms.',
    points:[
      'Kernel and user space: the kernel performs privileged resource management; normal applications run with restricted access and request services through system calls.',
      'Program versus process: a program is stored instructions; a process is a running instance with resources such as memory and handles.',
      'Threads: execution paths within a process share its address space. Several threads can make coordination necessary.',
      'Memory: RAM holds active data; virtual memory gives processes managed address spaces. Storage capacity is not the same thing as available RAM.',
      'Files and permissions: paths locate data, while access rules decide who may read or modify it. Relative paths depend on the working directory.',
      'Shell and system tools: a shell accepts commands; a GUI presents graphical controls. Process lists, logs and file metadata are evidence when diagnosing failures.'
    ],
    practice:['Run your console app and locate its process in Task Manager. Observe CPU and memory without terminating unrelated processes.', 'Use Get-Location and Get-ChildItem to explain an absolute versus relative project path.', 'Create a disposable folder and document file properties, ownership and access; do not change permissions on system folders.'],
    questions:[['Can one program have several processes?','Yes. Several running instances can use the same stored program.'],['Why can a relative path work in one terminal and fail in another?','The terminals may have different working directories.'],['Why are kernel operations privileged?','They control shared hardware and isolation that ordinary applications must not arbitrarily bypass.']],
    mistake:'Assuming administrator access is the normal fix for every failure. First verify the path, operation and exact error.'
  },
  {
    id:'algorithms', title:'Algorytmy i struktury danych', english:'Algorithms and data structures', family:'Foundations', weeks:[3,9,10], related:['programming','ai'], resources:['algorithms'],
    before:'Variables, loops, methods and arrays; basic mathematical reasoning.',
    overview:'Choose a way to organize data and a sequence of steps that solves a problem correctly. Explain both correctness and how resource use grows with input size.',
    points:[
      'Complexity: Big O describes a growth bound, not exact milliseconds. Consider both time and extra memory, and distinguish worst-case from average behavior.',
      'Arrays and linked structures: contiguous indexing and node links support different access and update tradeoffs. Linked-list insertion is not constant-time if you first need to search for the position.',
      'Stacks, queues and hash tables: use last-in-first-out, first-in-first-out or key lookup according to the problem. Hash-table performance depends on hashing and collisions.',
      'Trees and graphs: a tree models a hierarchy; a general graph models connections. Traversal must account for revisits and cycles where relevant.',
      'Search and sort: binary search requires an appropriate ordered search space. Understand linear search, comparison sorting and what a stable sort preserves.',
      'Problem-solving patterns: recursion reduces a problem to smaller cases; greedy choices need justification; dynamic programming reuses solutions to overlapping subproblems.'
    ],
    practice:['Implement linear and binary search over a sorted integer array; test empty input, one element and missing targets.', 'Trace a stack and queue by hand, then use each in a small C# example.', 'Solve a small graph with BFS and DFS. Write why your visited tracking prevents repeated work and state complexity.'],
    questions:[['Can you use ordinary binary search on unsorted data?','No; the ordering invariant that lets you discard half the search space is missing.'],['When does BFS give shortest paths?','In an unweighted graph, or when every edge has the same cost, by number of edges.'],['Does O(n) always run faster than O(n log n)?','Not for every concrete input; constants and input size matter, although growth differs.']],
    mistake:'Memorizing templates without identifying their preconditions. Keep a counterexample for every pattern you learn.'
  },
  {
    id:'server-basics', title:'Podstawy systemów serwerowych', english:'Server-system fundamentals', family:'Systems & networks', weeks:[22,30,31], related:['network-basics','operating-systems','portals'], resources:['server'],
    before:'Basic networking, operating-system concepts and command-line navigation.',
    overview:'A server provides services to clients. Learn how a service starts, receives requests, stores data and recovers from failure in a disposable local environment.',
    points:[
      'Server roles: web, database, file and directory services solve different problems, even when some run on the same machine.',
      'Services and daemons: background processes are managed through start, stop, restart and startup configuration. A running process is not proof that its service is healthy.',
      'Accounts and permissions: use a limited service identity and restrict administration. Avoid making every service run with full privileges.',
      'Configuration and logs: distinguish software binaries, environment-specific settings, secrets and diagnostic events. Record configuration changes.',
      'Virtualization and containers: virtual machines virtualize hardware environments; containers isolate workloads while sharing a host kernel. Their isolation and management differ.',
      'Availability and recovery: monitor service behavior, patch deliberately and test restoration. RAID and snapshots are not automatically independent backups.'
    ],
    practice:['Use an instructor-provided VM or a local test environment to run a simple web service bound for local use.', 'Document the service port, start command, log location and configuration file. Stop and restart only your test service.', 'Back up a test configuration and data file, restore into a new test location, and prove the service still works.'],
    questions:[['Why is a limited service account useful?','It reduces what an exploited or faulty service can access or change.'],['Why test a backup?','A backup is useful only if the required data and configuration can actually be restored.'],['Does “process running” imply “service working”?','No. It may be unhealthy, misconfigured or unable to reach dependencies.']],
    mistake:'Practicing directly on a production server. Keep exercises local, disposable and free of real credentials.'
  },
  {
    id:'data-security', title:'Wstęp do bezpieczeństwa danych', english:'Introduction to data security', family:'Security & professional practice', weeks:[25,26,28], related:['security-management','information-ip'], resources:['security','privacy'],
    before:'Basic files, networks and application input/output.',
    overview:'Protect information against inappropriate disclosure, alteration and loss. Start with the data and the threat, then choose a proportionate control.',
    points:[
      'CIA triad: confidentiality limits disclosure, integrity protects correctness, and availability keeps authorized access possible. A control can affect more than one goal.',
      'Threat, vulnerability and risk: a threat can cause harm; a vulnerability makes harm possible; risk considers consequences and likelihood in context.',
      'Identity and access: authentication establishes identity; authorization limits actions. Apply least privilege and verify access at the server, not just in the UI.',
      'Encryption, hashing and encoding: encryption protects data using keys; cryptographic hashing produces a digest; encoding changes representation. Base64 is not encryption.',
      'Data lifecycle: collect only necessary personal data, define its purpose, control access and plan retention and deletion. Rules depend on context and applicable law.',
      'Resilience and safe handling: protect credentials, keep software updated, recognize phishing, maintain recoverable backups and report incidents through the agreed process.'
    ],
    practice:['Invent a fictional student-record system and list its data, owners and permitted readers.', 'Choose three threats and map each to a preventive control, a detection method and a recovery action.', 'Write a safe handling checklist for your portfolio: no real student records, passwords, tokens or private logs in Git.'],
    questions:[['Does Base64 protect a secret?','No. It is reversible encoding without a secret key.'],['Is login enough to protect every order?','No. Each operation still needs authorization, including resource ownership checks.'],['How can a backup fail confidentiality?','An unprotected copy can expose the same sensitive data as the original.']],
    mistake:'Inventing cryptographic algorithms or testing attacks on other people’s systems. Use established tools and only authorized, isolated learning environments.'
  },
  {
    id:'advanced-networks', title:'Zaawansowane sieci komputerowe', english:'Advanced computer networks', family:'Systems & networks', weeks:[20,26,30], related:['network-basics','server-basics'], resources:['server','network'],
    before:'IP addressing, subnets, routing, DNS, TCP and UDP from Podstawy sieci.',
    overview:'Build on basic connectivity to reason about segmentation, routing decisions, reliability and observability. Exact protocols and vendor tools depend on your lecturer’s lab.',
    points:[
      'Subnet planning and IPv6: calculate prefixes and address ranges; distinguish address assignment from routing. IPv6 is not simply IPv4 with longer printed addresses.',
      'VLANs and inter-VLAN routing: separate link-layer broadcast domains; communication across them requires routing and appropriate access rules.',
      'Routing decisions: compare static routes with dynamic protocols, next hops and longest-prefix matching. Learn why route advertisements and policies affect reachability.',
      'Redundancy and convergence: a backup path is useful only when failure is detected and forwarding adapts. Test recovery behavior, not just normal connectivity.',
      'Transport behavior: loss, latency, congestion and MTU affect applications differently. Retransmissions and timeout choices influence apparent responsiveness.',
      'VPNs, filtering and observation: tunnels connect networks or users; firewall rules limit traffic; packet captures provide evidence. Capture only traffic you are authorized to inspect.'
    ],
    practice:['In a simulator or instructor lab, design two subnets and an explicit rule describing which services may communicate.', 'Predict a packet’s route, then compare with the lab’s routing and forwarding information.', 'Disable one simulated link and record whether communication recovers, how long it takes and what logs explain it.'],
    questions:[['Does a VLAN automatically authorize traffic to another VLAN?','No. Routing enables a path; access policy must still decide what is allowed.'],['Why does a more-specific route matter?','Longest-prefix matching selects the matching route with the longest network prefix.'],['What should a failover test record?','Detection, interruption, convergence and whether the resulting path still enforces the intended policy.']],
    mistake:'Treating NAT as a complete security policy. Address translation and authorization are different responsibilities.'
  },
  {
    id:'information-ip', title:'Technologie informacyjne i ochrona własności intelektualnej', english:'Information technology and intellectual-property protection', family:'Security & professional practice', weeks:[1,35], related:['business','data-security'], resources:['ip','privacy'],
    before:'Basic document, spreadsheet and web use. No legal training assumed.',
    overview:'Use digital tools responsibly and distinguish technical ability to copy something from permission to use it. This is educational orientation, not individualized legal advice.',
    points:[
      'Information literacy: check who created a source, its date, evidence and intended audience. A convincing layout or generated answer is not proof of accuracy.',
      'Digital work: choose document, spreadsheet, presentation and collaboration tools for the task; organize versions and accessible export formats.',
      'Copyright (prawo autorskie): protectable expression and underlying ideas are different concepts. Software and creative assets can carry rights even when easy to download.',
      'Licenses (licencje): permission has conditions. Read attribution, distribution and modification terms before reusing code, fonts, images or datasets.',
      'Other rights: trademarks concern signs identifying goods or services; patents and trade secrets address different forms of protection. Do not treat all intellectual property as copyright.',
      'Academic integrity and personal data: cite your sources and disclose assistance when required by your course. Attribution alone does not replace permission or a valid basis for handling personal data.'
    ],
    practice:['Create an asset register for a fictional portfolio: source, author, license, required notice and permitted use.', 'Compare two supplied licenses and write questions rather than assuming “free download” means unrestricted use.', 'Produce a short report with source citations, accessible headings and a clear record of your own contribution.'],
    questions:[['Does citing an image automatically permit using it?','No. Attribution and permission are separate questions.'],['Is publicly visible source code necessarily open source?','No. You need to inspect the license and applicable terms.'],['What should you do if a license is unclear?','Find authoritative terms or ask the rights holder; seek qualified advice for a consequential use.']],
    mistake:'Copying a tutorial, font or dataset into a public project without recording its license. Check current local rules for real legal decisions.'
  },
  {
    id:'operating-systems', title:'Systemy operacyjne', english:'Operating systems · deeper mechanisms', family:'Systems & networks', weeks:[10,12,27], related:['os-basics','server-basics'], resources:['os'],
    before:'Processes, threads, files, permissions and virtual memory from the introductory OS subject.',
    overview:'Study how an operating system shares resources safely and efficiently. This guide develops mechanisms and tradeoffs instead of repeating basic desktop usage.',
    points:[
      'CPU scheduling: compare response time, throughput, fairness and waiting. Trace simple scheduling policies using process arrival and execution times.',
      'Concurrency: a race occurs when an outcome depends on uncontrolled interleaving. Mutual exclusion protects a critical section; coordination must include every relevant access.',
      'Deadlock: tasks can wait indefinitely for resources held by each other. Study mutual exclusion, hold-and-wait, no preemption and circular wait, and how prevention breaks conditions.',
      'Address translation: page tables map virtual addresses; a TLB caches translations. A page fault requires OS handling but does not always mean reading from disk.',
      'Memory management: allocation, paging and replacement balance overhead and locality. Virtual-memory size is not a promise of unlimited physical memory.',
      'File systems and I/O: directories, metadata, caching and persistence must remain consistent. A completed buffered write is not always proof of durability after sudden power loss.'
    ],
    practice:['Trace three processes under two simple scheduling policies and compare their waiting times.', 'On paper, interleave two read-increment-write operations on the same counter; show how an update can be lost.', 'Create a toy page-reference sequence and simulate a replacement policy. Keep this as a model, not a claim about every modern OS.'],
    questions:[['Why can two increments lose an update?','Both operations can read the same old value before either writes its result.'],['Does await always start a new thread?','No. Asynchronous waiting and creating threads are different mechanisms.'],['How can a consistent lock order help?','It can prevent a circular wait among those locks, removing one deadlock condition.']],
    mistake:'Using timing delays as a substitute for correct synchronization. A race can disappear in a debug run and still remain in the program.'
  },
  {
    id:'ai', title:'Sztuczna inteligencja', english:'Artificial intelligence', family:'AI & data', weeks:[10], related:['algorithms','machine-learning'], resources:['algorithms','ml'],
    before:'Programming, algorithms and basic probability. Check whether your course uses Python or another language.',
    overview:'AI studies systems that select actions, solve problems or make predictions. Machine learning is one approach within AI, not a synonym for all of it.',
    points:[
      'Agents and environments: define what a system can observe, which actions it can take and how success is measured before choosing an algorithm.',
      'State-space search: represent possible situations as states and actions as transitions. BFS, DFS and informed search differ in memory use and guarantees.',
      'Heuristics: an estimate can guide search. A* optimality depends on conditions involving the heuristic, costs and implementation; “uses a heuristic” does not mean “always optimal.”',
      'Knowledge and reasoning: rules, logical statements and constraints provide explicit representations; consistency and missing information affect conclusions.',
      'Uncertainty and learning: probabilistic reasoning handles incomplete evidence, while learning fits patterns from examples. Predictions need measured evaluation.',
      'Responsible AI: assess biased outcomes, privacy, robustness and human oversight. A fluent generative model response may contain invented facts and should be checked.'
    ],
    practice:['Define a small maze: states, legal moves, goal and path cost.', 'Trace BFS and a heuristic-guided approach on the same maze; compare explored states and result quality.', 'Write a model/system card for a fictional AI assistant: intended task, failure modes, evaluation and when a human must decide.'],
    questions:[['Is every AI system trained on examples?','No. Some use explicitly specified rules, search or planning.'],['What is a heuristic?','A problem-specific estimate that guides a decision or search; its properties determine what guarantees are possible.'],['Why is a persuasive answer not sufficient evidence?','Fluency does not establish correctness, provenance or suitability for a particular decision.']],
    mistake:'Beginning with a complex model before defining the problem and a simple baseline. AI is an optional specialization alongside your core .NET job path.'
  },
  {
    id:'security-management', title:'Zarządzanie bezpieczeństwem informacji', english:'Information-security management', family:'Security & professional practice', weeks:[26,28,32], related:['data-security','business'], resources:['security','privacy'],
    before:'CIA, threats, access control and data handling from introductory security.',
    overview:'Manage security as an ongoing organizational responsibility. Technical controls need owners, policies, evidence, budgets and review—not just installation.',
    points:[
      'Assets and ownership: identify valuable information, supporting systems and accountable people. Missing ownership makes controls hard to maintain.',
      'Risk assessment: describe a threat scenario, affected assets, likelihood and impact. A numeric score is a prioritization aid, not an exact prediction.',
      'Risk treatment: reduce, avoid, share or accept risk according to context; assign an owner and review date. Residual risk remains after controls.',
      'Policies and procedures: policy states expected behavior; procedures explain repeatable actions. Training and evidence matter more than an unread document.',
      'Incident response and continuity: prepare roles, communication, containment, recovery and lessons learned. RTO concerns restoration time; RPO concerns acceptable data loss measured in time.',
      'Governance and improvement: use audits, exercises and meaningful measures to review effectiveness. NIST’s framework connects governance with identifying, protecting, detecting, responding and recovering.'
    ],
    practice:['Build a five-row risk register for a fictional university club portal: scenario, likelihood, impact, treatment, owner and review date.', 'Write a one-page account-offboarding procedure with evidence that access was actually removed.', 'Run a paper incident exercise for an exposed test credential; describe containment, recovery, communications and prevention.'],
    questions:[['Is accepting risk the same as ignoring it?','No. Acceptance should be deliberate, authorized, documented and reviewed.'],['How do RTO and RPO differ?','RTO targets restoration time; RPO describes a tolerable recovery point or data-loss window.'],['Does a policy prove compliance or security?','No. You need appropriate implementation and evidence; actual obligations depend on the situation.']],
    mistake:'Claiming certification or legal compliance from completing a checklist. Your guide is a learning exercise, not an audit.'
  },
  {
    id:'typography', title:'Podstawy typografii i składu komputerowego', english:'Typography and desktop-publishing fundamentals', family:'Web & design', weeks:[33,35], related:['graphics-hci','information-ip'], resources:['web','access'],
    before:'Basic text editing and document formatting.',
    overview:'Arrange text so readers can navigate and understand it. Typography concerns the form and spacing of text; layout organizes the whole page.',
    points:[
      'Typeface and font: a typeface describes a design family; a font is a particular usable instance or resource. Ensure Polish characters such as ą, ł and ź are supported.',
      'Hierarchy: consistent titles, headings, body text and captions communicate importance. Semantic heading structure matters as well as visual size.',
      'Spacing: kerning adjusts specific letter pairs, tracking adjusts spacing across text, and leading or line-height controls distance between lines.',
      'Readability: line length, size, contrast and alignment interact. Long paragraphs in all capitals or very tight spacing make studying harder.',
      'Layout systems: margins, columns and grids create alignment. Paragraph styles help maintain consistency across a long report.',
      'Digital versus print output: screen reflow, selectable text, font licensing, image resolution and print specifications require different checks. Exporting a PDF does not automatically make it accessible.'
    ],
    practice:['Format a two-page course summary with one title, semantic section headings, body text and captions.', 'Compare two line lengths and line-heights with the same paragraph; explain which is easier to read and why.', 'Check Polish glyphs, heading consistency and text selection in the exported document; inspect required print settings with your lecturer.'],
    questions:[['Is making text bold equivalent to a semantic heading?','No. Appearance alone does not communicate document structure to assistive tools.'],['How are kerning and tracking different?','Kerning adjusts selected character pairs; tracking changes spacing across a span of text.'],['Why use paragraph styles?','A shared style makes formatting consistent and allows controlled document-wide changes.']],
    mistake:'Using many decorative fonts to create hierarchy. Establish a small consistent system and verify that licenses permit your use.'
  },
  {
    id:'iot', title:'Internet Rzeczy', english:'Internet of Things (IoT)', family:'Systems & networks', weeks:[11,20,26], related:['network-basics','data-security','web-apps'], resources:['iot'],
    before:'Programming and basic networking. Use a simulator or instructor hardware; buying a kit is not required for this guide.',
    overview:'Connect physical observations or actions to software. An IoT system joins a device, communication path and application, each with its own failure modes.',
    points:[
      'Sensors and actuators: a sensor measures something; an actuator changes something. Sampling, calibration and units determine what measurements mean.',
      'Microcontrollers and computers: constrained devices have limited memory, power and processing. Timing and hardware interfaces matter alongside code.',
      'Digital and analog signals: pins, converters and communication buses connect components. Respect the specific board’s voltage and current limits.',
      'Telemetry and commands: telemetry reports observations; commands request actions. HTTP and publish/subscribe messaging support different communication patterns.',
      'Reliability: timestamps, retries, duplicate messages, missing readings and offline buffering need explicit behavior. Do not treat a missing reading as a valid zero.',
      'Device security: protect identity, credentials, updates and network access. A physically accessible device and its backend both belong in the threat model.'
    ],
    practice:['Simulate a temperature sensor producing timestamped fictional readings; include one missing or invalid reading.', 'Send the readings to a local test API or save them in a file, then display a summary with units.', 'Simulate disconnection and duplicate delivery. Define what is retried, discarded or flagged without controlling real equipment.'],
    questions:[['Is a temperature sensor an actuator?','No. It measures; a heater or motor changes the environment.'],['Why attach units and timestamps?','Values need physical meaning and a time context to be interpreted correctly.'],['Why can retrying cause duplicates?','The receiver may have accepted a message even when the sender did not receive its acknowledgement.']],
    mistake:'Connecting unknown voltages or experimenting with mains electricity. Use only safe instructor-approved low-voltage setups or simulations.'
  },
  {
    id:'business', title:'Zakładanie działalności gospodarczej', english:'Starting a business', family:'Security & professional practice', weeks:[35,38], related:['information-ip','security-management'], resources:['business'],
    before:'Basic arithmetic and spreadsheet use; no business registration is needed for these exercises.',
    overview:'Understand how a technical service becomes a sustainable business. Use a fictional software service for practice; actual registration, tax and insurance choices require current Polish guidance and advice appropriate to your situation.',
    points:[
      'Customer and value proposition: identify who has a problem, what outcome they need and why they would pay. Building a product does not prove demand.',
      'Market validation: compare alternatives and ask about real workflows. Distinguish evidence from compliments about an idea.',
      'Revenue, costs and cash flow: revenue is sales, profit accounts for costs, and cash flow concerns money moving in and out. Late payment can hurt a profitable business.',
      'Pricing and scope: account for development, maintenance, communication and uncertainty. Define deliverables and change handling before promising a fixed price.',
      'Organizational and administrative choices: understand that legal form, registration, activity classification, taxation, accounting and insurance obligations depend on circumstances. Verify details with official Polish services.',
      'Contracts and responsibility: clarify payment, support, intellectual-property permissions, confidential data and termination. A template is not a substitute for understanding obligations.'
    ],
    practice:['Write a one-page fictional offer for maintaining a small website: customer, outcome, scope, exclusions and support.', 'Build a three-month cash-flow model with clearly labeled assumptions, including a late-paying customer.', 'Create a questions list for an accountant or adviser and check the official registration guide without submitting any real application.'],
    questions:[['Can a profitable business run out of cash?','Yes. Payment timing and cash obligations can create shortages despite accounting profit.'],['Why distinguish scope from a vague promise?','Clear scope allows both parties to judge completion and handle changes.'],['Should you register solely to complete this lesson?','No. This is a planning exercise; a real decision needs current information and personal circumstances.']],
    mistake:'Assuming student status automatically removes business obligations or that a turnover figure from an old video is still applicable. No tax rates or eligibility promises are inferred here.'
  },
  {
    id:'machine-learning', title:'Analiza danych/uczenie maszynowe (ML)', english:'Data analysis and machine learning', family:'AI & data', weeks:[9,14], related:['ai','database-design'], resources:['ml'],
    before:'Programming, tables, descriptive statistics, basic probability and algebra. Use the language and tools selected by your course.',
    overview:'Turn data into defensible findings or predictive models. Data analysis explains observations; machine learning fits patterns that must be evaluated on appropriate unseen data.',
    points:[
      'Question and data quality: define what you want to learn, what a row represents and where data came from. Inspect missing values, duplicates, units and implausible ranges.',
      'Exploratory analysis: use distributions, summary statistics and plots to understand variation. Correlation alone does not establish causation.',
      'Features and labels: features are model inputs; labels are targets in supervised learning. Avoid information unavailable when the prediction will actually be made.',
      'Task and baseline: regression predicts numeric quantities; classification predicts categories; clustering groups examples. Compare a model against a simple baseline.',
      'Splits and leakage: separate training, validation and test roles. Fit preprocessing on training data; use time-aware or group-aware splits when random splitting would leak information.',
      'Evaluation and generalization: choose metrics suited to the cost of errors. Check overfitting, class imbalance, subgroup performance and changing data after deployment.'
    ],
    practice:['Use a small public teaching dataset or fictional data; define one question and create a data dictionary.', 'Inspect missingness and distributions, then write down a simple baseline before fitting anything more complex.', 'Compare results on held-out data with an appropriate metric. Document limitations, potential leakage and one decision you cannot justify from the data.'],
    questions:[['Why not evaluate only on training data?','The model may memorize or overfit examples rather than generalize.'],['Why can accuracy mislead with rare positives?','Predicting the majority class can appear accurate while missing nearly every important positive case.'],['When should a scaler be fitted?','On training data only, then applied consistently to validation/test data without learning from them.']],
    mistake:'Trying many models against the test set until one looks good. That turns the test set into a tuning resource and weakens the final evaluation.'
  },
  {
    id:'web-apps', title:'Aplikacje internetowe', english:'Web applications', family:'Web & design', weeks:[20,21,25,33], related:['network-basics','database-design','portals'], resources:['web','access'],
    before:'Programming basics and how a browser reaches a server.',
    overview:'Build an application with a browser-facing interface and, when needed, a backend. For your career path, connect a small interface to ASP.NET Core rather than learning many frameworks at once.',
    points:[
      'HTML, CSS and JavaScript: HTML provides semantic structure, CSS presentation and layout, and JavaScript interactive behavior. These responsibilities complement each other.',
      'Client and server: browser code is visible and controlled by the user; trusted authorization and business rules belong on the server.',
      'HTTP contracts: method, route, headers, body and status codes describe requests and responses. JSON is a data format, not a database or transport protocol.',
      'Forms and validation: label inputs and describe errors accessibly. Client checks improve usability, but the server must validate independently.',
      'State and identity: cookies, sessions and tokens have different roles. Consider expiration, logout, secure handling and protection against unwanted state changes.',
      'Quality: responsive layouts, keyboard interaction, bounded queries, error states and tests make a demo usable. Loading and empty states need deliberate messages.'
    ],
    practice:['Build an accessible order-entry form with labeled fields and a keyboard-usable submit action.', 'Connect it to a local API with fictional data; show both successful creation and a rejected request.', 'Test blank fields, invalid quantities, a server failure and attempted access to another fictional user’s order.'],
    questions:[['Why repeat validation on the server?','A caller can bypass or modify the browser interface.'],['Is JSON responsible for authorization?','No. It represents data; server-side rules determine allowed operations.'],['What makes an error message useful?','It identifies the problem, relates it to the affected input or action, and suggests a safe next step.']],
    mistake:'Treating a hidden admin button as security. Enforce the rule at the endpoint and test with different users.'
  },
  {
    id:'software-engineering', title:'Inżynieria programowania', english:'Software engineering', family:'Foundations', weeks:[7,24,29,34], related:['programming','web-apps','database-design'], resources:['csharp'],
    before:'Ability to implement and debug a small program; introductory Git.',
    overview:'Deliver software that solves a real requirement and can be maintained by other people. Writing code is one activity within clarification, design, testing, review and operation.',
    points:[
      'Requirements: separate functional behavior from qualities such as reliability and performance. Make ambiguous words like “fast” or “secure” testable in context.',
      'Acceptance criteria: describe observable conditions for completion, including failure cases. A user story is a starting conversation, not a complete specification.',
      'Design and modularity: aim for focused responsibilities and clear interfaces. Abstraction should reduce real complexity rather than add layers without a purpose.',
      'Version control and review: small meaningful commits, branches and explained pull requests make changes easier to inspect and recover.',
      'Testing and CI: combine useful unit and integration tests with automated builds. Tests reduce risk but cannot prove absence of every defect.',
      'Lifecycle and maintenance: plan, implement, evaluate and adapt. Track defects, dependencies, operational behavior and technical debt after the initial release.'
    ],
    practice:['Write a user story and five acceptance criteria for cancelling an order, including forbidden state transitions.', 'Implement a small change with tests and a focused commit; explain what changed and what you deliberately excluded.', 'Ask a peer to review the diff or do a structured self-review, then update documentation and record remaining tradeoffs.'],
    questions:[['What is a non-functional requirement?','A required quality or constraint, such as a specified response-time target or accessibility expectation.'],['Why keep a pull request small?','Reviewers can understand its purpose, verify behavior and spot errors more effectively.'],['Is refactoring the same as adding a feature?','No. Refactoring changes internal structure while aiming to preserve observable behavior.']],
    mistake:'Choosing elaborate architecture before understanding the requirement. Start with a clear, testable vertical feature.'
  },
  {
    id:'graphics-hci', title:'Grafika komputerowa i komunikacja człowiek komputer', english:'Computer graphics and human–computer interaction', family:'Web & design', weeks:[33,35], related:['typography','web-apps'], resources:['web','access'],
    before:'Basic geometry and comfort using graphical applications; HTML/CSS helps with interface exercises.',
    overview:'Understand both how visual information is represented and how people use interfaces. A technically rendered screen can still be confusing or inaccessible.',
    points:[
      'Raster and vector graphics: raster images store pixels; vectors describe geometry. Choose based on content, scaling and output requirements.',
      'Coordinates and transformations: translation, rotation and scaling change position, orientation and size. Transformation order can change the result.',
      'Color and compositing: RGB channels describe screen color; alpha describes opacity in common formats. Contrast and meaning matter more than decoration.',
      'Interaction models: design for user goals, recognizable controls, feedback and recoverable errors. Keep controls consistent and avoid unnecessary memory demands.',
      'Accessibility: support keyboard access, visible focus, meaningful labels and alternatives to visual-only information. Do not communicate status solely through color.',
      'Usability evaluation: observe realistic tasks, note where people hesitate, and improve based on evidence. Your own familiarity is not a substitute for a user test.'
    ],
    practice:['Draw a low-fidelity study-dashboard layout and name the user task served by each control.', 'Compare an icon saved as raster and vector at different scales; explain the observed tradeoff.', 'Ask a classmate to find a topic and record a note without coaching. Record confusion, keyboard obstacles and one improvement.'],
    questions:[['Why can a vector icon scale cleanly?','Its geometry can be rendered again at the target size instead of enlarging a fixed pixel grid.'],['Is red versus green enough to communicate failure and success?','No. Include text or another distinguishable cue as well.'],['Why observe a task instead of only asking whether a UI looks nice?','Task behavior reveals concrete usability barriers that an aesthetic opinion may miss.']],
    mistake:'Making an interface prettier while hiding its main action or weakening contrast. Evaluate clarity and task completion.'
  },
  {
    id:'database-design', title:'Projektowanie systemów baz danych', english:'Database-system design', family:'AI & data', weeks:[13,14,15,17], related:['web-apps','machine-learning'], resources:['database'],
    before:'Programming basics and working with tables. Use SQL Server for your flagship; adapt tutorial SQL when a resource uses PostgreSQL.',
    overview:'Translate business rules into a consistent data model, then query and evolve it safely. Good schema design prevents invalid states rather than relying only on application code.',
    points:[
      'Conceptual modeling: entities describe things you store; attributes describe their properties; relationships connect them. Cardinality states how many can be related.',
      'Keys and constraints: primary keys identify rows, foreign keys constrain references, and uniqueness/check/not-null rules protect agreed invariants.',
      'Normalization: use dependencies to reduce unwanted duplication and update anomalies. Do not split tables mechanically without understanding their meaning.',
      'SQL and NULL: joins combine related rows; aggregates summarize groups. NULL denotes missing/unknown information and ordinary comparisons with it do not behave like comparisons with an empty string.',
      'Transactions and concurrency: related writes may need atomicity; concurrent changes need a defined isolation or conflict-handling approach.',
      'Physical and operational design: appropriate indexes, query plans, migrations, permissions and tested backups support a schema after it is created.'
    ],
    practice:['Draw an ER model for customers, orders and order items; explain each relationship and identify required values.', 'Implement a small schema with fictional seed data and constraints, then write a customer-order report.', 'Attempt an invalid foreign key, duplicate unique value and interrupted multi-step write in a disposable database; document the outcomes.'],
    questions:[['How do primary and foreign keys differ?','A primary key identifies a row; a foreign key constrains a reference to an eligible key.'],['Why can storing a customer’s address in every order create anomalies?','Repeated mutable facts can drift apart; decide whether you need current customer data or a deliberate historical snapshot.'],['Does adding an index always help?','No. It must fit the query and adds storage and write cost.']],
    mistake:'Assuming the ORM makes the schema and SQL irrelevant. Inspect actual constraints and generated queries.'
  },
  {
    id:'portals', title:'Projektowanie i utrzymanie portali internetowych', english:'Designing and maintaining web portals', family:'Web & design', weeks:[28,31,32,33], related:['web-apps','server-basics','graphics-hci'], resources:['portal','access'],
    before:'Web basics, server roles, access control and introductory database concepts.',
    overview:'A portal combines organized content, navigation, user roles and ongoing operation. Publishing the first version is the beginning of maintenance, not the end.',
    points:[
      'Information architecture: organize pages around visitor goals using understandable labels, navigation and search. A folder structure is not automatically a good user-facing structure.',
      'CMS and extensions: a content-management system separates content editing from some implementation tasks. Themes and plugins add capabilities and maintenance obligations.',
      'Editorial workflow: drafts, review, publication, ownership and content expiry keep information trustworthy. Different roles should have different permissions.',
      'Accessibility and discoverability: semantic pages, headings, metadata, usable forms and meaningful links support both people and indexing tools.',
      'Performance and reliability: image sizing, caching, dependency behavior and monitoring influence user experience. A cached page must not expose another user’s private content.',
      'Operations: maintain a staging environment, plan updates, back up database and uploaded assets, test restore procedures and define rollback limitations.'
    ],
    practice:['Plan a fictional student-club portal with a sitemap, editor/admin permissions and a content-review schedule.', 'Build a small local prototype using your course’s chosen CMS or framework; do not publish personal student information.', 'Rehearse an update in the test environment, restore a backup and verify navigation, content, uploads and permissions afterward.'],
    questions:[['Why separate staging from production?','You can test changes without immediately disrupting real visitors or data.'],['Why may a database-only backup be incomplete?','Uploaded files, configuration and other required assets may live elsewhere.'],['Why assign a content owner?','Someone must verify accuracy, approve changes and retire outdated material.']],
    mistake:'Installing many plugins without checking need, trust, maintenance and permissions. Choose the smallest supported setup that satisfies the portal’s requirements.'
  }
];
module.exports = { courses, sources };
