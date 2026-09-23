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

// You have an application with two operations: (a) recording a financial payment, and (b) updating the user's "last seen" timestamp whenever they open the app. What is the appropriate `writeConcern` for each operation, and why?
// For operation (a) recording a financial payment, a strict `writeConcern` with `w: 'majority'` and `j: true` would be appropriate to ensure data durability and consistency, as financial transactions require high reliability.
// For operation (b) updating the user's "last seen" timestamp, a less strict `writeConcern` with `w: 1` and `j: false` might be sufficient, as this operation is less critical and can tolerate some data loss in exchange for better performance.

// If you use `w: 0` in an `insertOne` operation and then write code that relies on `result.insertedId` to perform a subsequent action (such as linking an order to a shipment), what is supposed to happen? And why does this represent a genuine design issue?
// If you use `w: 0` in an `insertOne` operation, the write is considered successful as soon as it is received by the primary node, without waiting for acknowledgment from other replica nodes. This means that `result.insertedId` might not be reliable, as the document may not actually be persisted to disk or replicated across the cluster. This represents a genuine design issue because relying on `result.insertedId` for subsequent actions can lead to data inconsistencies and unexpected behavior, especially in a distributed database environment where data durability and consistency are crucial.

// What is the practical difference between `j: false` (the default) and `j: true` in terms of what you might lose if the server suddenly crashes at that exact moment?
// The practical difference between `j: false` and `j: true` lies in the durability of the write operation. With `j: false`, the write operation is considered successful as soon as it is acknowledged by the primary node, but it may not have been written to the journal yet. If the server crashes immediately after acknowledging the write, there is a risk that the data could be lost because it was not yet persisted to disk.
// With `j: true`, the write operation is only considered successful after it has been written to the journal, which is a durable storage mechanism. If the server crashes after acknowledging the write with `j: true`, the data is more likely to be preserved because it has been safely recorded in the journal, reducing the risk of data loss.

// Q: Write a Mongoose schema for a model named `AuditLog` (a legally sensitive audit log where no data loss is permissible), and configure the `writeConcern` at the schema level in a manner appropriate for the sensitivity of this data.
const AuditLogSchema = new mongoose.Schema({ 
  // Define your schema fields here
}, {
  writeConcern: {
    w: 'majority',
    j: true
  }
});

// If you have a replica set with five instances, why is `w: "majority"` practically better than `w: 5` (requiring acknowledgment from all instances) in most cases? Consider the scenario where one of the five instances is temporarily down.
// `w: "majority"` is practically better than `w: 5` in most cases because it allows for continued operation and acknowledgment of writes even if one or more instances are temporarily down. In a five-instance replica set, a majority would be three instances. This means that as long as at least three instances are available and can acknowledge the write, the operation can succeed.
// In contrast, `w: 5` requires acknowledgment from all five instances, which means that if even one instance is down, the write operation would fail. This can lead to unnecessary downtime and reduced availability of the application. Using `w: "majority"` provides a balance between data durability and system availability, ensuring that writes can still be acknowledged and processed even in the presence of temporary failures in the replica set.

// Lecture 75: What is Atomicity.
// - Suppose you have an e-commerce app and want to update a product's stock while simultaneously recording a sale—using a "References" approach (where products and sales are in separate collections). Are these two operations automatically atomic? If not, what is the solution?
// A: No, these two operations are not automatically atomic when using a "References" approach with separate collections for products and sales. In MongoDB, operations on different collections are not atomic by default, meaning that if one operation succeeds and the other fails, you could end up with inconsistent data (e.g., the stock is updated but the sale is not recorded, or vice versa).
// The solution to ensure atomicity in this scenario is to use multi-document transactions. By wrapping both operations (updating the product's stock and recording the sale) within a transaction, you can ensure that either both operations succeed or both fail, maintaining data consistency across the collections. This way, if any part of the transaction fails, all changes made during the transaction will be rolled back, preventing partial updates and ensuring atomicity.

// 2- Consider the same scenario, but using "Embedding" (storing sales history as an array within the product document itself). Does this guarantee atomicity? Is this actually a good design choice here, or could this embedding approach lead to other issues (consider document size and the number of sales over time)?
//
//  A: Yes, using "Embedding" (storing sales history as an array within the product document) guarantees atomicity for the operations on that single document. When you update the product's stock and append a new sale to the embedded sales array, both operations occur within the same document, and MongoDB ensures that updates to a single document are atomic. However, while this approach guarantees atomicity, it may not be a good design choice in the long term. Embedding sales history within the product document can lead to issues with document size, especially if a product has a large number of sales over time. MongoDB has a maximum document size limit of 16MB, and if the embedded sales array grows too large, it could exceed this limit, leading to errors and potential data loss. Additionally, querying and updating individual sales records may become more complex and less efficient as the embedded array grows. Therefore, while embedding provides atomicity, it may not be the best design choice for scenarios with potentially large or unbounded data sets like sales history.

// 3- Write a simple Mongoose example of an `updateOne()` operation that updates two embedded fields within the same document simultaneously—and explain why this operation is guaranteed to be atomic, given that it involves a single document.
// Example:
// const result = await Product.updateOne(
//   { _id: productId },
//   {
//     $set: {
//       'sales.$[elem].stock': newStock,
//       'sales.$[elem].price': newPrice
//     }
//   },
//   { arrayFilters: [{ 'elem._id': saleId }] }
// );
// This operation is guaranteed to be atomic because it updates two fields within the same document, and MongoDB ensures that updates to a single document are atomic.

// 4- The error that threatens atomicity occurs "while it is being handled by a storage engine." Relate this to the concept of the "Journal" we learned about in the previous episode—does the Journal solve this same problem or a different one? Explain the difference.
// The Journal in MongoDB is designed to provide durability and crash recovery for write operations. When a write operation is performed, the changes are first written to the journal before being applied to the actual data files. This ensures that if the server crashes during a write operation, the journal can be used to recover the changes and maintain data integrity.
// However, the Journal does not directly address the issue of atomicity across multiple operations or documents. Atomicity refers to the guarantee that a series of operations either all succeed or all fail as a single unit. The Journal ensures that individual write operations are durable and can be recovered in case of a crash, but it does not provide atomicity for multi-document transactions or operations that span multiple collections.

// 5- Suppose you have a document containing an array of 10 embedded objects (e.g., an order with 10 items). If you call `updateOne()` to update all 10 items at once, and a failure occurs midway through the operation—what should happen based on everything we learned today?
// If a failure occurs midway through the operation, the changes made to the document up to that point will be rolled back, ensuring that the document remains in a consistent state. This is because MongoDB ensures that updates to a single document are atomic, meaning they either all succeed or all fail as a single unit.

// 6- Regarding the "Isolation" concept mentioned earlier (protection against reading partially written data)—why do you think it is just as important as "Atomicity" in an e-commerce application where multiple users read and write to the same data simultaneously?
// A: Isolation is just as important as Atomicity in an e-commerce application because it ensures that users do not see inconsistent or partially updated data while multiple operations are being performed concurrently. For example, if one user is updating the stock of a product while another user is trying to view the product's details, isolation guarantees that the second user will either see the product's state before the update or after the update, but never a partially updated state. This prevents confusion and potential errors in decision-making, such as purchasing an item that appears to be in stock but is actually out of stock due to an ongoing update. Maintaining isolation helps provide a reliable and consistent user experience, which is critical for trust and satisfaction in an e-commerce environment. 

// 7- Write a realistic Mongoose scenario (Schema + code) illustrating the difference: a first case where the relationship between two data types is automatically protected by atomicity (due to embedding), and a second case where the same relationship is not automatically protected (due to references) and requires a transaction to achieve the same guarantee.

// case 1: Embedding (Atomicity Guaranteed)
const orderSchema = new Schema({
  customerName: String,
  items: [{
    productId: Schema.Types.ObjectId,
    quantity: Number
  }]
});

const Order = mongoose.model('Order', orderSchema);

// Updating an order and its items atomically
const updateOrder = async (orderId, newItems) => {
  await Order.updateOne(
    { _id: orderId },
    { $set: { items: newItems } }
  );
}

// case 2: References (Atomicity Not Guaranteed)
const studentSchema = new Schema({
  name: String,
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }]
});
const courseSchema = new Schema({
  title: String,
  description: String
});
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);

const enrollStudentInCourse = async (studentId, courseId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Student.updateOne(
      { _id: studentId },
      { $push: { courses: courseId } },
      { session }
    );
    await Course.updateOne(
      { _id: courseId },
      { $inc: { enrolledCount: 1 } },
      { session }
    );
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
}

// Lecture 76 — Importing Data
// If you run `mongoimport` without the `--jsonArray` flag on a file containing an array of documents, what would you expect to happen?
// Answer: Each document in the array would be imported as a separate document.

// Why does a Mongoose seed script offer an extra layer of safety that standard `mongoimport` doesn't provide?
// Answer: A Mongoose seed script offers an extra layer of safety because it allows for the execution of validation logic defined in the Mongoose schemas, including pre-save hooks and custom validation rules. This ensures that the data being imported adheres to the defined schema constraints and business logic, preventing invalid or inconsistent data from being inserted into the database. In contrast, `mongoimport` does not perform any schema validation or execute any application-level logic, which could lead to the insertion of malformed or non-compliant data.



// Part Two: Conceptual (in your own words)

// 6. Explain in your own words: Why might a backend team specify a different `writeConcern` for two different operations within the same application? (Provide an example of your own, distinct from those we discussed in the episodes.)

// A backend team might specify different `writeConcern` levels for different operations within the same application to balance between data durability and performance based on the criticality of each operation. For example, in a healthcare application, when recording a patient's medical history, the team might use a strict `writeConcern` of `w: 'majority'` and `j: true` to ensure that the data is safely written and replicated across multiple nodes, as this information is crucial for patient care and must not be lost. On the other hand, for logging user activity (like page views or clicks), the team might use a more lenient `writeConcern` of `w: 1` and `j: false`, as this data is less critical and can tolerate some loss in exchange for faster write performance. This approach allows the application to maintain high reliability for essential data while optimizing performance for less critical operations.

// 7. What is the relationship between your schema design decision (Embedding vs. References—from Section 3) and the guarantee of atomicity? Explain how the former affects the latter.
// The schema design decision between embedding and referencing directly impacts the guarantee of atomicity. When you embed documents within another document, the entire document is updated atomically, ensuring data consistency. However, when you use references, updates to related documents are not atomic, as they involve multiple separate operations. This means that if an error occurs during one of these operations, the data might be left in an inconsistent state. Therefore, the choice between embedding and referencing affects how you can ensure data integrity and consistency in your application.

// 8. Why is `wtimeout` not a substitute for correctly specifying `w` or `j`, but rather an additional tool layered on top of your choice?
// `wtimeout` is not a substitute for correctly specifying `w` or `j` because it does not change the fundamental behavior of the write concern. Instead, it serves as an additional tool that sets a maximum time limit for the write operation to wait for acknowledgment from the specified number of nodes (as defined by `w`). If the acknowledgment is not received within the specified timeout, the operation will fail with a timeout error. This allows developers to handle scenarios where nodes may be slow or unresponsive, but it does not alter the guarantees provided by `w` or `j`. Therefore, `wtimeout` should be used in conjunction with appropriate `w` and `j` settings to ensure that write operations meet both durability and performance requirements.

// 9. What is the difference between "data was lost because I chose `w: 0`" and "data was lost because I performed an `insertMany` with `ordered: true` and it stopped at the first error"? Both scenarios involve data loss, but how do they differ?
// The difference between "data was lost because I chose `w: 0`" and "data was lost because I performed an `insertMany` with `ordered: true` and it stopped at the first error" lies in the nature of the data loss and the underlying causes.
// In the first scenario, choosing `w: 0` means that the write operation does not wait for any acknowledgment from the database. As a result, the operation is considered successful as soon as it is sent to the server, but there is no guarantee that the data was actually written to disk or replicated. If the server crashes or fails to process the write, the data can be lost without any indication to the client.
// In the second scenario, performing an `insertMany` with `ordered: true` means that the operation will stop processing further documents as soon as it encounters the first error (such as a duplicate key). This results in partial data loss, where some documents may have been successfully inserted before the error occurred, while others were not. The client is aware of the error and can take corrective action, but the operation does not complete for all intended documents.

// Section Three: Practical / Code
// 10. Write Mongoose code to perform an `insertMany()` operation on a collection of Order documents, such that:

// If a partial failure occurs due to a duplicate `_id`, the operation continues for the remaining documents (it does not stop).
// The `writeConcern` ensures the highest possible level of safety (`majority` + `journal`).
const OrderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }]
}, {
  writeConcern: {
    w: 'majority',
    j: true
  }
});

const Order = mongoose.model('Order', OrderSchema);

const insertOrders = async (orders) => {
  try {
    const result = await Order.insertMany(orders, { ordered: false });
    return {
      message: `${result.length} orders were successfully added.`,
      addedCount: result.length
    };
  } catch (error) {
    if (error.name === 'BulkWriteError') {
      const addedCount = error.result.nInserted;
      return {
        message: `${addedCount} orders were successfully added. Some orders already existed and were not added.`,
        addedCount: addedCount
      };
    } else {
      throw error; // rethrow if it's not a BulkWriteError
    }
  }
}

// 11. Consider the following code:

// javascript
// const result = await collection.insertOne(
// { name: "Test" },
// { writeConcern: { w: 0 } }
// );
// console.log(result.insertedId);

// What is the problem with this code? And how would you fix it if you actually needed to use the `insertedId` later on?
// The problem with this code is that it uses a write concern of `w: 0`, which means that the operation does not wait for any acknowledgment from the database. As a result, the `insertedId` may not be reliable because the document may not have been successfully written to the database. If the server crashes or fails to process the write, the `insertedId` could point to a document that was never actually inserted.
// To fix this issue, you should use a write concern that ensures acknowledgment from the database, such as `w: 1` or higher. This way, you can be confident that the document was successfully inserted and that the `insertedId` is valid. For example:
// javascript
const result = await collection.insertOne(
  { name: "Test" },
  { writeConcern: { w: 1 } }
);
console.log(result.insertedId);

// 12. Write a complete `mongoimport` command to import a file named `products.json` (containing an array of documents) into a database named `shop` and a collection named `products`, ensuring that any existing data in the collection is deleted first.
// Answer:
// mongoimport --db shop --collection products --file products.json --jsonArray --drop


// 13. We discussed that `w: "majority"` is preferable to `w: <fixed number>` in a replica set. However, there is a genuine trade-off involved in using `w: "majority"`—what is it? (Consider performance/speed).
// Answer: The trade-off involved in using `w: "majority"` is that it can lead to slower write performance compared to using a fixed number for `w`. When using `w: "majority"`, the write operation must wait for acknowledgment from a majority of the replica set members before it is considered successful. This can introduce latency, especially in larger replica sets or in scenarios where some nodes may be slower or temporarily unavailable. In contrast, using a fixed number for `w` (e.g., `w: 1`) allows for faster writes since it only requires acknowledgment from a single node, but it sacrifices durability and consistency guarantees. Therefore, developers must balance the need for data safety with the performance requirements of their application when choosing the appropriate write concern.

// 14. If you have an application with high write throughput (thousands of operations per second), such as an IoT system receiving sensor data, are `bulkWrite()` or `insertMany()` with `ordered: false` the most suitable choices? Why?
// Answer: Yes, both `bulkWrite()` and `insertMany()` with `ordered: false` are suitable choices for applications with high write throughput, such as an IoT system receiving sensor data. These methods allow for batch processing of multiple write operations in a single request, which reduces the overhead of individual network round trips and improves overall performance.

// 15. [Open-ended] After everything we’ve covered in this section (insert methods, ordered inserts, `writeConcern`, atomicity), if you were asked in a job interview, "How does MongoDB guarantee that your write operation isn't saved partially (incompletely)?"—how would you answer in just 3–4 sentences, using phrasing suitable for an interview (a concise, direct model answer)?
// Answer: MongoDB guarantees that write operations are atomic at the document level, meaning that either all changes to a document are saved, or none are. This is achieved through its write concern mechanism and the use of transactions for multi-document operations. Additionally, MongoDB ensures durability by requiring acknowledgment from the appropriate number of replica set members before considering a write operation successful.