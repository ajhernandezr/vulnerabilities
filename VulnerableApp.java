import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.http.HttpServletRequest;
import java.security.MessageDigest;

public class VulnerableApp {

    // 1. VULNERABILIDAD: SQL Injection (Crítica)
    // CodeQL detectará que 'userId' viene del usuario y va directo a la query sin filtrar.
    public void getUserData(HttpServletRequest request, Connection conn) throws Exception {
        String userId = request.getParameter("id");
        Statement statement = conn.createStatement();
        String sql = "SELECT * FROM users WHERE id = '" + userId + "'"; 
        ResultSet rs = statement.executeQuery(sql);
    }

    // 2. VULNERABILIDAD: Uso de Hash Débil (Media/Alta)
    // MD5 ya no se considera seguro para proteger datos sensibles.
    public byte[] hashPassword(String password) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        return md.digest(password.getBytes());
    }

    // 3. VULNERABILIDAD: Hardcoded Password (Alta)
    // Nunca se deben dejar contraseñas escritas directamente en el código.
    public void connectDatabase() throws Exception {
        String url = "jdbc:mysql://localhost:3306/mydb";
        String user = "admin";
        String pass = "p4ssw0rd_secreta_123"; // Secret Scanning detectará esto
        Connection conn = DriverManager.getConnection(url, user, pass);
    }
}
