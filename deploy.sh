#!/bin/sh
echo "Pull and run project"
ssh -i ~/Documents/ssh/starshipbattle/starshipbattle-key.pem ec2-user@ec2-3-14-251-225.us-east-2.compute.amazonaws.com << 'ENDSSH'
    cd /home/ec2-user/app
    rm -rf ./*
    git clone https://github.com/PedroHLeal/CSSStarshipBattle.git
    cd CSSStarshipBattle/
    docker-compose -f docker-compose.prod.yml up -d
ENDSSH
