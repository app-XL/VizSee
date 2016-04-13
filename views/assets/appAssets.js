module.exports = {

 assets : {
	"app-css": {
		"dev":[
			"/public/assets/w/styles/layout.css",
			"/public/assets/w/styles/pagestyles.css",
			"/public/assets/w/styles/materialform.css",
			"/public/assets/w/styles/dataview-table.css",
			"/public/assets/w/styles/dataview-panels.css",
			"/public/assets/w/styles/userpicker.css",

			"/public/assets/g/css/sidebar.css",
			"/public/assets/m/css/font.css",
			"/public/assets/g/css/rateit.css",
			"/public/assets/g/css/toaster.css"

		],
		"prod":[
			"/public/assets/w/styles/layout.min.css",
			"/public/assets/w/styles/pagestyles.min.css",
			"/public/assets/w/styles/materialform.min.css",
			"/public/assets/w/styles/dataview-table.min.css",
			"/public/assets/w/styles/dataview-panels.min.css",
			"/public/assets/w/styles/userpicker.min.css",

			"/public/assets/g/css/sidebar.css",
			"/public/assets/m/css/font.css",
			"/public/assets/g/css/rateit.css",
			"/public/assets/g/js/toaster.css"
		]
	},

	"utils":{
		"dev":[
			"/public/assets/g/js/utils.js"
		],
		"prod":[
			"/public/assets/g/js/utils.js"
		]
	},

	"index":{
		"dev":[
			"/public/assets/w/styles/index.css"
		],
		"prod":[
			"/public/assets/w/styles/index.css"
		]
	},

	"home":{
		"dev":[
			"/public/assets/w/styles/dashboard.css"
		],
		"prod":[
			"/public/assets/w/styles/dashboard.css"
		]
	},

	"admin":{
		"dev":[
			"/public/mods/admin/users/usersModule.js",
			"/public/mods/admin/users/usersControllerMain.js",
			"/public/mods/admin/users/usersRouter.js"
		],
		"prod":[
			"/public/mods/admin/users/usersModule.js",
			"/public/mods/admin/users/usersControllerMain.js",
			"/public/mods/admin/users/usersRouter.js"
		]
	},

	"dir-web":{
		"dev":[
			"/public/d/userProfile/script.js",
			"/public/d/userDisplay/script.js",
			"/public/d/user/script.js",
			"/public/d/invitees/script.js",
			"/public/d/fileUpload/script.js",
			"/public/d/fileAttachment/script.js",
			"/public/d/datePicker/script.js",
			"/public/d/confirmDialog/script.js",
			"/public/d/clientDisplay/script.js",
			"/public/d/richText/script.js",
			"/public/d/feedbackDirective/script.js",
			"/public/assets/g/js/rateit.js",
			"/public/assets/g/js/toaster.js"
		],
		"prod":[
		]
	},

	"filters-web":{
		"dev":[
			"/public/f/date/script.js"
		],
		"prod":[
		]
	},

	"customize":{
		"dev":[
			"/public/mods/keynotes/keynotesModule.js",
			"/public/mods/keynotes/keynotesControllerMain.js",
			"/public/mods/keynotes/keynotesRouter.js",

			"/public/mods/facts/factsModule.js",
			"/public/mods/facts/factsControllerMain.js",
			"/public/mods/facts/factsRouter.js",

			"/public/mods/feedback/feedbackModule.js",
			"/public/mods/feedback/feedbackControllerMain.js",
			"/public/mods/feedback/feedbackRouter.js",

			"/public/mods/contactList/contactListModule.js",
			"/public/mods/contactList/contactListControllerMain.js",
			"/public/mods/contactList/contactListRouter.js"
		],
		"prod":[
			"/public/mods/keynotes/keynotesModule.js",
			"/public/mods/keynotes/keynotesControllerMain.js",
			"/public/mods/keynotes/keynotesRouter.js"
		]
	},

	"clients":{
		"dev":[
			"/public/mods/clients/clientsModule.js",
			"/public/mods/clients/clientsControllerMain.js",
			"/public/mods/clients/clientsRouter.js"
		],
		"prod":[
		]
	},

	"visits":{
		"dev":[

			"/public/mods/visits/visitsModule.js",
			"/public/mods/visits/visitsControllerMain.js",
			"/public/mods/visits/sessions/sessionsControllerMain.js",
			"/public/mods/visits/visitsRouter.js",
             "/public/assets/js/calendar.js",
            "/public/mods/visits/calendarCtrl.js"
		],
		"prod":[
		]
	},

	"profile":{
		"dev":[
			"/public/mods/profile/profileModule.js",
			"/public/mods/profile/profileControllerMain.js",
			"/public/mods/profile/profileRouter.js"
		],
		"prod":[
		]
	},

	"dir-mobile":{
		"dev":[
			"/public/d/userDisplay/script.js",
			"/public/d/feedbackDirective/script.js",
			"/public/d/scroll/scroll.js",
			"/public/d/header/header.js",
			"/public/d/userView/script.js",
			"/public/assets/g/js/rateit.js",
			"/public/assets/g/js/toaster.js"
		],
		"prod":[
		]
	},

	"filters-mobile":{
		"dev":[
			"/public/f/date/script.js"
		],
		"prod":[
		]
	},

	"m-common":{
		"dev":[
			"/public/assets/m/css/font.css",
			"/public/assets/m/css/style.css",
			"/public/assets/m/css/header.css",
			"/public/assets/m/css/userview.css"
		],
		"prod":[

		]

	},

	"m-main":{
		"dev":[
			"/public/m/home/home.js",
			"/public/m/home/homeCtrl.js",
			"/public/d/geoLocation/locator.js",
			"/public/d/geoLocation/locator-tpl.js",
			"/public/assets/m/css/welcome.css",
			"/public/assets/m/css/thankyou.css"
		]

	},


	"m-facts":{
		"dev":[
			"/public/assets/m/css/fact.css",
			"/public/assets/m/css/lctnGalry.css",

			"/public/m/facts/facts.js",
			"/public/m/facts/factsCtrl.js",
			"/public/m/facts/lctnGalry/lctnGalryCtrl.js"
		],
		"prod":[

		]
	},

	"m-visits":{
		"dev":[
			"/public/m/visits/visits.js",
			"/public/m/visits/visitsCtrl.js",
			"/public/assets/m/css/myVisitPage.css",
			"/public/assets/m/css/visitspoc.css"
		]
	},

	"m-sessions":{
		"dev":[
			"/public/m/sessions/sessions.js",
			"/public/m/sessions/sessionsCtrl.js",
			"/public/assets/m/css/sessions.css",
			"/public/assets/m/css/sessionDetail.css"
		]
	},

	"m-clientInfo":{
		"dev":[
			"/public/assets/m/css/clientInfo.css",
		    "/public/m/clientInfo/clientInfo.js",
		    "/public/assets/m/css/userview.css"
		    ]
		 },


	"m-execBios":{
		"dev":[
			"/public/assets/m/css/execBios.css",
		    "/public/m/execBios/execBiosCtrl.js"
		    ]
		 },

   "m-feedback":{
		"dev":[
			"/public/assets/m/css/overallFeedback.css",
		    "/public/m/overallFeedback/overallFeedback.js"
		    ]
		 },
		 

	"m-contacts":{
		"dev":[
			"/public/m/contacts/contacts.js",
			"/public/m/contacts/contactsCtrl.js",
			"/public/assets/m/css/visitspoc.css"
			]
		}
	}

};
