// src\lib\db\serialize.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Serialize } from "@/types/serialized";


export function serialize<T>(data: T): Serialize<T> {
  if (!data) return data as Serialize<T>;
  
  const plainData = (data as any).toObject 
    ? (data as any).toObject({ virtuals: true }) 
    : data;

  const cleanData = JSON.parse(JSON.stringify(plainData));

  if (cleanData._id && !cleanData.id) {
    cleanData.id = cleanData._id.toString();
  }
  return cleanData as Serialize<T>;
}

// --------------------------
// --------------------------



// src/lib/db/serialize.ts

// export function serialize<T>(data: T): T {
//   if (!data) return data;
  
//   const plainData = (data as any).toObject 
//     ? (data as any).toObject({ virtuals: true, flattenMaps: true }) 
//     : data;

//   return JSON.parse(JSON.stringify(plainData));
// }

// --------------------------
// --------------------------

// export function serialize<T>(data: T): T {
//   if (!data) return data;

 
//   const cleanData = JSON.parse(JSON.stringify(data));

//   if (cleanData._id && !cleanData.id) {
//     cleanData.id = cleanData._id;
//   }

//   return cleanData;
// }

// -------------------------
// -------------------------

// // src/lib/db/serialize.ts

// export function serialize<T>(data: T): T {
//   if (!data) return data;
  

//   const plainData = (data as any).toObject 
//     ? (data as any).toObject({ virtuals: true }) 
//     : data;


//   const cleanData = JSON.parse(JSON.stringify(plainData));


//   if (cleanData._id && !cleanData.id) {
//     cleanData.id = cleanData._id.toString();
//   }

//   return cleanData;
// }