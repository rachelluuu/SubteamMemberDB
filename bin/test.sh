#!/bin/bash

URL=http://localhost:3000

mongo <<EOF
use cuair
db.members.drop();
db.subteams.drop();
EOF

echo
echo '*** Testing insert ***'
lead=$(curl -s -X POST "$URL/insert?type=member&name=Rachel&year=Freshman&subteam=Design" | grep _id | cut -f2 -d: | tr -d '" ')
curl -X POST "$URL/insert?type=member&name=Stephanie&year=Freshman&subteam=Test"
curl -X POST "$URL/insert?type=member&name=Samantha&year=Junior&subteam=Design"
subteam=$(curl -s -X POST "$URL/insert?type=subteam&name=Design&num_people=10&lead=$lead" | grep _id | cut -f2 -d: | tr -d '" ')

echo
echo '*** Testing select ***'
curl "$URL/select?type=member&field=name&value=Rachel"
curl "$URL/select?type=member&field=year&value=Freshman"
curl "$URL/select?type=subteam&field=name&value=Design"

echo
echo '*** Testing select all ***'
curl "$URL/select?type=member&field=all"
curl "$URL/select?type=subteam&field=all"

echo
echo '*** Testing delete ***'
curl -X DELETE "$URL/delete?type=subteam&ids=$subteam"
curl -g -X DELETE "$URL/delete?type=member&ids=[$lead,$lead]"

echo
echo '*** Testing duplicate delete ***'
curl -X DELETE "$URL/delete?type=subteam&ids=$subteam"
curl -g -X DELETE "$URL/delete?type=member&ids=[$lead,$lead]"

echo
echo '*** Testing invalid entries ***'
curl -X POST "$URL/insert?type=xxx&name=Stephanie"
curl -X POST "$URL/insert?type=member&name=Stephanie"
curl "$URL/select?type=yyy&value=Freshman"
curl "$URL/select?type=member&value=Freshman"
curl -X DELETE "$URL/delete?type=zzz&ids=0"
curl -X DELETE "$URL/delete?type=member"
