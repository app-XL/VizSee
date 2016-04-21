Dear {{name.prefix}} {{name.first}} {{name.last}},

CSC Welcomes you to India.

We would like to invite you Visit Portal application, CSC visit agenda management tool...
Please click here {{link}} (or copy paste the below link in your browser address bar) to open the visit agenda.
{{appPath}}

Here is your visit schedule:

		{% for sch in schedule %}
			{{ sch.day }} | {{ sch.date|date('jS \o\f F, Y')}}  | {{ sch.location }}  |  {{ sch.climate.daylike}} with {{ sch.climate.temperature}}&deg;C
		{% endfor %}

For any further details please feel free to contact the visit manager:

		{{spoc.name.prefix}} {{spoc.name.first}} {{spoc.name.last}}
		Email: {{spoc.email}}
		Contact: {{spoc.contactNo[0].contactNumber}}

Best Regards,
Visit Portal Team, CSC

Note: This is an auto generated mail from Visit Portal. Please do not reply.
