# Demo Application

This directory contains the demo application for `vue-advanced-chat`.

## Running with Docker

To build and run the demo application using Docker:

1.  **Navigate to the demo directory:**
    Make sure you are in the `demo` directory of this project.
    ```bash
    cd path/to/your-project/demo
    ```

2.  **Build the Docker image:**
    Run the following command from within the `demo` directory. The `.` specifies that the current directory (`demo/`) is the build context.
    ```bash
    docker build -t vue-advanced-chat-demo .
    ```

3.  **Run the Docker container:**
    ```bash
    docker run -p 8080:80 vue-advanced-chat-demo
    ```
    This will start the demo application, and you can access it at [http://localhost:8080](http://localhost:8080) in your web browser.
