from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import mysql.connector

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # Enable CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        # Connect to MySQL database
        try:
            connection = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database="dbforproject"
            )
            cursor = connection.cursor(dictionary=True)

            # Execute the query
            query = data.get("query")
            cursor.execute(query)

            if query.strip().lower().startswith(("insert", "update", "delete")):
                connection.commit()
                result = {"success": True}
            else:
                result = cursor.fetchall()

            cursor.close()
            connection.close()
            self.wfile.write(json.dumps(result).encode())

        except mysql.connector.Error as err:
            error_response = {"error": str(err)}
            self.wfile.write(json.dumps(error_response).encode())

def run(server_class=HTTPServer, handler_class=RequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    print('Server running on port 8000...')
    httpd.serve_forever()

if __name__ == "__main__":
    run()