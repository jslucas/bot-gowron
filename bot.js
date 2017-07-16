var Twit = require('twit');
var twit_config = require('./twit-config');
var MsTranslator = require('mstranslator');
var translate_config = require('./translate-config')
var Profane = require('profane');

var T = new Twit(twit_config);
var bingTranslate = new MsTranslator(translate_config, true);
var p = new Profane();

var stream = T.stream('user');

// anytime someone @ me
stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
	var replyto = eventMsg.in_reply_to_screen_name;
  	var text = eventMsg.text;
  	var from = eventMsg.user.screen_name;
  	var replyId = eventMsg.id_str;

  	var profaneCheck = p.getCategoryCounts(text);

  	if(replyto == 'botGowron') {
  		// Remove my name
  		var string = text.replace(/@botGowron/g,'');
  		

  		// Translate
  		bingTranslate.translate({text: string, to: 'tlh'}, function(err, data) {
  			var response = '@' + from + data;
  			
  			// Post response
  			if(Object.keys(profaneCheck).length < 1) {
  				postTweet(response, eventMsg.id_str);
  			}else{
  				postTweet('@' + from + ' I will not help you.', eventMsg.id_str);
  			}
		});
  	}
}

// Post
function postTweet(txt, id) {

	var tweet = {
	  status: txt,
	  in_reply_to_status_id: id
	}

	T.post('statuses/update', tweet, worked);

	function worked(err, data, response) {
	  if (err) {
	  	console.log("Problem!");
	  } else {
	    console.log("O.K.");
	  }
	}
}