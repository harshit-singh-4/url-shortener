// import path, { dirname } from "path"
// import { fileURLToPath } from "url";
// import fs from "fs/promises"
// import {db} from "../config/db-client.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//  const data_file=path.join(__dirname,"..","data","links.json");
// console.log(data_file);

// export const loadslinks = async()=>{
//         try{
//             const [row]=await db.execute(`select * from short_links`);
//             return row;
//         }
//         catch(err){

//             // if(err.code === "ENOENT"){ // error no entry
//             //     await fs.writeFile(data_file,JSON.stringify({}));
//             //     return {};
//             // }
//             // permission issue
//             // JSON parse error
//             throw err;
//         }

//       };

//        // new data in links file

//     export  const saveLinks= async ({url,shortcode})=>{
//         // await fs.writeFile(data_file,JSON.stringify(links));
//        const [result]=await db.execute(`insert into short_links 
//         (short_code,url)
//         values
//         (?,?)`,[shortcode,url]
//     );
//     return result;
//       };


 
//       export const getlinksbyshortcode= async (shortcode)=>{

//         const [rows]=await db.execute(`select * from short_links where short_code= ?`,
//             [shortcode]
//         );

//         if(rows.length>0){
//             return rows[0];
//         }
//         else{
//             return null;
//         }
//       }