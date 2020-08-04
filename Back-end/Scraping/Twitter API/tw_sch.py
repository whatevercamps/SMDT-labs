import tweepy

token = '1040981370-TlnLFX9E6IdhobaSKzCYXRv0PTLmOQ5kY6OtdPw'
token_secret = 'nCsrtMcwqvLsI5l1DrC5joFGi7U0dpk7ja6brnzsFX6BR'
consumer_key = 'amCXTgnly8fJEx8ChttQjC2cD'
consumer_secret = 'CLMue2eoZVr0jxJcrDVgEeSIMepeguKHdELz1MlPSmIlXcMsgl'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(token, token_secret)

api = tweepy.API(auth)

places = api.geo_search(query="USA",granularity="country")
place_id = places[0].id
tweets = api.search(q="place:%s" % place_id)
print(len(tweets))
##fetched_tweets = api.search("condom", geocode=place_id, count = 300)
# parsing tweets one by one
#print(fetched_tweets)