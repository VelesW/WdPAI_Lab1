import json
import random
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Type
import psycopg2
import os
import time

DB_HOST = os.environ.get('DB_HOST', 'postgres')
DB_PORT = int(os.environ.get('DB_PORT', 5432))
DB_NAME = os.environ.get('DB_NAME', 'mydatabase')
DB_USER = os.environ.get('DB_USER', 'myuser')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'mypassword')

def connect_to_db():
    while True:
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD
            )
            print("Połączono z bazą danych")
            return conn
        except psycopg2.OperationalError:
            print("Błąd połączenia z bazą danych, ponawianie za 5 sekund...")
            time.sleep(5)

conn = connect_to_db()
cursor = conn.cursor()


# Define a request handler class for handling HTTP requests like GET, POST, DELETE, and OPTIONS.
class SimpleRequestHandler(BaseHTTPRequestHandler):

    # Predefined user list to simulate a database of users.
    user_list = [
        {
            'id': 1,
            'first_name': 'Michal',
            'last_name': 'Mucha',
            'role': 'Instructor'
        }
    ]
    
    # Helper method to generate a unique ID for new users, ensuring no ID conflicts.
    def generate_unique_id(self, existing_ids):
        while True:
            new_id = random.randint(1, 10000)  # Randomly generates an ID between 1 and 10,000.
            if new_id not in existing_ids:     # Ensures the ID is unique.
                return new_id

    # Handles preflight OPTIONS request to configure CORS and allowed methods/headers.
    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins for CORS.
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")  # Allowed methods.
        self.send_header("Access-Control-Allow-Headers", "Content-Type")  # Allowed headers.
        self.end_headers()


    # Handles GET requests, responds with the list of users in JSON format.
    def do_GET(self) -> None:
        try:
            cursor.execute("SELECT id, first_name, last_name, role FROM users;")
            users = cursor.fetchall()  # Fetch all rows from the users table
            self.user_list = [
                {
                    'id': user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'role': user[3]
                }
                for user in users
            ]
                
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins for CORS.
            self.end_headers()

            self.wfile.write(json.dumps(self.user_list).encode())  # Sends user list as JSON response.

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    # Handles POST requests, adds a new user to the user list.
    def do_POST(self) -> None:
        content_length: int = int(self.headers['Content-Length'])  # Get the length of the incoming data.
        post_data: bytes = self.rfile.read(content_length)  # Read the incoming POST data.
        received_data: dict = json.loads(post_data.decode())  # Decode the incoming JSON data.

        first_name = received_data.get('firstName')
        last_name = received_data.get('lastName')
        role = received_data.get('role')

        try:
            cursor.execute(
                "INSERT INTO users (first_name, last_name, role) VALUES (%s, %s, %s);",
                (first_name, last_name, role)
            )
            conn.commit()  # Commit the transaction to save the new user

            # Send a response with the updated list of users
            self.send_response(201)
            self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins for CORS.
            self.send_header("Content-Type", "application/json")
            self.end_headers()

            # Fetch the updated list of users to return
            cursor.execute("SELECT id, first_name, last_name, role FROM users;")
            users = cursor.fetchall()
            user_list = [
                {'id': user[0], 'first_name': user[1], 'last_name': user[2], 'role': user[3]}
                for user in users
            ]

            self.wfile.write(json.dumps(user_list).encode())

        except Exception as e:
            conn.rollback()  # Rollback in case of error
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    # Handles DELETE requests, removes a user based on the ID provided in the request.
    def do_DELETE(self) -> None:
        content_length: int = int(self.headers['Content-Length'])  # Get the length of the incoming data.
        delete_data: bytes = self.rfile.read(content_length)  # Read the incoming DELETE data.
        received_data: dict = json.loads(delete_data.decode())  # Decode the incoming JSON data.

        user_id = received_data.get('id')

        try:
            cursor.execute("DELETE FROM users WHERE id = %s;", (user_id,))
            conn.commit()  # Commit the transaction to delete the user

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins for CORS.
            self.end_headers()

            # Fetch the updated list of users to return
            cursor.execute("SELECT id, first_name, last_name, role FROM users;")
            users = cursor.fetchall()
            user_list = [
                {'id': user[0], 'first_name': user[1], 'last_name': user[2], 'role': user[3]}
                for user in users
            ]

            self.wfile.write(json.dumps(user_list).encode())
        except Exception as e:
            conn.rollback()  # Rollback in case of error
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

# Function to start the HTTP server.
def run(
        server_class: Type[HTTPServer] = HTTPServer,
        handler_class: Type[BaseHTTPRequestHandler] = SimpleRequestHandler,
        port: int = 8000
) -> None:
    server_address: tuple = ('', port)  # Define server address (host and port).
    httpd: HTTPServer = server_class(server_address, handler_class)  # Initialize the HTTP server.

    print(f"Starting HTTP server on port {port}...")  # Print message indicating the server has started.
    httpd.serve_forever()  # Keep the server running.

# Entry point of the program, starts the server when script is run.
if __name__ == '__main__':
    run()
