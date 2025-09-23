import mysql2 from "mysql2/promise";

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  pasword: "",
  database: "notes_app",
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Datebase connected successfully!");
    connection.release();
  } catch (error) {
    console.error("Database connection failed");
    throw error;
  }
};
