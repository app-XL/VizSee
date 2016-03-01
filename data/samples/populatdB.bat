ECHO OFF
ECHO Populating cViz-Test DB


ECHO:
ECHO Creating User Collection
mongoimport --db cViz-Test --collection user --file Json's\user.json --type json --jsonArray



ECHO:
ECHO Creating Client Collection
mongoimport --db cViz-Test --collection client --file Json's\client.json --type json --jsonArray



ECHO:
ECHO Creating Visit Collection
mongoimport --db cViz-Test --collection visit --file Json's\visit.json --type json --jsonArray



ECHO:
ECHO Creating VisitSchedule Collection
mongoimport --db cViz-Test --collection visitSchedule --file Json's\visitSchedule.json --type json --jsonArray

ECHO:
PAUSE