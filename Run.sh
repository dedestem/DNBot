#!/bin/bash

screen -S DNBot -X quit
node Init.js
screen -dmS DNBot node Bot.js
