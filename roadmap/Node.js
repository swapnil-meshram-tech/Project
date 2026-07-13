Complete Backend Developer Roadmap — Basic to Advanced

Total Duration: 24 Weeks
Phase 1  → Programming Fundamentals     (Week 1-2)
Phase 2  → Node.js Core                 (Week 3-4)
Phase 3  → Express + API Development    (Week 5-6)
Phase 4  → Databases                    (Week 7-9)
Phase 5  → Authentication + Security    (Week 10-11)
Phase 6  → DBMS Theory                  (Week 12)
Phase 7  → Computer Networks            (Week 13)
Phase 8  → Operating Systems            (Week 14)
Phase 9  → System Design                (Week 15-16)
Phase 10 → Caching + Performance        (Week 17)
Phase 11 → Testing                      (Week 18)
Phase 12 → DevOps Basics                (Week 19)
Phase 13 → AI Integration               (Week 20)
Phase 14 → Final Project                (Week 21-23)
Phase 15 → Interview Preparation        (Week 24)

Phase 1 — Programming Fundamentals (Week 1-2)
JavaScript Basics:
// ├── Variables (var, let, const)
// ├── Data types
// │   ├── String
// │   ├── Number
// │   ├── Boolean
// │   ├── null + undefined
// │   ├── Object
// │   └── Array
// │
// ├── Operators
// │   ├── Arithmetic
// │   ├── Comparison
// │   ├── Logical
// │   └── Ternary
│
// ├── Control flow
// │   ├── if / else
// │   ├── switch
// │   ├── for loop
// │   ├── while loop
// │   └── for...of / for...in
│
// ├── Functions
// │   ├── Function declaration
// │   ├── Function expression
// │   ├── Arrow functions
// │   ├── Parameters + arguments
// │   ├── Default parameters
// │   └── Return values
│
├── Arrays
│   ├── map, filter, reduce
// │   ├── forEach
│   ├── find, findIndex
│   ├── push, pop, shift, unshift
│   ├── splice, slice
// │   └── spread operator
│
├── Objects
// │   ├── Creating objects
// │   ├── Accessing properties
// │   ├── Destructuring
// │   ├── Spread operator
│   └── Object methods
│
├── ES6+ Features
// │   ├── Template literals
// │   ├── Destructuring
// │   ├── Spread / Rest
// │   ├── Modules (import/export)
// │   └── Optional chaining (?.)
│
├── Asynchronous JavaScript
// │   ├── Callbacks
// │   ├── Promises
// │   │   ├── .then()
// │   │   ├── .catch()
│   │   └── Promise.all()
// │   ├── async / await
// │   └── try / catch / finally
│
└── Error handling
    // ├── try / catch
    ├── throw new Error()
    └── Error types

Phase 2 — Node.js Core (Week 3-4)
How Node.js Works:
├── What is Node.js
├── How it differs from browser JS
├── Event loop
│   ├── Call stack
│   ├── Callback queue
│   ├── Microtask queue
│   └── How async works
│
├── Module system
│   ├── require()
│   ├── module.exports
│   ├── ES modules (import/export)
│   └── Built-in modules
│
├── Built-in Modules
│   ├── fs (file system)
│   │   ├── readFile
│   │   ├── writeFile
│   │   └── appendFile
│   ├── path
│   │   ├── path.join()
│   │   └── path.resolve()
│   ├── os
│   │   ├── os.platform()
│   │   └── os.cpus()
│   ├── http
│   │   ├── createServer()
│   │   └── Basic server setup
│   └── events
│       ├── EventEmitter
│       ├── .on()
│       └── .emit()
│
├── NPM
│   ├── What is NPM
│   ├── package.json
│   ├── package-lock.json
│   ├── npm install
│   ├── npm scripts
│   ├── devDependencies vs dependencies
│   └── .gitignore (node_modules)
│
├── Environment Variables
│   ├── What are they
│   ├── .env file
│   ├── dotenv package
│   └── process.env
│
└── Streams + Buffers (basics)
    ├── What is a stream
    ├── Readable stream
    ├── Writable stream
    └── Why streams are efficient

Phase 3 — Express + API Development (Week 5-6)
Express Basics:
├── What is Express
├── Setup + installation
├── app.listen()
├── app.use()
└── Request + Response objects

Routing:
├── app.get(), post(), put(), delete()
├── Route parameters (:id)
├── Query strings (?key=value)
├── Router (express.Router())
└── Route grouping

Middleware:
├── What is middleware
├── How middleware chain works
├── next() function
├── Built-in middleware
│   ├── express.json()
│   └── express.urlencoded()
├── Third-party middleware
│   ├── cors
│   ├── helmet
│   ├── morgan (logging)
│   └── compression
└── Custom middleware

REST API Design:
├── What is REST
├── Stateless principle
├── Resource-based URLs
│   ├── /users
│   ├── /users/:id
│   └── /users/:id/posts
├── HTTP methods
│   ├── GET    → read
│   ├── POST   → create
│   ├── PUT    → replace
│   ├── PATCH  → update
│   └── DELETE → delete
├── HTTP status codes
│   ├── 200 OK
│   ├── 201 Created
│   ├── 400 Bad Request
│   ├── 401 Unauthorized
│   ├── 403 Forbidden
│   ├── 404 Not Found
│   ├── 409 Conflict
│   ├── 429 Too Many Requests
│   └── 500 Internal Server Error
└── Response structure
    ├── Consistent format
    ├── success + message + data
    └── Error format

Layered Architecture:
├── Routes layer
├── Controller layer
├── Service layer
├── Repository layer
└── Model layer

Input Validation:
├── express-validator
├── Validating body fields
├── Validating params + query
└── Custom validation messages

Error Handling:
├── Custom AppError class
├── Operational vs programming errors
├── Global error handler
└── Async error catching

Phase 4 — Databases (Week 7-9)
Week 7 — MongoDB:
├── What is NoSQL
├── MongoDB vs SQL
├── Collections + Documents
├── CRUD operations
│   ├── insertOne, insertMany
│   ├── find, findOne
│   ├── updateOne, updateMany
│   └── deleteOne, deleteMany
├── Mongoose
│   ├── Schema definition
│   ├── Data types + validation
│   ├── Model creation
│   ├── Methods + Statics + Virtuals
│   ├── Middleware (pre, post hooks)
│   └── populate() (relationships)
├── Querying
│   ├── Filters
│   ├── Sorting
│   ├── Limiting
│   ├── Pagination (skip + limit)
│   └── Projection (select fields)
├── Indexing
│   ├── Single field index
│   ├── Compound index
│   ├── Unique index
│   ├── TTL index
│   └── Text index
└── Aggregation pipeline
    ├── $match
    ├── $group
    ├── $sort
    ├── $project
    └── $lookup

Week 8 — PostgreSQL:
├── What is relational database
├── Tables + Rows + Columns
├── Data types
│   ├── VARCHAR, TEXT
│   ├── INTEGER, BIGINT
│   ├── BOOLEAN
│   ├── TIMESTAMP
│   └── UUID
├── SQL Queries
│   ├── SELECT, INSERT
│   ├── UPDATE, DELETE
│   ├── WHERE clause
│   ├── ORDER BY
│   ├── GROUP BY
│   ├── HAVING
│   └── LIMIT + OFFSET
├── Relationships
│   ├── Primary key
│   ├── Foreign key
│   ├── One-to-one
│   ├── One-to-many
│   └── Many-to-many
├── Joins
│   ├── INNER JOIN
│   ├── LEFT JOIN
│   ├── RIGHT JOIN
│   └── FULL JOIN
├── Indexes in SQL
├── Transactions
│   ├── BEGIN
│   ├── COMMIT
│   └── ROLLBACK
└── Using with Node.js
    ├── pg package
    ├── Parameterized queries
    └── Connection pooling

Week 9 — ORM + Query Optimization:
├── What is an ORM
├── Prisma (recommended)
│   ├── Schema definition
│   ├── Migrations
│   ├── CRUD operations
│   └── Relations
├── Query Optimization
│   ├── N+1 problem
│   ├── Eager loading
│   ├── Select only needed fields
│   ├── Pagination strategies
│   │   ├── Offset pagination
│   │   └── Cursor pagination
│   └── Query analysis (explain)
└── When to use SQL vs NoSQL

Phase 5 — Authentication + Security (Week 10-11)
Week 10 — Authentication:
├── Authentication vs Authorization
├── JWT (JSON Web Token)
│   ├── How JWT works
│   ├── Header + Payload + Signature
│   ├── Access token
│   ├── Refresh token
│   └── Token expiry
├── bcrypt
│   ├── Password hashing
│   ├── Salt rounds
│   └── Comparing passwords
├── Auth middleware
│   ├── Verify token
│   └── Attach user to request
├── Role-based access control
│   ├── User roles
│   ├── Authorization middleware
│   └── Protecting routes
└── Session vs Token auth
    ├── Difference
    └── When to use each

Week 11 — Security:
├── Helmet (HTTP headers)
├── CORS
│   ├── What is CORS
│   ├── How it works
│   └── Configuration
├── Rate limiting
│   ├── Why it matters
│   └── express-rate-limit
├── Input sanitization
│   ├── XSS prevention
│   └── NoSQL injection prevention
├── SQL injection prevention
│   └── Parameterized queries
├── HTTPS basics
├── Environment variables security
│   ├── Never commit .env
│   └── Secret management
└── Password security
    ├── Never store plain text
    ├── bcrypt hashing
    └── Minimum requirements

Phase 6 — DBMS Theory (Week 12)
Core Concepts:
├── ACID Properties
│   ├── Atomicity    → all or nothing
│   ├── Consistency  → valid state always
│   ├── Isolation    → transactions don't interfere
│   └── Durability   → committed = permanent
│
├── Normalization
│   ├── What is normalization
│   ├── 1NF — no repeating groups
│   ├── 2NF — no partial dependency
│   ├── 3NF — no transitive dependency
│   └── When to denormalize
│
├── Indexing
│   ├── What is an index
│   ├── How B-tree index works
│   ├── Clustered vs non-clustered
│   ├── When to add index
│   └── Index trade-offs (write speed)
│
├── Transactions
│   ├── What is a transaction
│   ├── Concurrency problems
│   │   ├── Dirty read
│   │   ├── Phantom read
│   │   └── Non-repeatable read
│   └── Isolation levels
│
├── CAP Theorem
│   ├── Consistency
│   ├── Availability
│   ├── Partition tolerance
│   └── Why you can only pick 2
│
├── SQL vs NoSQL
│   ├── When to use SQL
│   ├── When to use NoSQL
│   └── Types of NoSQL
│       ├── Document (MongoDB)
│       ├── Key-value (Redis)
│       ├── Column (Cassandra)
│       └── Graph (Neo4j)
│
└── Database Design
    ├── ER diagrams
    ├── Entity + Attributes
    ├── Relationships
    └── Schema design basics

Phase 7 — Computer Networks (Week 13)
Core Concepts:
├── How Internet Works
│   ├── Client → Server model
│   ├── IP addresses
│   ├── DNS (domain → IP)
│   └── Ports
│
├── OSI Model (basics only)
│   ├── Layer 7 — Application (HTTP)
│   ├── Layer 4 — Transport (TCP/UDP)
│   └── Layer 3 — Network (IP)
│
├── TCP vs UDP
│   ├── TCP — reliable, ordered, slower
│   ├── UDP — fast, unreliable
│   └── When to use each
│
├── HTTP
│   ├── Request / Response cycle
│   ├── HTTP methods
│   ├── Headers
│   │   ├── Content-Type
│   │   ├── Authorization
│   │   ├── Accept
│   │   └── Cache-Control
│   ├── Status codes
│   ├── HTTP/1.1 vs HTTP/2
│   └── Keep-alive connections
│
├── HTTPS + SSL/TLS
│   ├── What is SSL/TLS
│   ├── How handshake works
│   ├── Certificates
│   └── Why HTTPS matters
│
├── REST vs GraphQL
│   ├── REST principles
│   ├── What is GraphQL
│   └── When to use each
│
├── WebSockets
│   ├── What is WebSocket
│   ├── HTTP vs WebSocket
│   ├── When to use (real-time)
│   └── Basic implementation
│
├── Cookies vs LocalStorage
│   ├── What are cookies
│   ├── httpOnly, secure flags
│   └── When to use each
│
└── API Concepts
    ├── What is an API
    ├── Public vs Private API
    ├── API versioning (/v1, /v2)
    └── API documentation (Swagger)

Phase 8 — Operating Systems (Week 14)
Core Concepts:
├── Process vs Thread
│   ├── What is a process
│   ├── What is a thread
│   ├── Difference
│   └── How Node.js uses threads
│
├── Concurrency vs Parallelism
│   ├── Concurrency — multiple tasks in progress
│   ├── Parallelism — multiple tasks at same time
│   └── How Node.js handles both
│
├── Memory Management
│   ├── Stack vs Heap
│   ├── What goes in stack
│   ├── What goes in heap
│   ├── Garbage collection
│   └── Memory leaks
│
├── Deadlock
│   ├── What is deadlock
│   ├── Four conditions
│   └── How to prevent
│
├── CPU Scheduling (basics)
│   ├── What is scheduling
│   ├── FIFO
│   └── Round robin
│
├── File System
│   ├── How files are stored
│   ├── File permissions
│   └── File descriptors
│
└── How Node.js fits in OS
    ├── Single threaded
    ├── Event loop
    ├── libuv (thread pool)
    └── Non-blocking I/O

Phase 9 — System Design (Week 15-16)
Week 15 — Fundamentals:
├── What is system design
├── Functional vs Non-functional requirements
├── Scalability
│   ├── Vertical scaling
│   └── Horizontal scaling
├── Load Balancing
│   ├── What is load balancer
│   ├── Round robin
│   └── Least connections
├── Database Scaling
│   ├── Replication
│   │   ├── Master-slave
│   │   └── Read replicas
│   └── Sharding basics
├── Caching in system design
│   ├── Where to cache
│   └── Cache invalidation strategies
├── CDN
│   ├── What is CDN
│   └── When to use
├── Message Queues
│   ├── What is a queue
│   ├── Producer + Consumer
│   └── When to use (async tasks)
├── Monolith vs Microservices
│   ├── What is monolith
│   ├── What is microservice
│   └── When to use each
└── API Gateway basics

Week 16 — Practice Designs:
├── Design URL shortener
│   ├── Requirements
│   ├── API design
│   ├── Database schema
│   ├── Short code generation
│   └── Scaling approach
│
├── Design authentication system
│   ├── Registration flow
│   ├── Login flow
│   ├── Token management
│   └── Password reset flow
│
├── Design e-commerce API
│   ├── Entities (user, product, order)
│   ├── Relationships
│   ├── API endpoints
│   └── Payment flow
│
└── Design rate limiter
    ├── Algorithm choice
    ├── Storage choice
    └── Edge cases

Phase 10 — Caching + Performance (Week 17)
Redis:
├── What is Redis
├── Redis vs database
├── Data types
│   ├── String
│   ├── Hash
│   ├── List
│   └── Set
├── Core operations
│   ├── GET, SET
│   ├── DEL
│   ├── EXPIRE + TTL
│   └── KEYS pattern
└── Use cases
    ├── Caching API responses
    ├── Session storage
    ├── Rate limiting storage
    └── OTP storage

Caching Strategies:
├── Cache-aside pattern
├── Write-through
├── TTL expiry
└── Cache invalidation

Performance:
├── Response compression (gzip)
├── Pagination
├── Database query optimization
├── Connection pooling
└── Lazy loading

Phase 11 — Testing (Week 18)
Testing Types:
├── Unit testing
│   ├── What is unit test
│   ├── Test one function at a time
│   └── Mock dependencies
│
├── Integration testing
│   ├── Test full request flow
│   └── Use real database (in-memory)
│
└── What NOT to test (saves time)

Jest:
├── Setup + configuration
├── describe() + it() + expect()
├── beforeAll, afterAll, beforeEach
├── Mocking (jest.mock())
└── Coverage reports

Supertest:
├── Testing HTTP routes
├── Sending requests in tests
└── Asserting responses

In-Memory MongoDB:
└── mongodb-memory-server
    ├── No real DB needed
    └── Resets between tests

Phase 12 — DevOps Basics (Week 19)
Git + GitHub:
├── git init, add, commit, push
├── Branching
│   ├── main branch
│   ├── feature branches
│   └── pull requests
├── .gitignore
└── Good commit messages

Docker:
├── What is Docker
├── Container vs VM
├── Dockerfile
│   ├── FROM
│   ├── WORKDIR
│   ├── COPY
│   ├── RUN
│   └── CMD
├── docker build + run
├── Docker Compose
│   ├── Multiple services
│   ├── Node + MongoDB + Redis
│   └── docker-compose.yml
└── Environment variables in Docker

Deployment:
├── What is deployment
├── Render (free, easy)
│   ├── Connect GitHub
│   └── Auto deploy
├── Railway (free tier)
├── Environment variables setup
└── Basic monitoring

CI/CD Basics:
├── What is CI/CD
├── GitHub Actions
│   ├── On push → run tests
│   └── On merge → deploy
└── Basic workflow setup

Phase 13 — AI Integration (Week 20)
Concepts:
├── What is an LLM
├── What is an API call to AI
├── Tokens + pricing basics
└── Prompt engineering basics
    ├── System prompts
    ├── Clear instructions
    └── Output formatting

OpenAI API:
├── Setup + API key
├── Chat completions
│   ├── model selection
│   ├── messages array
│   └── max_tokens
├── Streaming responses
└── Error handling

Build features:
├── Chatbot endpoint
├── Text summarizer
├── Smart search
└── Content generator

Phase 14 — Final Project (Week 21-23)
Build a complete production API:

Choose one idea:
├── E-commerce API
├── Blog platform API
├── Task management API
└── Social media API

Must include:
├── User auth (JWT + refresh tokens)
├── Full CRUD
├── Role-based access (user, admin)
├── Input validation
├── Rate limiting
├── Redis caching
├── File upload (basic)
├── AI integration (one feature)
├── Error handling (global)
├── Logging (Winston)
├── Testing (basic)
└── Deployed + accessible URL

GitHub README must have:
├── Project description
├── Tech stack
├── Features list
├── API endpoints table
├── How to run locally
└── Environment variables list

Phase 15 — Interview Preparation (Week 24)
Project Explanation:
├── What does it do
├── Why you chose this tech
├── What was hardest to build
├── What you would improve
└── Walk through the code

Common Interview Questions:
├── Node.js
│   ├── How does event loop work?
│   ├── Callback vs Promise vs async/await?
│   └── What is middleware?
│
├── Databases
│   ├── SQL vs NoSQL — when to use?
│   ├── What is indexing?
│   ├── What is ACID?
│   └── What is N+1 problem?
│
├── Authentication
│   ├── How does JWT work?
│   ├── Access vs refresh token?
│   └── How do you store passwords?
│
├── System Design
│   ├── Design a URL shortener
│   ├── How would you scale your API?
│   └── What is caching?
│
└── General
    ├── What is REST?
    ├── What is rate limiting?
    ├── What is CORS?
    └── HTTP vs HTTPS?

Coding Practice:
├── Array problems (easy only)
├── String manipulation
├── Basic algorithms
└── Write a simple API in interview

Apply To:
├── Startups first (easier entry)
├── Product companies
├── Remote job boards
│   ├── LinkedIn
│   ├── Indeed
│   ├── Wellfound (AngelList)
│   └── Remote.co
└── Internships (if available)

Daily Schedule
Weekdays (2 hours/day):
├── 1 hour — Learn concept
└── 1 hour — Write code

Weekends (4 hours/day):
├── 2 hours — Build project feature
├── 1 hour — Review what you learned
└── 1 hour — Fix stuck points

Golden Rules
1. Never learn without coding
2. One topic at a time
3. Build while learning
4. Google before giving up
5. Ask specific questions
6. Finish the project
7. Deploy everything
8. Consistency over intensityYou are out of free messages until 1:50 AMUpgradeSonnet 4.6 LowClaude is AI and can make mistakes. Please 