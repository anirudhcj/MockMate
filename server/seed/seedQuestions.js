const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const bank = {
  'JavaScript': [
    ['What is the difference between var, let, and const?', 'var is function-scoped and hoisted; let and const are block-scoped, and const cannot be reassigned.', ['scope', 'hoisting', 'var', 'let', 'const']],
    ['Explain closures in JavaScript with an example.', 'A closure is a function that retains access to its lexical scope even when executed outside that scope.', ['closure', 'lexical scope', 'function']],
    ['What is the event loop in JavaScript?', 'The event loop monitors the call stack and callback queue, pushing queued callbacks onto the stack when it is empty.', ['event loop', 'call stack', 'callback queue', 'asynchronous']],
    ['Explain the difference between == and ===.', '== performs type coercion before comparison, while === checks both value and type strictly.', ['type coercion', 'strict equality', 'value', 'type']],
    ['What are Promises and how does async/await work?', 'Promises represent eventual completion of async operations; async/await is syntactic sugar over Promises for cleaner asynchronous code.', ['Promise', 'async', 'await', 'resolve', 'reject']],
    ['What is event delegation?', 'Event delegation attaches a single event listener to a parent element to handle events on child elements via event bubbling.', ['event bubbling', 'parent', 'listener', 'DOM']],
    ['Explain the keyword this in JavaScript.', 'this refers to the execution context object, determined by how a function is called or lexically bound in arrow functions.', ['execution context', 'arrow function', 'bind', 'call']],
    ['What is debouncing vs throttling?', 'Debouncing delays execution until a pause in events; throttling limits execution to at most once per time interval.', ['debounce', 'throttle', 'performance', 'interval']],
    ['What is prototypal inheritance?', 'Objects in JavaScript inherit properties and methods from another object via the prototype chain.', ['prototype', 'inheritance', '__proto__']],
    ['Difference between map(), filter(), and reduce()?', 'map transforms elements into a new array, filter selects elements matching a condition, and reduce accumulates elements into a single value.', ['map', 'filter', 'reduce', 'array']]
  ],
  'React.js': [
    ['Explain the Virtual DOM and reconciliation.', 'The Virtual DOM is a lightweight copy of the real DOM; React diffs changes and updates only modified real DOM nodes.', ['Virtual DOM', 'diffing', 'reconciliation', 'performance']],
    ['What are React Hooks? Explain useState and useEffect.', 'Hooks let functional components use state and lifecycle side effects without class components.', ['useState', 'useEffect', 'functional components', 'side effects']],
    ['Difference between props and state?', 'Props are read-only inputs passed from parent to child; state is mutable data managed within a component.', ['props', 'state', 'immutable', 'parent']],
    ['What is prop drilling and how do you avoid it?', 'Prop drilling passes data through multiple intermediate components; it is avoided using Context API or state libraries like Redux/Zustand.', ['prop drilling', 'Context API', 'state management']],
    ['Explain useMemo and useCallback.', 'useMemo memoizes computed values while useCallback memoizes function references to prevent unnecessary re-renders.', ['memoization', 're-render', 'useMemo', 'useCallback']],
    ['What is the purpose of keys in React lists?', 'Keys uniquely identify list elements so React can track additions, updates, and removals efficiently.', ['key', 'unique', 'list', 'reconciliation']],
    ['Controlled vs Uncontrolled components?', 'Controlled components have form data managed by React state; uncontrolled components store state in the DOM using refs.', ['controlled', 'uncontrolled', 'useRef', 'form']],
    ['What is React.StrictMode?', 'StrictMode is a development tool that highlights potential problems and double-invokes certain functions to detect impure side effects.', ['StrictMode', 'development', 'side effects']],
    ['Explain custom hooks in React.', 'Custom hooks are reusable JavaScript functions starting with use that encapsulate stateful logic across components.', ['custom hook', 'reusable', 'logic']],
    ['How does React Router handle client-side navigation?', 'React Router updates the browser URL via the History API and renders matching components without full page reloads.', ['SPA', 'History API', 'Routes', 'Link']]
  ],
  'Node.js': [
    ['What is Node.js and why is it single-threaded?', 'Node.js is a V8-based JavaScript runtime using a single-threaded non-blocking event loop for high-concurrency I/O.', ['V8', 'non-blocking', 'event loop', 'single-threaded']],
    ['Explain middleware in Express.js.', 'Middleware functions have access to req, res, and next to execute code, modify objects, or end the request-response cycle.', ['middleware', 'req', 'res', 'next']],
    ['Difference between process.nextTick() and setImmediate()?', 'process.nextTick fires immediately after the current operation before the event loop continues; setImmediate runs in the check phase.', ['nextTick', 'setImmediate', 'event loop']],
    ['What are Streams in Node.js?', 'Streams process data piece-by-piece (Readable, Writable, Duplex, Transform) without loading entire files into memory.', ['streams', 'chunks', 'memory', 'pipe']],
    ['How does JWT authentication work in Node.js?', 'The server signs a token with a secret key on login, and the client sends it in the Authorization Bearer header for verification.', ['JWT', 'token', 'Bearer', 'stateless']],
    ['Explain CommonJS vs ES Modules in Node.js.', 'CommonJS uses require() and module.exports synchronously; ES Modules use import and export syntax.', ['require', 'module.exports', 'import', 'ESM']],
    ['How do you handle errors in async Express routes?', 'Use try/catch blocks with next(err) or an async wrapper middleware to forward errors to a global error handler.', ['try/catch', 'next(err)', 'error handler']],
    ['What is CORS and how do you configure it in Express?', 'CORS controls cross-origin HTTP requests via headers; configured in Express using the cors middleware.', ['CORS', 'cross-origin', 'headers']],
    ['What is the purpose of package-lock.json?', 'It locks exact dependency tree versions so builds remain deterministic across environments.', ['lockfile', 'deterministic', 'versions']],
    ['How can Node.js utilize multi-core CPUs?', 'Using the cluster module or worker_threads to spawn multiple processes or threads across CPU cores.', ['cluster', 'worker_threads', 'multi-core']]
  ],
  'MongoDB': [
    ['What are the main advantages of MongoDB over relational databases?', 'MongoDB stores flexible JSON-like BSON documents, scales horizontally via sharding, and avoids rigid schema migrations.', ['NoSQL', 'BSON', 'schema-less', 'sharding']],
    ['Explain indexing in MongoDB and its trade-offs.', 'Indexes speed up read queries using B-trees but add storage overhead and slightly slow down write operations.', ['index', 'B-tree', 'query performance', 'write overhead']],
    ['What is the MongoDB Aggregation Pipeline?', 'A framework that processes documents through sequential stages like $match, $group, $project, and $sort.', ['$match', '$group', '$project', 'pipeline']],
    ['Difference between embedding and referencing documents?', 'Embedding nests related data in one document for fast reads; referencing stores ObjectIds across collections to avoid duplication.', ['embedding', 'referencing', 'ObjectId', 'normalization']],
    ['What is a Replica Set in MongoDB?', 'A group of mongod instances maintaining the same data set to provide redundancy and automatic failover.', ['replica set', 'primary', 'secondary', 'failover']],
    ['Explain Sharding in MongoDB.', 'Sharding distributes large datasets horizontally across multiple servers using a shard key.', ['sharding', 'horizontal scaling', 'shard key']],
    ['What is Mongoose and what are schemas/models?', 'Mongoose is an ODM for Node.js; schemas define document structure and validation, while models provide the database interface.', ['Mongoose', 'ODM', 'schema', 'model']],
    ['Difference between find() and findOne()?', 'find() returns a cursor/array of all matching documents; findOne() returns the first matching document or null.', ['find', 'findOne', 'cursor']],
    ['What are transactions in MongoDB?', 'Multi-document ACID transactions ensure all operations succeed or roll back atomically.', ['ACID', 'transactions', 'atomic']],
    ['What is ObjectId composed of?', 'A 12-byte identifier containing a 4-byte timestamp, 5-byte random value, and 3-byte incrementing counter.', ['ObjectId', '12-byte', 'timestamp']]
  ],
  'HTML & CSS': [
    ['What is semantic HTML and why is it important?', 'Semantic tags like header, article, and nav convey meaning to browsers, screen readers, and search engines.', ['semantic', 'accessibility', 'SEO', 'tags']],
    ['Explain the CSS Box Model.', 'Every element consists of content, padding, border, and margin.', ['content', 'padding', 'border', 'margin']],
    ['Difference between Flexbox and CSS Grid?', 'Flexbox is one-dimensional (row or column) layout; CSS Grid is two-dimensional (rows and columns simultaneously).', ['Flexbox', 'Grid', '1D', '2D']],
    ['Explain CSS specificity rules.', 'Inline styles > IDs > Classes/attributes/pseudo-classes > Elements/pseudo-elements.', ['specificity', 'ID', 'class', 'inline']],
    ['Difference between display: none and visibility: hidden?', 'display: none removes the element from document layout; visibility: hidden hides it while preserving its layout space.', ['display', 'visibility', 'layout']],
    ['What are CSS variables (custom properties)?', 'Reusable values defined with --name and accessed via var(--name) that cascade through the DOM.', ['custom properties', 'var()', 'cascade']],
    ['Explain position: relative, absolute, fixed, and sticky.', 'relative offsets from normal position; absolute positions relative to nearest positioned ancestor; fixed relative to viewport; sticky toggles between relative and fixed.', ['relative', 'absolute', 'fixed', 'sticky']],
    ['What are media queries used for?', 'Media queries apply CSS rules conditionally based on viewport width, height, or device characteristics for responsive design.', ['responsive', 'breakpoint', 'viewport']],
    ['Difference between em, rem, vh, and vw units?', 'em is relative to parent font-size, rem to root html font-size, and vh/vw to 1% of viewport height/width.', ['rem', 'em', 'viewport']],
    ['What is the difference between localStorage, sessionStorage, and cookies?', 'localStorage persists across sessions, sessionStorage clears on tab close, and cookies are sent with HTTP requests.', ['localStorage', 'sessionStorage', 'cookies']]
  ],
  'DBMS': [
    ['Explain ACID properties in a database.', 'Atomicity, Consistency, Isolation, and Durability guarantee reliable transaction processing.', ['Atomicity', 'Consistency', 'Isolation', 'Durability']],
    ['What is normalization? Explain 1NF, 2NF, and 3NF.', 'Normalization reduces data redundancy: 1NF removes repeating groups, 2NF removes partial dependencies, 3NF removes transitive dependencies.', ['1NF', '2NF', '3NF', 'redundancy']],
    ['Difference between Primary Key, Foreign Key, and Unique Key?', 'Primary key uniquely identifies rows and cannot be null; Foreign key links to another table primary key; Unique key allows one null.', ['Primary Key', 'Foreign Key', 'Unique']],
    ['Explain INNER JOIN, LEFT JOIN, and RIGHT JOIN.', 'INNER returns matching rows in both tables; LEFT returns all left rows plus matches; RIGHT returns all right rows plus matches.', ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN']],
    ['Difference between DELETE, TRUNCATE, and DROP?', 'DELETE removes rows with WHERE and logs; TRUNCATE removes all rows quickly; DROP deletes the entire table structure.', ['DELETE', 'TRUNCATE', 'DROP']],
    ['What is a deadlock in DBMS and how is it prevented?', 'Deadlock occurs when transactions wait cyclically for locks; prevented using lock ordering, timeouts, or wait-die/wound-wait schemes.', ['deadlock', 'locks', 'timeout']],
    ['Difference between clustered and non-clustered indexes?', 'Clustered index sorts physical data rows (one per table); non-clustered creates a separate pointer structure.', ['clustered', 'non-clustered', 'index']],
    ['What are views in SQL?', 'A view is a virtual table based on a SQL query that simplifies complex queries and restricts column access.', ['view', 'virtual table', 'security']],
    ['Explain SQL injection and how to prevent it.', 'SQL injection injects malicious SQL via input; prevented using parameterized queries / prepared statements.', ['SQL injection', 'prepared statements', 'parameterized']],
    ['What is concurrency control and locking?', 'Concurrency control manages simultaneous transactions using shared/exclusive locks or MVCC to prevent dirty or lost updates.', ['concurrency', 'locks', 'MVCC']]
  ],
  'Operating Systems': [
    ['Difference between a process and a thread?', 'A process is an independent program with its own memory space; threads are lightweight execution units sharing process memory.', ['process', 'thread', 'memory space']],
    ['What is a deadlock and what are its four Coffman conditions?', 'Mutual exclusion, hold and wait, no preemption, and circular wait must all hold simultaneously for a deadlock.', ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait']],
    ['Explain paging and virtual memory.', 'Virtual memory extends RAM using disk space; paging divides memory into fixed-size pages and frames mapped via a page table.', ['paging', 'virtual memory', 'page table', 'frames']],
    ['Compare CPU scheduling algorithms: FCFS, SJF, and Round Robin.', 'FCFS runs in arrival order; SJF runs shortest burst first; Round Robin gives each process a fixed time quantum.', ['FCFS', 'SJF', 'Round Robin', 'time quantum']],
    ['What is a race condition and how do mutexes/semaphores solve it?', 'A race condition occurs when concurrent threads access shared data unsafely; mutexes enforce mutual exclusion and semaphores manage resource counts.', ['race condition', 'mutex', 'semaphore', 'critical section']],
    ['What is thrashing in an OS?', 'Thrashing happens when excessive page faults cause the OS to spend more time swapping pages than executing processes.', ['thrashing', 'page fault', 'swapping']],
    ['Difference between user mode and kernel mode?', 'User mode restricts direct hardware access for safety; kernel mode has full privileged access to hardware and system resources.', ['user mode', 'kernel mode', 'system call']],
    ['What is context switching?', 'Saving the CPU state of a running process/thread and loading the saved state of the next scheduled one.', ['context switch', 'PCB', 'registers']],
    ['Difference between internal and external fragmentation?', 'Internal fragmentation is unused space inside allocated blocks; external fragmentation is free memory scattered in non-contiguous chunks.', ['internal', 'external', 'fragmentation']],
    ['What is an inode in Linux file systems?', 'An inode stores file metadata (permissions, owner, size, disk block pointers) excluding the filename.', ['inode', 'metadata', 'permissions']]
  ],
  'Computer Networks': [
    ['Explain the 7 layers of the OSI model.', 'Physical, Data Link, Network, Transport, Session, Presentation, and Application layers.', ['OSI', 'Transport', 'Network', 'Application']],
    ['Difference between TCP and UDP?', 'TCP is connection-oriented and reliable with ordering/retransmission; UDP is connectionless, faster, and best-effort.', ['TCP', 'UDP', 'reliable', 'connectionless']],
    ['Explain the TCP 3-way handshake.', 'Client sends SYN, server replies SYN-ACK, and client sends ACK to establish a connection.', ['SYN', 'SYN-ACK', 'ACK', 'handshake']],
    ['What happens when you type a URL into a browser?', 'DNS resolves the domain to an IP, TCP/TLS handshake occurs, HTTP request is sent, and the server returns HTML/assets.', ['DNS', 'HTTP', 'TLS', 'IP']],
    ['Difference between HTTP and HTTPS?', 'HTTPS encrypts HTTP traffic using TLS/SSL certificates to ensure confidentiality and integrity.', ['TLS', 'SSL', 'encryption', 'HTTPS']],
    ['What is DNS and how does resolution work?', 'DNS translates domain names to IP addresses via recursive resolvers, root servers, TLD servers, and authoritative name servers.', ['DNS', 'IP address', 'authoritative']],
    ['Difference between IPv4 and IPv6?', 'IPv4 uses 32-bit addresses (~4.3 billion); IPv6 uses 128-bit hexadecimal addresses with built-in IPsec support.', ['32-bit', '128-bit', 'IPv4', 'IPv6']],
    ['What is NAT and why is it used?', 'Network Address Translation maps private local IP addresses to a public IP address to conserve IPv4 addresses.', ['NAT', 'private IP', 'public IP']],
    ['Difference between a switch and a router?', 'A switch forwards frames within a LAN using MAC addresses; a router routes packets between networks using IP addresses.', ['MAC address', 'IP address', 'switch', 'router']],
    ['What are HTTP status codes 200, 201, 400, 401, 403, 404, and 500?', '200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.', ['200', '401', '403', '404', '500']]
  ],
  'Data Structures and Algorithms': [
    ['Difference between an Array and a Linked List?', 'Arrays have contiguous memory with O(1) index access; Linked Lists use pointers with O(1) insertions/deletions at known nodes.', ['contiguous', 'O(1)', 'pointers', 'Linked List']],
    ['Explain Stack vs Queue with real-world examples.', 'Stack follows LIFO (undo history, call stack); Queue follows FIFO (task scheduling, BFS).', ['LIFO', 'FIFO', 'Stack', 'Queue']],
    ['How does a Hash Table work and how are collisions handled?', 'Hash functions map keys to array buckets in O(1) average time; collisions are resolved via chaining or open addressing.', ['hash function', 'collision', 'chaining', 'O(1)']],
    ['Time and space complexity of Merge Sort vs Quick Sort?', 'Merge Sort is O(n log n) worst-case with O(n) space; Quick Sort is O(n log n) average with O(log n) stack space.', ['O(n log n)', 'Merge Sort', 'Quick Sort', 'space complexity']],
    ['Difference between BFS and DFS in graphs?', 'BFS explores level-by-level using a queue (shortest path in unweighted graphs); DFS explores depth-first using a stack/recursion.', ['BFS', 'DFS', 'queue', 'stack']],
    ['What is a Binary Search Tree (BST) and its time complexities?', 'A binary tree where left children < node < right children; search/insert/delete take O(log n) average and O(n) skewed.', ['BST', 'O(log n)', 'inorder']],
    ['Explain Dynamic Programming with memoization vs tabulation.', 'DP solves overlapping subproblems with optimal substructure using top-down memoization or bottom-up tabulation.', ['overlapping subproblems', 'memoization', 'tabulation']],
    ['What is a Heap / Priority Queue?', 'A complete binary tree satisfying the min-heap or max-heap property, supporting O(log n) insert and O(1) peek.', ['min-heap', 'max-heap', 'Priority Queue', 'O(log n)']],
    ['How do you detect a cycle in a Linked List?', 'Use Floyd’s Tortoise and Hare algorithm with slow and fast pointers moving 1 and 2 steps; if they meet, a cycle exists.', ['Floyd', 'slow and fast pointers', 'cycle']],
    ['Explain Dijkstra’s algorithm.', 'Finds shortest paths from a source node in a weighted graph with non-negative edges using a min-priority queue.', ['shortest path', 'greedy', 'priority queue', 'Dijkstra']]
  ],
  'HR Interview': [
    ['Tell me about yourself.', 'Highlight your engineering background, full-stack projects, key technical strengths, and career goals concisely.', ['background', 'projects', 'skills', 'goals']],
    ['What are your greatest strengths and weaknesses?', 'Share a genuine technical/work strength with proof, and a real weakness along with concrete steps you take to improve it.', ['strengths', 'weakness', 'self-awareness', 'improvement']],
    ['Describe a challenging project you built and how you solved bugs.', 'Use the STAR method (Situation, Task, Action, Result) focusing on debugging, architecture decisions, and impact.', ['STAR', 'debugging', 'problem-solving', 'impact']],
    ['Where do you see yourself in 3 to 5 years?', 'Focus on growing into a strong software engineer, owning complex systems, and contributing measurable business value.', ['growth', 'ownership', 'engineering']],
    ['Why should we hire you over other candidates?', 'Connect your hands-on full-stack execution, fast learning ability, and problem-solving mindset directly to the role.', ['value', 'execution', 'fit']],
    ['How do you handle tight deadlines or pressure?', 'Prioritize tasks by impact, break work into milestones, communicate early, and focus on shipping working software.', ['prioritization', 'communication', 'milestones']],
    ['Tell me about a time you worked in a team conflict.', 'Describe listening objectively, focusing on technical merits rather than ego, and aligning on the best solution.', ['teamwork', 'communication', 'collaboration']],
    ['What motivates you as a software developer?', 'Building real products that solve user problems and continuously mastering modern engineering tools.', ['building', 'learning', 'impact']],
    ['How do you stay updated with new technologies?', 'Building projects, reading official documentation, and practicing system design and coding regularly.', ['documentation', 'projects', 'continuous learning']],
    ['Do you have any questions for us?', 'Ask thoughtful questions about the engineering team’s tech stack, onboarding, or current product challenges.', ['tech stack', 'team', 'challenges']]
  ]
};

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const questions = [];

for (const [category, items] of Object.entries(bank)) {
  const type = category === 'HR Interview' ? 'HR' : 'Technical';
  items.forEach(([questionText, idealAnswer, keywords], idx) => {
    questions.push({
      questionText,
      category,
      difficulty: difficulties[idx % 3],
      type,
      idealAnswer,
      keywords
    });
  });
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mockmate');
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log(`Database seeded with ${questions.length} questions across ${Object.keys(bank).length} categories!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
