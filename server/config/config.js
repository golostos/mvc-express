const uri = {
  type: "string",
  format: "uri",
  maxLength: 256
}

module.exports = {
  secret: "supersecretpassword",
  port: process.env.PORT || 4000,
  production: ((process.env.NODE_ENV === "production") ? true : false),
  profileSchema: {
    type: "object",
    properties: {
      facebook: uri,
      vk: uri,
      github: uri,
      twitter: uri,
      linkedIn: uri,
      aboutMe: { type: "string", maxLength: 2048 }
    },
    additionalProperties: false
  }
}