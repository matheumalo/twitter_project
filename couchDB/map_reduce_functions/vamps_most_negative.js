//Map function to get the most negative tweets mentioning The Vamps band
//The tweets have to be scored lower than -0.75 by Meaningcloud
//(out of a scale of -1 to 1)


function(doc) {
	topics = ['onstagewiththevamps', 'vamps', '@thevampsband', '@thevampscon', 'vampsband']
	user_name = doc.tweet_data.user.screen_name
	tweet = doc.tweet_data.text.toLowerCase()
	tweet_id = doc._id

	if (is_mentioned(topics, doc)){
		score = doc.meaningcloud.score
		if (score && parseFloat(score) < -0.75){
 			emit([user_name,tweet_id], [tweet, score]);
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
	//look for it in meaningcloud entity list
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
	else if (doc.meaningcloud.entity_list){
        doc.meaningcloud.entity_list.forEach(function(entity){
        	topics.forEach(function(t){
		        if(entity.text.toLowerCase() == t){
		        	eval = true
		 		}
        	});
		});
	}
	//if the specific topics words is not mentioned in tweet look for it in hashtag
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
