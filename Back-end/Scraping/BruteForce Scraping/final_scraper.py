from twitterscraper import query_tweets
import json
import pickle
from datetime import datetime
import time
import os
import pymongo

client = pymongo.MongoClient("mongodb://54.90.49.105:27017", username='rw_admin_smdt', password='HolocaustoDel84', authSource="smdt")
db = client["smdt"]
queries_collection = db['queries']

if __name__ == '__main__':

    # try:
    #     with queries_collection.watch() as stream:
    #         for insert_change in stream:
    #             print("change", insert_change["documentKey"])
    #             if insert_change["documentKey"] != None:
    #                 querie = queries_collection.find_one(insert_change["documentKey"])
    #                 print("querie", querie)
    #
    # except Exception as es:
    #     # The ChangeStream encountered an unrecoverable error or the
    #     # resume attempt failed to recreate the cursor.
    #     print('error', es)

    bQFiles = [open('queries_bytes_09072020.pkl', 'rb'), open('queries_bytes.pkl', 'rb')]
    for bQFile in bQFiles:
        bigQuery = pickle.load(bQFile)
        now = datetime.now()
        timestamp = datetime.timestamp(now)

        i=0
        tweets=[]
        reports=[]

        first = time.time()
        for query in list(set([" AND ".join(sorted(("".join(qq.split(" "))).split("AND"))) for qq in bigQuery])):
            if query == '':
                continue
            qq = queries_collection.find_one({"name": query})
            i+=1
            print(query)
            if qq is None:
                os.system('twitterscraper "{}" -o {}.json'.format(query, "-".join(query.split()+['{}'.format(int(round(time.time() * 1000)))])))

