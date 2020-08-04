### Libraries
install.packages("ROAuth")
install.packages("tm")
install.packages("NLP")
install.packages("RColorBrewer")
install.packages("wordcloud")
install.packages("plyr")
install.packages("twitteR")
library(twitteR)
library(ROAuth)
library(NLP)
library(tm)
library(RColorBrewer)
library(wordcloud)
library(plyr)

#### Set API Keys

api_key <- "qMFwUUdr9vmKVnFF8i2EeMYrZ"
api_secret <- "qtiGPNnzf0GcteCCfmHCsGdlEDOk0XZUX6p04hom0ouSeJYJX7"
access_token <- "114465621-lzjMG6lPQ51bS7509RflWISsv1hQUjThbseFgXwZ"
access_token_secret <- "XdXWhAf6HXRl7nbhgEl8fJMBfFMDX6aX7DjP3j7pSSHKB"

setup_twitter_oauth(api_key, api_secret, access_token, access_token_secret)


#### buscar condón en bogotá

tweets_condon = searchTwitter('condon', lang = 'es', n=1000)

tweetscond.df = twListToDF(tweets_condon)
tweetscond.df = tweetscond.df[,1]

tweet.corpus = Corpus(VectorSource(tweetscond.df))

tweet.removeURL = function(x) gsub("http[^[:space:]]*","",x)
tweet.removeATUser = function(x) gsub("@[a-z,A-Z]*","",x)
tweet.removeEmoji = function(x) gsub("\\p{So}|\\p{Cn}", "", x, perl = TRUE)
tweet.removeSpecialChar = function(x) gsub("[^[:alnum:]///' ]", "", x)

tweet.corpus = tm_map(tweet.corpus, content_transformer(tweet.removeURL))
inspect(tweet.corpus[1:4])
tweet.corpus = tm_map(tweet.corpus, content_transformer(tweet.removeATUser))
inspect(tweet.corpus[1:4])
tweet.corpus = tm_map(tweet.corpus, content_transformer(tweet.removeEmoji))
inspect(tweet.corpus[1:4])
tweet.corpus = tm_map(tweet.corpus, content_transformer(tweet.removeSpecialChar))
inspect(tweet.corpus[1:4])
tweet.corpus = tm_map(tweet.corpus, removePunctuation, preserve_intra_word_dashes = TRUE)
inspect(tweet.corpus[1:4])
tweet.corpus = tm_map(tweet.corpus, content_transformer(tolower))
inspect(tweet.corpus[1:4])

tweet.corpus=tm_map(tweet.corpus, removeWords, c(stopwords("spanish"), "RT", "rt", "sierra", "alberto", "uribe"))
inspect(tweet.corpus[1:4])
tweet.corpus=tm_map(tweet.corpus, removeNumbers)
inspect(tweet.corpus[1:4])
tweet.corpus = tm_map(tweet.corpus, stripWhitespace)
inspect(tweet.corpus[1:4])

ap.tdm <- TermDocumentMatrix(tweet.corpus)
ap.m <- as.matrix(ap.tdm)
View(ap.m)
inspect(tweet.corpus[200])
dim(ap.m)
ap.v <- sort(rowSums(ap.m),decreasing=TRUE)
ap.d <- data.frame(word = names(ap.v),freq=ap.v)

pal2 <- brewer.pal(8,"Dark2")
png("condon1.png", width=1320,height=1080)
wordcloud(ap.d$word,ap.d$freq, scale=c(8,.2),min.freq=10,
          max.words=Inf, random.order=FALSE, rot.per=.15, colors=pal2)
dev.off()

getwd()
