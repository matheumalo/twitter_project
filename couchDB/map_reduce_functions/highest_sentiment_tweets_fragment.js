 	date = new Date(Date.parse((doc.tweet_data.created_at)));
	weekday = getWeekday(date.getDay())
	hour = date.getUTCHours()
	if (hour >= 7 && hour <= 12){
		period = ' Morning'
	} 
	else if (hour > 13 && hour <= 17)
		emit(weekday + ' Afternoon', [1, parseFloat(doc.meaningcloud.score)]);
	else if (hour >= 18 && hour <= 23)
		period = ' Night'
	else {
		return
	}
	if (weekday + period == highest_sentiment_period){
		if(doc.meaningcloud.score){
			if (parseFloat(doc.meaningcloud.score) > 0.8){
				user_name = doc.tweet_data.user.screen_name
				tweet_id = doc.tweet_data.user.id_str
	 			emit([user_name, tweet_id], doc.tweet_data.text);
			}
	 	}
	}
}

function getWeekday(day){
	switch(parseInt(day)){
		case 0:
			return 'Sunday'
		case 1:
			return 'Monday'
		case 2:
			return 'Tuesday'
		case 3:
			return 'Wednesday'
		case 4:
			return 'Thursday'
		case 5:
			return 'Friday'
		case 6:
			return 'Saturday'
		default:
			return "UNDEFINED"
	}
}