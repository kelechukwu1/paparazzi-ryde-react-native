import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DB_URL}`);
        const response = await sql`SELECT * FROM drivers`;

        return Response.json({ data: response });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}