#!/bin/sh
echo "Pull and run project"
ssh -i ~/Documents/ssh/starshipbattle/starshipbattle-key.pem ec2-user@ec2-3-144-91-115.us-east-2.compute.amazonaws.com << 'ENDSSH'
    cd /home/ec2-user/app
    rm -rf ./*
    git clone https://github.com/PedroHLeal/CSSStarshipBattle.git
    docker-compose -f docker-compose.prod.yml up
ENDSSH
