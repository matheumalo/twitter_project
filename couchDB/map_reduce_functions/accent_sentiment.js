//Map function to get the average sentiment of tweets that mention 'accent'
//In Birmingham

function(doc) {
	topics = ['accent']
	user_name = doc.tweet_data.user.screen_name
	if (is_mentioned(topics, doc)){
		if (doc.meaningcloud.score){
			score = doc.meaningcloud.score
 			emit('Accent tweet', [1, parseFloat(score)]);
		}
	}
}

function is_mentioned(topics, doc){
	//checks where the word appears in tweet or mentioned
	eval = false
	tweet = doc.tweet_data.text.toLowerCase()
	tweet_words = tweet.split(" ")
	topics.forEach(function(t){
		if (tweet_words.indexOf(t) > -1){
			eval = true
		}
	});
	//looks for it in hash tags
	if(doc.tweet_data.entities){
    	if(doc.tweet_data.entities.hashtags){
            doc.tweet_data.entities.hashtags.forEach(function(hashtag){
            	topics.forEach(function(t){
	                if((hashtag.text).toLowerCase() == t){
	                	eval = true
	                }
            	});
            });
        }
	//look for it in meaningcloud entity list
	else if (doc.meaningcloud.entity_list){
        doc.meaningcloud.entity_list.forEach(function(entity){
        	topics.forEach(function(t){
		        if(entity.text.toLowerCase() == t){
		        	eval = true
		 		}
        	});
		});
	}
    //if still not found look for it in the meaningcloud concept list for the tweet
    } else if (doc.meaningcloud.concept_list){
        doc.meaningcloud.concept_list.forEach(function(concept){
        	topics.forEach(function(t){
		        if(concept.text.toLowerCase() == t){
		        	eval = true
		 		}
        	});
		});
	}
    return eval
}