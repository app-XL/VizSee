Hi, 

<p>A new client visit has been initiated by <b>{{createBy.name.first}} {{createBy.name.last}}</b>.</p>

Client name: {% if client.name != client.subName %} {{client.name}} {{client.subName}} {% endif %}
{% if client.name == client.subName %} {{client.name}} {% endif %}				
<br/>
Visit date: {{startDate|date('d M Y')}} - {{endDate|date('d M Y')}}<br/>
Visit locations: {{locations}}

<p>Please acknowledge the visit by clicking <a href="{{loginPath}}" title="CSC Visit Portal">here</a>.</p>
<p>
Thanks.<br>
CSC India Visit Management Team<br>
Connect with us at: Link to C3 page
</p>
<hr/>