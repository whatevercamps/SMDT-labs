from twitterscraper import query_tweets
import json
from datetime import datetime
if __name__ == '__main__':
    #queries = ["condon AND pequeño", "condon AND boli", "condon AND bolsa", "condon AND bolsa AND boli", "condon AND romper", "condon AND romper AND efectivo", "condon AND romper AND latex", "condon AND romper AND latex AND sentir", "condon AND romper AND latex AND sentir AND igual", "condon AND regalado", "condon AND regalado AND calidad", "condon AND regalado AND calidad AND romper", "condon AND regalado AND calidad AND romper AND efectivo", "condon AND regalado AND calidad AND romper AND latex", "condon AND regalado AND calidad AND romper AND latex AND sentir", "condon AND regalado AND calidad AND romper AND latex AND sentir AND igual", "condon AND alergia", "condon AND alergia AND latex", "condon AND alergia AND latex AND sentir", "condon AND alergia AND latex AND sentir AND igual", "condon AND ritmo", "condon AND sentir", "condon AND sentir AND igual", "condon AND sin", "condon AND sin AND postday", "condon AND sin AND adentro", "condon AND sin AND adentro AND vagina", "condon AND sin AND adentro AND vagina AND alergia", "condon AND sin AND adentro AND vagina AND alergia AND latex", "condon AND sin AND adentro AND vagina AND alergia AND latex AND sentir", "condon AND sin AND adentro AND vagina AND alergia AND latex AND sentir AND igual", "condon AND sin AND adentro AND vagina AND sentir", "condon AND sin AND adentro AND vagina AND sentir AND igual", "condon AND sin AND natural", "condon AND sin AND natural AND regla", "condon AND sin AND natural AND latex", "condon AND sin AND natural AND latex AND sentir", "condon AND sin AND natural AND latex AND sentir AND igual", "ritmo AND menstruacion", "ritmo AND periodo", "ritmo AND periodo AND infertilidad", "ritmo AND regla", "ritmo AND efectivo", "coca cola AND caliente", "coca cola AND caliente AND echar", "coca cola AND caliente AND echar AND vagina", "coca cola AND caliente AND echar AND vagina AND alergia", "coca cola AND caliente AND echar AND vagina AND alergia AND latex", "coca cola AND caliente AND echar AND vagina AND alergia AND latex AND sentir", "coca cola AND caliente AND echar AND vagina AND alergia AND latex AND sentir AND igual", "coca cola AND caliente AND echar AND vagina AND sentir", "coca cola AND caliente AND echar AND vagina AND sentir AND igual", "coca cola AND caliente AND tomas", "coca cola AND caliente AND tomas AND vagina", "coca cola AND caliente AND tomas AND vagina AND alergia", "coca cola AND caliente AND tomas AND vagina AND alergia AND latex", "coca cola AND caliente AND tomas AND vagina AND alergia AND latex AND sentir", "coca cola AND caliente AND tomas AND vagina AND alergia AND latex AND sentir AND igual", "coca cola AND caliente AND tomas AND vagina AND sentir", "coca cola AND caliente AND tomas AND vagina AND sentir AND igual", "coca cola AND vagina", "coca cola AND vagina AND alergia", "coca cola AND vagina AND alergia AND latex", "coca cola AND vagina AND alergia AND latex AND sentir", "coca cola AND vagina AND alergia AND latex AND sentir AND igual", "coca cola AND vagina AND sentir", "coca cola AND vagina AND sentir AND igual", "despues AND coca cola", "despues AND periodo", "despues AND periodo AND infertilidad", "despues AND postday", "postday AND infertilidad", "postday AND infertil", "postday AND hormonas", "postday AND hormonas AND adentro", "postday AND hormonas AND adentro AND vagina", "postday AND hormonas AND adentro AND vagina AND alergia", "postday AND hormonas AND adentro AND vagina AND alergia AND latex", "postday AND hormonas AND adentro AND vagina AND alergia AND latex AND sentir", "postday AND hormonas AND adentro AND vagina AND alergia AND latex AND sentir AND igual", "postday AND hormonas AND adentro AND vagina AND sentir", "postday AND hormonas AND adentro AND vagina AND sentir AND igual", "postday AND efectivo", "postday AND condon"]
    queries = ["uribe"]
    filename = "prueba"
    now = datetime.now()
    timestamp = datetime.timestamp(now)

    with open("reports_{0}_{1}.json".format(filename, timestamp), 'a') as reports_output:
        with open("tweets_{0}_{1}.json".format(filename, timestamp), 'a') as tweets_output:
            for query in queries:
                count = 0
                for tweet in query_tweets("{0} near:Barranquilla within:100mi -filter:nativeretweets".format(query), limit = 10):
                    tw = {}
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
                    json.dump(tw, tweets_output, ensure_ascii=False)
                    count += 1
                report = {}
                report['query'] = query
                report['obtenidos'] = count
                json.dump(report, reports_output, ensure_ascii=False)