const config = {
  "interval": (60000 * 5),
  "relayPin": "3",
  "boardCommPort": "COM4",
  "teamCity": {
    "username": "[YOUR TEAM CITY USER NAME]",
    "password": "[YOUR TEAM CITY PASSWORD]",
    "builds": [
      {
        "url": "[YOUR BUILD SERVER STATUS URL]",
        "buildName": "[BUILD NAME]"
      },
      {
        "url": "[YOUR BUILD SERVER STATUS URL]",
        "buildName": "[BUILD NAME]"
      },
      {
        "url": "[YOUR BUILD SERVER STATUS URL]",
        "buildName": "[BUILD NAME]"
      }
    ]
  }
}

module.exports = config;