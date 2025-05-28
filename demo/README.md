# Demo Application

This directory contains the demo application for `vue-advanced-chat`.

## Running with Docker

To build and run the demo application using Docker:

1.  **Navigate to the demo directory:**
    ```bash
    cd demo
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t vue-advanced-chat-demo .
    ```

3.  **Run the Docker container:**
    ```bash
    docker run -p 8080:80 vue-advanced-chat-demo
    ```
    This will start the demo application, and you can access it at [http://localhost:8080](http://localhost:8080) in your web browser.
