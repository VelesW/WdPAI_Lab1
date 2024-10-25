import json
import random
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Type

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
        # {
        #     'id': 2,
        #     'first_name': 'John',
        #     'last_name': 'Doe',
        #     'role': 'Student'
        # },
        # {
        #     'id': 3,
        #     'first_name': 'Jane',
        #     'last_name': 'Austen',
        #     'role': 'Designer'
        # }
        # }
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
        self.send_response(200)  # Success response.
        self.send_header('Content-type', 'application/json')  # Content type is JSON.
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow all origins (CORS).
        self.end_headers()
        self.wfile.write(json.dumps(self.user_list).encode())  # Sends user list as JSON response.

    # Handles POST requests, adds a new user to the user list.
    def do_POST(self) -> None:
        content_length: int = int(self.headers['Content-Length'])  # Get the length of the incoming data.
        post_data: bytes = self.rfile.read(content_length)  # Read the incoming POST data.
        received_data: dict = json.loads(post_data.decode())  # Decode the incoming JSON data.

        # Collect all existing IDs to ensure the new ID is unique.
        existing_ids = {user['id'] for user in self.user_list if 'id' in user}
        
        # Generate a unique ID for the new user.
        new_id = self.generate_unique_id(existing_ids)

        # Create a new user entry from the received data.
        new_user = {
            'id': new_id,
            'first_name': received_data['firstName'],
            'last_name': received_data['lastName'],
            'role': received_data['role']
        }
        self.user_list.append(new_user)  # Append the new user to the list.

        # Prepare a response confirming the POST request and the received data.
        response: dict = {
            "message": "User added successfully",
            "received": received_data
        }

        # Send success response with JSON data.
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow all origins (CORS).
        self.end_headers()
        self.wfile.write(json.dumps(self.user_list).encode())  # Send response as JSON.

    # Handles DELETE requests, removes a user based on the ID provided in the request.
    def do_DELETE(self) -> None:
        content_length: int = int(self.headers['Content-Length'])  # Get the length of the incoming data.
        delete_data: bytes = self.rfile.read(content_length)  # Read the incoming DELETE data.
        received_data: dict = json.loads(delete_data.decode())  # Decode the incoming JSON data.

        # Extract the user ID from the received data.
        user_id = received_data.get('id')

        # Filter the user list to remove the user with the given ID.
        SimpleRequestHandler.user_list = [user for user in self.user_list if "id" in user and user['id'] != user_id]

        # Send success response after deletion with the updated user list.
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow all origins (CORS).
        self.end_headers()
        self.wfile.write(json.dumps(self.user_list).encode())  # Send updated user list as JSON.

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
