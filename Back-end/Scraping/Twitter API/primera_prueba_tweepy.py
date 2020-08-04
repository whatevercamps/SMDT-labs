#!/usr/bin/env python
# coding: utf-8

# In[21]:


import tweepy


# In[33]:


token = '1040981370-TlnLFX9E6IdhobaSKzCYXRv0PTLmOQ5kY6OtdPw'
token_secret = 'nCsrtMcwqvLsI5l1DrC5joFGi7U0dpk7ja6brnzsFX6BR'
consumer_key = 'amCXTgnly8fJEx8ChttQjC2cD'
consumer_secret = 'CLMue2eoZVr0jxJcrDVgEeSIMepeguKHdELz1MlPSmIlXcMsgl'


# In[25]:


auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(token, token_secret)


# In[27]:


api = tweepy.API(auth)


# In[ ]:


###### co_id = '0639360bd49a15e3' #es el cod de colombia


# In[151]:


#geo = api.reverse_geocode(lat="4.710989", long="-74.072090", granularity="country")
places = api.geo_search(query="Colombia",granularity="country")


# In[152]:


geocode = "{},{},600km".format(places[0].centroid[1], places[0].centroid[0])


# In[153]:


tweets = api.search(q = 'colombia', geocode = geocode, count=3000)


# In[154]:


tweets[0]._json


# In[155]:


len(tweets)


# In[ ]:




