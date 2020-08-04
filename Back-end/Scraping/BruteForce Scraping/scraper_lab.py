from twitterscraper import query_tweets
import json
import pickle
from datetime import datetime
import time
if __name__ == '__main__':

    queries = ["condon AND pequeño", "condon AND boli", "condon AND bolsa", "condon AND bolsa AND boli", "condon AND romper", "condon AND romper AND efectivo", "condon AND romper AND latex", "condon AND romper AND latex AND sentir", "condon AND romper AND latex AND sentir AND igual", "condon AND regalado", "condon AND regalado AND calidad", "condon AND regalado AND calidad AND romper", "condon AND regalado AND calidad AND romper AND efectivo", "condon AND regalado AND calidad AND romper AND latex", "condon AND regalado AND calidad AND romper AND latex AND sentir", "condon AND regalado AND calidad AND romper AND latex AND sentir AND igual", "condon AND alergia", "condon AND alergia AND latex", "condon AND alergia AND latex AND sentir", "condon AND alergia AND latex AND sentir AND igual", "condon AND ritmo", "condon AND sentir", "condon AND sentir AND igual", "condon AND sin", "condon AND sin AND postday", "condon AND sin AND adentro", "condon AND sin AND adentro AND vagina", "condon AND sin AND adentro AND vagina AND alergia", "condon AND sin AND adentro AND vagina AND alergia AND latex", "condon AND sin AND adentro AND vagina AND alergia AND latex AND sentir", "condon AND sin AND adentro AND vagina AND alergia AND latex AND sentir AND igual", "condon AND sin AND adentro AND vagina AND sentir", "condon AND sin AND adentro AND vagina AND sentir AND igual", "condon AND sin AND natural", "condon AND sin AND natural AND regla", "condon AND sin AND natural AND latex", "condon AND sin AND natural AND latex AND sentir", "condon AND sin AND natural AND latex AND sentir AND igual", "ritmo AND menstruacion", "ritmo AND periodo", "ritmo AND periodo AND infertilidad", "ritmo AND regla", "ritmo AND efectivo", "coca cola AND caliente", "coca cola AND caliente AND echar", "coca cola AND caliente AND echar AND vagina", "coca cola AND caliente AND echar AND vagina AND alergia", "coca cola AND caliente AND echar AND vagina AND alergia AND latex", "coca cola AND caliente AND echar AND vagina AND alergia AND latex AND sentir", "coca cola AND caliente AND echar AND vagina AND alergia AND latex AND sentir AND igual", "coca cola AND caliente AND echar AND vagina AND sentir", "coca cola AND caliente AND echar AND vagina AND sentir AND igual", "coca cola AND caliente AND tomas", "coca cola AND caliente AND tomas AND vagina", "coca cola AND caliente AND tomas AND vagina AND alergia", "coca cola AND caliente AND tomas AND vagina AND alergia AND latex", "coca cola AND caliente AND tomas AND vagina AND alergia AND latex AND sentir", "coca cola AND caliente AND tomas AND vagina AND alergia AND latex AND sentir AND igual", "coca cola AND caliente AND tomas AND vagina AND sentir", "coca cola AND caliente AND tomas AND vagina AND sentir AND igual", "coca cola AND vagina", "coca cola AND vagina AND alergia", "coca cola AND vagina AND alergia AND latex", "coca cola AND vagina AND alergia AND latex AND sentir", "coca cola AND vagina AND alergia AND latex AND sentir AND igual", "coca cola AND vagina AND sentir", "coca cola AND vagina AND sentir AND igual", "despues AND coca cola", "despues AND periodo", "despues AND periodo AND infertilidad", "despues AND postday", "postday AND infertilidad", "postday AND infertil", "postday AND hormonas", "postday AND hormonas AND adentro", "postday AND hormonas AND adentro AND vagina", "postday AND hormonas AND adentro AND vagina AND alergia", "postday AND hormonas AND adentro AND vagina AND alergia AND latex", "postday AND hormonas AND adentro AND vagina AND alergia AND latex AND sentir", "postday AND hormonas AND adentro AND vagina AND alergia AND latex AND sentir AND igual", "postday AND hormonas AND adentro AND vagina AND sentir", "postday AND hormonas AND adentro AND vagina AND sentir AND igual", "postday AND efectivo", "postday AND condon"]
    bQFile = open('bigQueryList3.pkl', 'rb')
    bigQuery = pickle.load(bQFile)



    #queries = ["boli"]
    filename = "prueba"
    now = datetime.now()
    timestamp = datetime.timestamp(now)

    i=0
    tweets=[]
    reports=[]

    first = time.time()
    for query in bigQuery[:1]:
        if query == '':
            continue
        i+=1
        count = 0
        print(query)
        for tweet in query_tweets("{0} -filter:nativeretweets".format(query), limit=20, profiles=true):
            tw = tweet.__dict__
            """
            tw['fullname'] = tweet.fullname
            tw['user_id'] = tweet.user_id
            tw['tweet_id'] = tweet.tweet_id
            tw['tweet_url'] = tweet.tweet_url
            tw['timestamp'] = tweet.timestamp.strftime("%d-%b-%Y")
            tw['timestamp_epochs'] = tweet.timestamp_epochs
            tw['replies'] = tweet.replies
            tw['retweets'] = tweet.retweets
            tw['likes'] = tweet.likes
            tw['is_retweet'] = tweet.is_retweet
            tw['retweeter_username'] = tweet.retweeter_username
            tw['retweeter_userid'] = tweet.retweeter_userid
            tw['retweet_id'] = tweet.retweet_id
            tw['text'] = tweet.text
            tw['html'] = tweet.html
            tw['query'] = query
            tw['new_query']= query 
            """
            tw['timestamp'] = tw['timestamp'].strftime("%b %d %Y %H:%M:%S")
            tweets.append(tw)
            count += 1
        report = {}
        report['query'] = query
        report['time'] = time.time() - first
        report['obtenidos'] = count

        reports.append(report)

        with open('tweets31-06-2020-01-48.json', 'a', encoding='utf-8') as tweets_file:
            json.dump(tweets, tweets_file,ensure_ascii=False)

        with open('reports31-06-2020-01-48.json', 'a', encoding='utf-8') as reports_file:
            json.dump(reports, reports_file,ensure_ascii=False)