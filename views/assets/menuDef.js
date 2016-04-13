module.exports = {
	items :[
		{
			name: "Welcome",
			link: "/m/main/",
			icon: "fa-home",
			roles: "customer"
		},
		{
			name: "Dashboard",
			link: "/",
			icon: "fa-tachometer",
			roles: "exec,vManger"
		},
		{
			name: "My Visits",
			link: "/m/visits/#/visits/all/my",
			icon: "fa-calendar",
			roles: "user,exec,vManger"
		},
		{
			name: "Add Visit",
			link: "dummy",
			icon: "fa-plus",
			roles: "user,vManger"
		},
		{
			name: "Agenda",
			link: "/m/visits/#/agenda",
			icon: "fa-list",
			roles: "user,customer,exec,vManger"
		},
		{
			name: "Exec Bios",
			link: "/m/main/#/execBios",
			icon: "fa-group",
			roles: "user,customer,exec,vManger"
		},
		{
			name: "Contacts",
			link: "/m/visits/#/contacts",
			icon: "fa-phone",
			roles: "user,exec,customer,vManger"
		},
		{
			name: "Quick Facts",
			link: "/m/facts/",
			icon: "fa-line-chart",
			roles: "user,exec,customer,vManger"
		},
		{
			name: "Feedback",
			link: "/m/main/#/feedback",
			icon: "fa fa-comments",
			roles: "exec,customer"
		},
		{
			name: "Logout",
			link: "/logout",
			icon: "fa-sign-out",
			roles: "user,exec,customer,vManger"
		}
	]
}
