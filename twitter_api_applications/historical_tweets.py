#!/usr/local/bin/python3.4



import tweepy                               
import time
import calendar
import datetime
import json
import couchdb
from tweepy import OAuthHandler

SCREEN_USER = 'Cholopic'

# Consumer keys and access tokens, used for OAuth
consumer_key = "sEe0b4yXx5uJ54QvtbvfEYPP7"
consumer_secret = "RmHmFvINJOnvxkUNdgMX1UrEyDBQfZobB9yUEx80yUxloKistN"
access_token = "2201707272-Dno4Gb4CHJO9VwaXhOU46bnNA0NRUsMSSozXVTS"
access_token_secret = "ntOU6yld0iOZVE86DKLAqRlcVrqoK2tFyfNWkUFT3AZiU"

def get_tweets(id,api):
	#make initial request for most recent tweets (200 is the maximum allowed by count)
	status_list = api.user_timeline(id, count = 200)
		
	for status in status_list:
		raw_status = json.dumps(status._json)
		json_status = json.loads(raw_status)
		doc_id = json_status["id_str"]
		tweet_lang = json_status["lang"]
		doc = {"_id": doc_id, "tweet_data": json_status}
		store_on_db(doc)
	return

def store_on_db(doc):
	try:
		#db info here
		db_name = 'user'
		localserver = 'http://115.146.95.162:5984'
		couch = couchdb.Server(localserver)
		db = couch[db_name]
		db.save(doc)
		ids = doc['_id']
		print('added: %s ' %ids)
		return
	except couchdb.http.ResourceConflict:
		print("repeated tweet")

def return_status(api):
  #returns the remainings calls to twitter's API
	status = api.rate_limit_status()
	resources = status['resources']['statuses']['/statuses/user_timeline']
	remaining = resources['remaining']
	limit = resources['limit']
	reset_time = resources['reset']
	current_time = calendar.timegm(datetime.datetime.utcnow().timetuple())
	waiting_time = reset_time - current_time
	print('Local time: %s Reset time: %s' %(current_time,reset_time))
	print( 'Remaining: %d / %d' %(remaining,limit))
	return
	
# Replace the API_KEY and API_SECRET with your application's key and secret
auth = OAuthHandler(consumer_key,consumer_secret)
auth.set_access_token(access_token,access_token_secret)
api = tweepy.API(auth, 
        
        # retry 3 times with 5 seconds delay when getting these error codes
        # For more details see 
        # https://dev.twitter.com/docs/error-codes-responses  
        retry_count=3,retry_delay=10,retry_errors=set([401, 404, 500, 503]), 
        # monitor remaining calls and block until replenished  
        wait_on_rate_limit_notify=True, wait_on_rate_limit=True 
)

# Returns an list containing the IDs of users being followed by the specified user.                
followers = api.friends_ids(SCREEN_USER, count = 100 )

while True:
	
	try:
		for f in followers:
			return_status(api)
			get_tweets(f,api)
	except tweepy.TweepError as e:
		print('error: ' + str(e))


	
 	
 	






	

