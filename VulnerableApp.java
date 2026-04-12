import java.sql.*;
import java.io.*;

public class VulnerableApp {

    public static void main(String[] args) throws Exception {
        String userInput = args.length > 0 ? args[0] : "test";

        // ❌ 1. SQL Injection
        Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/test", "user", "pass");
        Statement stmt = conn.createStatement();
        String query = "SELECT * FROM users WHERE name = '" + userInput + "'";
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            System.out.println(rs.getString("name"));
        }

        // ❌ 2. Command Injection
        Runtime.getRuntime().exec("ls " + userInput);

        // ❌ 3. Path Traversal / Arbitrary File Read
        File file = new File("/var/data/" + userInput);
        BufferedReader br = new BufferedReader(new FileReader(file));
        System.out.println(br.readLine());

        conn.close();
    }
}
