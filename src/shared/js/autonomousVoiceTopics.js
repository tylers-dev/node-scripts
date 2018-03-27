var topics = [
	{
	   "name":"avidemo",
	   "userresponsetext":"Catherine Demo",
	   "aviresponse":[
		  {
			 "text":"Ok, let\'s start with a brief overview.",
			 "voice":"Ok, lets start with a brief overview."
		  }
	   ],
	   "nextTopic":"avioverview"
	},
	{
	   "name":"avioverview",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"I started with a simple idea.  How can sales representatives be more effective while still being trained in an approved way?",
			 "voice":"I started with a simple idea.  How can sales representatives be more effective while still being trained in an approved way?"
		  }
	   ],
	   "nextTopic":"aviactionsoverview"
	},
	{
	   "name":"aviactionsoverview",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"A novel idea emerged.  What if you could provide in-content demos of live material on the sales representative\'s iPads?",
			 "voice":"A novel idea emerged.  What if you could provide in content demos of live material on the sales representative\'s iPads?"
		  }
	   ],
	   "nextTopic":"aviactionspecific"
	},
	{
	   "name":"aviactionspecific",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"That is one of the many things I can do.  By utilizing the content already loaded on the iPad, I can navigate through a digital sales aid and provide training.",
			 "voice":"That is one of the many things I can do.  By utilizing the content already loaded on the iPad, I can navigate through a digital sales aid and provide training."
		  }
	   ],
	   "nextTopic":"avistarttraining"
	},
	{
	   "name":"avistarttraining",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"For example, I can close a pop up and jump to another slide.",
			 "voice":"For example, I can close a pop up and jump to another slide."
		  }
	   ],
	   "nextTopic":"reopen",
	   "action":"jumpToVeevaLink"
	},
	{
	   "name":"reopen",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"I can navigate to any slide or presentation that is Catherine enabled.",
			 "voice":"I can navigate to any slide or presentation that is Catherine enabled."
		  }
	   ],
	   "nextTopic":"buttonclick"
	},
	{
	   "name":"buttonclick",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"I can \"tap\" buttons in the slide to activate content.",
			 "voice":"I can \"tap\" buttons in the slide to activate content."
		  }
	   ],
	   "action":"buttonClick"
	},
	{
	   "name":"pagescroll",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"I can scroll the slide.",
			 "voice":"I can scroll the slide."
		  }
	   ],
	   "action":"scrollThePage"
	},
	{
	   "name":"toggleISI",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"I can open the ISI.",
			 "voice":"I can open the I S I."
		  }
	   ],
	   "action":"aviToggleISI"
	},
	{
	   "name":"summary",
	   "userresponsetext":"",
	   "aviresponse":[
		  {
			 "text":"This demonstration represents only a fraction of my potential.  Imagine being able to provide your sales representatives with example sales calls based off of current market data available directly within the content they will be detailing with.  Imagine being able to remotely train new representatives with the very tool they will be using.  If you can imagine it, I can probably do it.  Imagine Catherine.",
			 "voice":"This demonstration represents only a fraction of my potential.  Imagine being able to provide your sales representatives with example sales calls based off of current market data available directly within the content they will be detailing with.  Imagine being able to remotely train new representatives with the very tool they will be using.  If you can imagine it, I can probably do it.  Imagine Catherine."
		  }
	   ],
	   "nextTopic":"ENDOFPATH",
	   "action":"openFullAVI"
	}
]