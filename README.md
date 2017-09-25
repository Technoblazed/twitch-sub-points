### Installation Instructions

#### Requirements

1. NodeJS (6.4 and later)

#### Installation Instructions

1. Setup the config.json file with the required information. Note that the actual subscription count and point count may need to be offsetted. This is due to free subscriptions, as well as those used on the bots and the streamer. Below is further information about the config:

```
{
  "twitch": {
    "channel_id": "<TWITCH CHANNEL ID>",
    "client_id": "<TWITCH CLIENT ID>",
    "oauth": "<OAUTH TOKEN WITH CHANNEL_SUBSCRIPTIONS SCOPE>"
  },
  "offsets": {
    "points": <POINT OFFSET TO MATCH DASHBOARD VALUE>,
    "subs": <SUB OFFSET TO MATCH DASHBOARD VALUE>
  }
}
```

```
git clone https://github.com/technoblazed/twitch-sub-points.git
cd twitch-sub-points/
npm install
npm start
```
