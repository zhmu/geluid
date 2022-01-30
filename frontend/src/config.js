let config;

if (process.env.NODE_ENV === "production") {
    config = {
        $api_url: "/api"
    }
} else {
    config = {
        $api_url: "http://localhost:8000/api"
    };
}

export { config }
