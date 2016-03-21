ECHO OFF
ECHO Populating cViz-Test DB


ECHO:
ECHO Creating User Collection
mongoimport --db cViz-Test --collection users --file jsonFiles\user.json --type json --jsonArray



ECHO:
ECHO Creating Group Collection
mongoimport --db cViz-Test --collection groups --file jsonFiles\group.json --type json --jsonArray



ECHO:
ECHO Creating Client Collection
mongoimport --db cViz-Test --collection clients --file jsonFiles\client.json --type json --jsonArray



ECHO:
ECHO Creating Visit Collection
mongoimport --db cViz-Test --collection visits --file jsonFiles\visit.json --type json --jsonArray



ECHO:
ECHO Creating Visit_schedule Collection
mongoimport --db cViz-Test --collection visit_schedules --file jsonFiles\visit_schedule.json --type json --jsonArray



ECHO:
ECHO Creating Teaser Collection
mongoimport --db cViz-Test --collection teasers --file jsonFiles\teaser.json --type json --jsonArray



ECHO:
ECHO Creating CityFacts Collection
mongoimport --db cViz-Test --collection city_facts --file jsonFiles\cityFacts.json --type json --jsonArray




ECHO:
ECHO Creating FactSheet Collection
mongoimport --db cViz-Test --collection fact_sheets --file jsonFiles\factSheet.json --type json --jsonArray


ECHO:
ECHO Creating ListOfValues Collection
mongoimport --db cViz-Test --collection lovs --file jsonFiles\lov.json --type json --jsonArray



ECHO:
PAUSE

