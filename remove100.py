#!/usr/bin/env python

import json
import csv
from pprint import pprint

with open('wordcloud/data.json') as data_file:    
    data = json.load(data_file)

#pprint(data)

wordlist = []
with open("top100words.csv", "rU") as f:
    reader = csv.reader(f)
    for row in reader:
        wordlist.append(row[1])

print wordlist

with open('wordcloud/data.json') as data_file:    
    data = json.load(data_file)
    
count = 0
deleteWords = []
for word in data["dataTable"]:
    if word in wordlist:
        deleteWords.append(word)
        count += 1
print count

for word in deleteWords:
    del data["dataTable"][word]
    print "deleted:", word


with open('newdata.json', 'w') as outfile:
    json.dump(data, outfile)