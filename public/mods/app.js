'use strict';

angular.module('cviz-admin', ['users','confirmDialogDirective']);

angular.module('cviz-customize',
	['userprofileDirective','userDirective','userdisplayDirective',
	'appFilters',
	'datePicker',
	'keynotes','facts','feedback','confirmDialogDirective','contactList','richTextDirective','ngRateIt','feedbackDirective','dropzone']);

angular.module('cviz-manage',
	['userprofileDirective','userDirective','userdisplayDirective', 'clientDisplayDirective', 'inviteesDirective',
	'appFilters',
	'datePicker','dropzone','fileuploadDirective',
	'visits',"clients",'confirmDialogDirective','richTextDirective','ngRateIt']);

angular.module('cviz-profile',
	['userprofileDirective','userDirective','userdisplayDirective',
	'appFilters',
	'datePicker','dropzone','fileuploadDirective',
	'profile']);
