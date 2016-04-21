<font face="calibri" size="8pt" color="black">
	Dear <b>{{name.prefix}} {{name.first}} {{name.last}},</b>

	<p>
	CSC Welcomes you to India.
	</p>

	<p>
		We would like to invite you Visit Portal application, CSC visit agenda management tool...<br/>
		Please <a href="{{loginPath}}" title="CSC Visit Portal">click here</a>
	  (or copy paste the below link in your browser address bar) to open the visit agenda.<br/>
		{{loginPath}}
	</p>

	<font face="calibri" size="8pt" color="maroon">
		Here is your visit schedule:<br/>
	</font>

	<font face="calibri" size="8pt" color="maroon">
	<table border="1">
		<tr>
			<td>#</td>
			<td>Date</td>
			<td>City</td>
			<td>Weather</td>
		</tr>

		{% for sch in schedule %}
		<tr>
			<td>{{ sch.day}}</td>
			<td>{{ sch.date|date('jS \o\f F, Y') }}</td>
			<td>{{ sch.location }}</td>
			<td>{{ sch.climate.daylike}} with {{ sch.climate.temperature}}&deg;C</td>
		</tr>
		{% endfor %}
	</table>
	</font>

	<br/><br/>
	<font color="maroon">
		For any further details please feel free to contact the visit manager:<br/>
	</font>

	<font size="8pt" color="gray">
			<img src='{{hostPath}}{{spoc.avatar}}'/> {{spoc.name.prefix}} {{spoc.name.first}} {{spoc.name.last}}<br/>
			Email: {{spoc.email}}<br/>
			Contact: {{spoc.contactNo[0].contactNumber}}
	</font>

	<p>
		Best Regards,<br/>
		Visit Portal Team, CSC
	</p>

	<hr/>
	<font size="8pt" color="gray">
	Note: This is an auto generated mail from Visit Portal. Please do not reply.
	</font>
</font>
