import { relations } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar,boolean } from 'drizzle-orm/mysql-core';
import { sql } from "drizzle-orm";
// Foreign key always "many side" me hoti hai jese 
// ki yha links  ek user ke many links

// “ORM ko poora schema load hone dena hota hai,
//  phir relations resolve karne hote hain” that's why we use callback

export const short_links = mysqlTable('short_links', {
  id: int().autoincrement().primaryKey(),
  url: varchar({ length: 2000 }).notNull(),
  shortcode: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()).notNull(),
  usersid: int().notNull().references(()=>users.id,{onDelete:"cascade"})
});

// session table

export const sessionstable = mysqlTable('sessions',{
  id : int().autoincrement().primaryKey(),
  userid : int().notNull().references(()=> users.id,{onDelete:"cascade"}),
  valid:boolean().default(true).notNull(),
  ip: varchar({length:255}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()).notNull()

});

export const verifyEmailTokensTable= mysqlTable('email_verification_tokens',{
  id: int().autoincrement().primaryKey(),
  userId: int().notNull().references(()=>users.id,{onDelete:"cascade"}),
  token: varchar({length:8}).notNull(),
  expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const users = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  isEmailValid: boolean("is_email_valid").default(false).notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()).notNull(),
});

// {many} destructuring, callback function,
// // Drizzle ne ek object banaya:
//     const helpers = {
//         many: many_function,   // ← Drizzle ne banaya
//         one:  one_function     // ← Drizzle ne banaya
//     }
    
// usersrelation,shortlinksrelation JOIN banane ke liye use hote hain
export const usersrelation = relations(users,({many})=>({
  shortlinks : many(short_links),
  session: many(sessionstable)
}));

export const shortlinksrelation=relations(short_links,({one})=>({
  user:one(users,{
    fields:[short_links.usersid],
    references:[users.id]

  //  fields     = "Meri table ki column"
  // references = "Doosri table ki column"
  })

  
}))

export const sessionrelation = relations(sessionstable,({one})=>({
        user: one(users,{
          fields:[sessionstable.userid], // foreign key
          references: [users.id]
        })
  }))