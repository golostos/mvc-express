module.exports = {
    secret: "supersecretpassword",
    port: process.env.PORT || 4000,
    production: ((process.env.NODE_ENV === "production") ? true : false)
}