// task one.
/*
Task 1 - Designing a Chart
You have a blog application. Design a chart for your collection of posts that includes the following:
Article Title
Article Content (Long Text)
Author's Name + Email
Publication Date
Number of Views (may be in the billions)
Is the article published or not?
Tags (more than one tag)
Write a complete insertOne function using the correct BSON types.
*/
const blogSchema = new Schema({
  blogTitle: {
    type: String,
    required: true,
  },
  blogContent: {
    type: String,
    required: true,
  },
  blogAuthor: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  numberOfViews: {
    type: Number, // big number use mongoose-long NumberLong why? because NumberLong is a 64-bit integer type that can store larger values than the standard JavaScript Number type, which is a 64-bit floating-point number. This is particularly useful for applications that require precise representation of large integers, such as financial calculations or when dealing with large datasets. In contrast, the standard Number type may lose precision for very large integers, leading to potential inaccuracies in calculations or data representation.
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
});

// example usage of the blogSchema
db.blogSchema.insertOne({
  blogTitle: "Understanding Mongoose Schemas",
  blogContent:
    "Mongoose schemas are a powerful way to define the structure of your data in MongoDB...",
  blogAuthor: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  publicationDate: new Date("2024-06-01"),
  numberOfViews: NumberLong(1500),
  isPublished: true,
  tags: ["mongoose", "mongodb", "schemas"],
});

// task two.
/*
Task 2 - Data Types in Practice

Execute the following in the command line:

javascript
// 1. Add a document containing all data types
// 2. Then create a function db.stats() and record the average size of the object (avgObjSize)
// 3. Add the same document but use NumberInt for integers
// 4. Create a function db.stats() again and compare the results

Send me the two results and the difference between them.
 */

db.demoDocuments.insertOne({
  stringField: "This is a string",
  numberField: NumberInt(42),
  booleanField: true,
  dateField: new Date(),
  arrayField: [1, 2, 3],
  objectField: { key: "value" },
  nullField: null,
  binaryField: new BinData(0, "SGVsbG8gV29ybGQ="), // "Hello World" in base64
  objectIdField: ObjectId(),
  regexField: /abc/,
});

// result figures from db.stats() after inserting the document with NumberInt
// avgObjSize: 123.45 bytes (example value)

// Now, insert the same document but use NumberLong for the numberField:
db.demoDocuments.insertOne({
  stringField: "This is a string",
  numberField: NumberLong(42),
  booleanField: true,
  dateField: new Date(),
  arrayField: [1, 2, 3],
  objectField: { key: "value" },
  nullField: null,
  binaryField: new BinData(0, "SGVsbG8gV29ybGQ="), // "Hello World" in base64
  objectIdField: ObjectId(),
  regexField: /abc/,
});

// result figures from db.stats() after inserting the document with NumberLong
// avgObjSize: 125.67 bytes (example value)


// task three.
/*

Task 3 — Date Queries

Add 3 orders with different dates, then write a query to retrieve all orders for the last 7 days.

*/

// order one
db.orders.insertOne({
  orderId: 1,
  customerName: "Alice",
  orderDate: new Date("2024-06-01"),
  totalAmount: NumberLong(100),
});

// order two
db.orders.insertOne({
  orderId: 2,
  customerName: "Bob",
  orderDate: new Date("2024-06-08"),
  totalAmount: NumberLong(200),
});

// order three
db.orders.insertOne({
  orderId: 3,
  customerName: "Charlie",
  orderDate: new Date("2024-06-15"),
  totalAmount: NumberLong(300),
});

// query to retrieve all orders for the last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentOrders = db.orders.find({
  orderDate: { $gte: sevenDaysAgo },
}).toArray();

// result of the query will include orders with orderId 2 and 3, as they fall within the last 7 days from the current date.
// result shape:
// [
//   {
//     orderId: 2,
//     customerName: "Bob",
//     orderDate: ISODate("2024-06-08"),
//     totalAmount: NumberLong(200)
//   },
//   {
//     orderId: 3,
//     customerName: "Charlie",
//     orderDate: ISODate("2024-06-15"),
//     totalAmount: NumberLong(300)
//   }
// ]

// task four.
/*
// students collection
{ _id: ObjectId("s1"), name: "Ahmed" }

// courses collection
{ _id: ObjectId("c1"), title: "MongoDB" }

Student ممكن يشترك في courses كتير، والـ course ممكن فيه students كتير.

صمّم الـ schema — هتحط الـ reference فين وليه؟ */

// schema for students
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course", // referencing the Course model
    },
  ],
});

// schema for courses
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

// The reference is placed in the students schema because a student can enroll in multiple courses, and we want to keep track of which courses a student is enrolled in. By using an array of ObjectIds that reference the Course model, we can easily retrieve all courses associated with a particular student. This design allows for efficient querying and maintains the relationship between students and courses without duplicating course data in the students collection.


// Practical Tasks 💻
// Task 1 — $lookup Practice

// You have:

// db.orders.insertOne({ productId: ObjectId("p1"), customerId: ObjectId("c1"), quantity: 2 })
// db.products.insertOne({ _id: ObjectId("p1"), name: "Laptop", price: 999 })

// Write a $lookup query to retrieve the order with complete product details under the name productDetails.

// A:
db.orders.aggregate([
  {
    $lookup: {
      from: "products", // the collection to join
      localField: "productId", // the field from the orders collection
      foreignField: "_id", // the field from the products collection
      as: "productDetails" // the name of the new field to contain the joined data
    }
  }
]);

// response shape:
// [
//   {
//     productId: ObjectId("p1"),
//     customerId: ObjectId("c1"),
//     quantity: 2,
//     productDetails: [
//       {
//         _id: ObjectId("p1"),
//         name: "Laptop",
//         price: 999
//       }
//     ]
//   }
// ]

// Task 2 — Schema Validation

// Design a validator for the products collection:

// name: string (required)
// price: number (required, must be greater than 0)
// category: string (optional)

db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        price: {
          bsonType: "number",
          description: "must be a number and is required",
          minimum: 0
        },
        category: {
          bsonType: "string",
          description: "must be a string and is optional"
        }
      },
    }
  }
});

// Task 3 — Full Design

// You have a Task Manager app with:

// Users
// Projects (each project has one owner)
// Tasks (each task belongs to one project and has an assignee)

// Design the complete schema (embedded or referenced for each relationship) and explain why.

// Schemas
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
});

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId, // why: We use a reference here because each project has one owner, and we want to maintain a relationship between the project and the user who owns it. By using an ObjectId that references the User model, we can easily retrieve the owner's details when querying for a project without duplicating user data in the projects collection.
    ref: "User",
    required: true
  }
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project", // why: We use a reference here because each task belongs to one project, and we want to maintain a relationship between the task and the project it belongs to. By using an ObjectId that references the Project model, we can easily retrieve the project's details when querying for a task without duplicating project data in the tasks collection.
    required: true
  },
  assignee: {
    type: Schema.Types.ObjectId, // why: We use a reference here because each task has an assignee, and we want to maintain a relationship between the task and the user who is assigned to it. By using an ObjectId that references the User model, we can easily retrieve the assignee's details when querying for a task without duplicating user data in the tasks collection.
    ref: "User",
    required: true
  }
});

// response shape for a task document:
// {
//   _id: ObjectId("task1"),
//   title: "Design Database Schema",
//   project: ObjectId("project1"), // references the project it belongs to
//   assignee: ObjectId("user1") // references the user assigned to the task
// }

// with this design, we maintain clear relationships between users, projects, and tasks while avoiding data duplication. Each entity is stored in its own collection, and references are used to link them together, allowing for efficient queries and data integrity.

// populate queries can be used to retrieve related data when needed, such as fetching the owner of a project or the assignee of a task, without embedding all the details directly in the documents. This approach provides flexibility and scalability for the application as it grows.

// shape of a populated task document after using populate:
// {
//   _id: ObjectId("task1"),
//   title: "Design Database Schema",
//   project: {
//     _id: ObjectId("project1"),
//     title: "Database Design",
//     owner: ObjectId("user1")
//   },
//   assignee: {
//     _id: ObjectId("user1"),
//     name: "John Doe",
//     email: "john.doe@example.com"
//   }
// }


// Part 3 — Practical

// Q11. You have:

// // authors collection
// { _id: ObjectId("a1"), name: "Naguib Mahfouz", nationality: "Egyptian" }

// // books collection
// { _id: ObjectId("b1"), title: "Palace Walk", authorId: ObjectId("a1"), year: 1956 }

// { _id: ObjectId("b2"), title: "Palace of Desire", authorId: ObjectId("a1"), year: 1957 }

// Write a $lookup query to retrieve all the books along with their author information under the name authorInfo.

db.books.aggregate([
  {
    $lookup: {
      from: "authors", // the collection to join
      localField: "authorId", // the field from the books collection
      foreignField: "_id", // the field from the authors collection
      as: "authorInfo" // the name of the new field to contain the joined data
    }
  }
]);

// response shape:
// [
//   {
//     _id: ObjectId("b1"),
//     title: "Palace Walk",
//     authorId: ObjectId("a1"),
//     year: 1956,
//     authorInfo: [
//       {
//         _id: ObjectId("a1"),
//         name: "Naguib Mahfouz",
//         nationality: "Egyptian"
//       }
//     ]
//   },
//   {
//     _id: ObjectId("b2"),
//     title: "Palace of Desire",
//     authorId: ObjectId("a1"),
//     year: 1957,
//     authorInfo: [
//       {
//         _id: ObjectId("a1"),
//         name: "Naguib Mahfouz",
//         nationality: "Egyptian"
//       }
//     ]
//   }
// ]

// -----------
// Q12. Design a $jsonSchema validator for the users collection:

// username: string, required, 3-20 characters

// email: string, required
// age: number, optional, must be between 13 and 120

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      type: "object",
      required: ["username", "email"],
      properties: {
        username: {
          type: "string",
          minLength: 3,
          maxLength: 20
        },
        email: {
          type: "string",
          format: "email"
        },
        age: {
          type: "number",
          minimum: 13,
          maximum: 120
        }
      }
    }
  }
});


// Part 4 — Design Scenarios

// Q14. Design the complete schema for a ride-sharing app (like Uber):

// Drivers
// Riders
// Trips (Each trip has one driver + one rider + a start and end point)
// Trips need a snapshot of the price at the time of the trip (because prices change)

// Define for each relationship: Embedded, Reference, or Hybrid — and explain why.

const driverSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  }
});

const riderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  }
});

const tripSchema = new Schema({
  driver: {
    type: Schema.Types.ObjectId,
    ref: "Driver", // why: We use a reference here because each trip has one driver, and we want to maintain a relationship between the trip and the driver. By using an ObjectId that references the Driver model, we can easily retrieve the driver's details when querying for a trip without duplicating driver data in the trips collection.
    required: true
  },
  rider: {
    type: Schema.Types.ObjectId, // why: We use a reference here because each trip has one rider, and we want to maintain a relationship between the trip and the rider. By using an ObjectId that references the Rider model, we can easily retrieve the rider's details when querying for a trip without duplicating rider data in the trips collection.
    ref: "Rider",
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});


// Q15. You have a social media application with:

// Posts
// Each post has likes (potentially millions)
// Each post has comments (usually fewer than 100)
// Each comment can have replies (nested comments)

// Design the schema and explain your reasons for each decision — keeping in mind the 16MB limit and the 100-level nesting limit.

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  }, 
  replies: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// // Explanation:
// // 1. Posts: The posts collection contains the main content of the social media application. Each post has a content field for the text, a likes field to count the number of likes, and an array of ObjectIds referencing comments. This design allows for efficient retrieval of posts without embedding all comments directly, which could lead to exceeding the 16MB document size limit if there are many comments.
// // 2. Comments: The comments collection contains individual comments, each with its own content field and an array of ObjectIds referencing replies. This allows for a nested comment structure while keeping the size of each comment document manageable. By using references instead of embedding, we can avoid the 100-level nesting limit and maintain flexibility in retrieving comments and their replies as needed.
// // 3. Overall, this design balances the need for efficient data retrieval with the constraints of MongoDB's document size and nesting limits, ensuring that the application can scale effectively as the number of posts, likes, and comments grows.

// // Inside the Shell — The Help Hierarchy

// help // General commands
// help admin // Administrative commands

// db.help() // All available commands at the database level
// db.collectionName.help() // All available commands at the collection level
// The important information between the lines 🔍

// Notice the hierarchy here — the help system itself reflects the hierarchy you learned in Section 1 (Server → Database → Collection):

// help ← General (server-level commands)

// │
// db.help() ← Database level

// │
// db.col.help() ← Collection level

// Each level has its own commands — this isn't random, it's a direct reflection of the MongoDB structure you learned from the beginning.

// Additional example (outside the course)
// javascript
// // Scenario: I forgot the exact name of the command that gives you the collection size
// db.products.help()
// // You'll find: db.products.stats() in the list
// db.products.stats()
// // { size: ..., count: ..., avgObjSize: ... }

// Question: Why does MongoDB design its Help system hierarchically (help → db.help() → db.collection.help()) instead of putting all the commands in one place?

// Answer: MongoDB designs its Help system hierarchically to reflect the structure and organization of the database itself. This hierarchical design allows users to easily navigate and find relevant commands based on their context (server-level, database-level, or collection-level). It helps users understand the scope of commands and reduces confusion by grouping related commands together, making it more intuitive to locate specific functionalities without overwhelming them with a flat list of all commands.

// What is the relationship between logpath (which we learned in Section 4) and validationAction: "warn" (which we learned in Section 3)? Explain the connection.

// Answer: The relationship between logpath and validationAction: "warn" lies in how MongoDB handles validation errors and logs them. The logpath specifies the file path where MongoDB writes its log messages, including warnings and errors. When validationAction is set to "warn", it means that if a document fails validation, MongoDB will not reject the operation but will log a warning message instead. This warning message will be recorded in the log file specified by logpath. Therefore, the connection is that logpath determines where the warnings generated by validationAction: "warn" are stored, allowing administrators to monitor and review validation issues without interrupting database operations.


// Q6. Write the full command to run Mongod as:

// Custom dbpath: /home/user/myapp/db
// Custom logpath: /home/user/myapp/logs/mongo.log
// As a background process (on Mac/Linux)

// Answer: mongod --dbpath /home/user/myapp/db --logpath /home/user/myapp/logs/mongo.log --fork

// Write the content of the mongodb.cfg file in YAML format that specifies the same settings as in the previous question.

// Answer:
// yaml
systemLog:
  destination: file
  path: /home/user/myapp/logs/mongo.log
storage:
  dbPath: /home/user/myapp/db

// dbPath: /home/user/myapp/db
// logPath: /home/user/myapp/logs/mongo.log

// Q8. You are already inside the shell and connected to a database named shop. Type the command that shows you all the available commands at the database level itself.
// Answer: db.help()

// Why do most modern MERN developers prefer Docker over manually handling dbpath/logpath? List five advantages.
// Answer:
// 1. **Isolation**: Docker containers provide an isolated environment for the database, preventing conflicts with other applications or services running on the same machine. This ensures that the database runs consistently across different environments.
// 2. **Portability**: Docker images can be easily shared and deployed across different systems, making it simple to set up the same database environment on development, staging, and production servers without worrying about system-specific configurations.
// 3. **Version Control**: Docker allows developers to specify the exact version of MongoDB they want to use in a Dockerfile, ensuring that all team members and deployment environments are using the same version, which helps avoid compatibility issues.
// 4. **Simplified Configuration**: With Docker, developers can define all necessary configurations (like dbpath and logpath) in a Dockerfile or docker-compose.yml file, reducing the complexity of manual setup and minimizing human error.
// 5. **Scalability**: Docker makes it easier to scale database instances horizontally by running multiple containers, allowing for better load distribution and high availability without complex manual configurations.

// True or false with explanation:

// "If my project is on MongoDB Atlas, there's absolutely no need to learn dbpath or logpath — these concepts are useless to me."
// Answer: False
// Explanation: Even with MongoDB Atlas, understanding dbpath and logpath is useful for managing and troubleshooting database performance and logs, especially when dealing with custom configurations or migrations.

// Q1: Why does the `insertMany()` function refuse to accept an array containing only a single document—or fail to work if an array isn't passed at all—even though, logically, it could have "inferred" that you intended to insert a single document? What is the design rationale behind this requirement?

// Answer: The `insertMany()` function is designed to explicitly handle multiple documents, and it requires an array to clearly indicate that the user intends to insert more than one document. This design choice helps prevent ambiguity and potential errors in the code. If a single document were passed without an array, it could lead to confusion about whether the user intended to insert one or multiple documents. By enforcing the requirement of an array, MongoDB ensures that the user's intention is clear, reducing the risk of unintended behavior and making the API more predictable and consistent.

// Q1: You have this code in Mongoose and want to ensure that no duplicate emails are saved, while also ensuring that any user validation logic defined in a `pre('save')` hook runs for every user being registered. Is `insertMany()` the right choice here? Why or why not?
// A: No, `insertMany()` is not the right choice here. While it can insert multiple documents at once, it doesn't provide the same level of control and validation as individual `save()` operations. Using `insertMany()` would bypass the `pre('save')` hook for each user, potentially leading to validation issues and duplicate email entries. Instead, you should use a loop with individual `save()` calls to ensure that all validation logic is executed properly.

// Q1: If I run `insertMany()` with `ordered: true` (the default) on 5 documents, and the third document fails due to a duplicate `_id`, how many documents will actually be saved in the end? And what would be different if I used `ordered: false`?

// A: If you run `insertMany()` with `ordered: true` and the third document fails due to a duplicate `_id`, only the first two documents will be saved, and the operation will stop at the third document. The remaining documents (fourth and fifth) will not be processed or saved.

// If you use `ordered: false`, the operation will continue processing the remaining documents even if one fails. In this case, the first two documents will be saved, the third will fail, but the fourth and fifth documents will still be attempted for insertion. As a result, you could end up with three documents saved (the first two and either the fourth or fifth, depending on their validity). 

// Q1: [Practical] Write Mongoose code that attempts to perform an `insertMany` operation on a set of products. In the event of a partial failure due to duplicate `_id` values, return the number of products actually added to the user, along with a message explaining that some of them already existed.


const Product = new schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const insertProducts = async (products) => {
  try {
    const result = await Product.insertMany(products, { ordered: false });
    return {
      message: `${result.length} products were successfully added.`,
      addedCount: result.length
    };
  } catch (error) {
    if (error.name === 'BulkWriteError') {
      const addedCount = error.result.nInserted;
      return {
        message: `${addedCount} products were successfully added. Some products already existed and were not added.`,
        addedCount: addedCount
      };
    } else {
      throw error; // rethrow if it's not a BulkWriteError
    }
  }
}

// Q1: Why might a backend team prefer `bulkWrite()` over `insertMany()` even if the required operations are solely inserts? (Consider the different types of operations that `bulkWrite` allows you to combine into a single request.)
// A backend team might prefer `bulkWrite()` over `insertMany()` even for solely insert operations because `bulkWrite()` provides greater flexibility and control over the operations being performed. With `bulkWrite()`, you can combine different types of operations (inserts, updates, deletes) into a single request, allowing for more complex workflows and optimizations. Additionally, `bulkWrite()` allows for better error handling and reporting, as it can provide detailed information about which specific operations succeeded or failed, making it easier to manage partial failures and maintain data integrity. This level of control is particularly useful in scenarios where multiple types of database modifications are needed in a single transaction-like operation.
