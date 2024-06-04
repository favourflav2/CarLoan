import { env } from "custom-env";
env(true);
import pg from "pg";
const { Pool, types } = pg;


const pool = new Pool({
    connectionString: process.env.POSTGRES_URI_AUTH,
  });
  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

export async function get_All_Tables(req,res){
    try{
      let {page, limit} = req.query

      if(!page || !limit) return res.status(404).json({msg:"Please provide a page and limit"})

      page = typeof page !== "number" &&  parseFloat(page)
      limit = typeof limit !== 'number' && parseFloat(limit)

     
        const retireText = "SELECT * FROM retire"
        const retireTable = await pool.query(retireText)

        // Paginate Data
        if(typeof page !== "number" || typeof limit !== "number") return res.status(404).json({msg:"The page number or limit query are not numbers"})

        const startIndex = (page - 1) * limit
        const endIndex = page * limit;
        const result = retireTable.rows.slice(startIndex, endIndex);
        const totalPages = Math.ceil(retireTable.rows.length / limit);

        const paginatedData = {
          data:result,
          page:page,
          limit: limit,
          totalPages,
          totalCount: retireTable.rows.length,
        };
        
        res.status(200).json(paginatedData)


    }catch(e){
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
}
 
console.log(process.env.POSTGRES_URI_AUTH)