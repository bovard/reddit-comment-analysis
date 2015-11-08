# usage: python word_count_score.py subreddits/cats.json
# reqs: pip install stop-words

import json
import sys
import stop_words


if len(sys.argv) < 2:
	print "You need to specify a file to process"
	print "Example: python word_count_score.py subreddits/cats.json"
	exit()

filename = sys.argv[1]

print "Processing {}".format(filename)

stopwords = stop_words.get_stop_words('english')

with open(filename) as f:
	words_scores = {}
	for entry in f.readlines():
		entry = json.loads(entry)
		words = entry['body']
		score = entry['score']
		import re
		words = " ".join(re.findall("[a-zA-Z ]+", words))
		words = words.lower()
		for word in words.split(' '):
			word = word.strip()
			if word in stopwords:
				continue

			if words_scores.get(word) is None:
				words_scores[word] = (int(score), 1)
			else:
				previous = words_scores[word] 
				words_scores[word] = (previous[0] + int(score), previous[1] + 1)

with open('output.txt', 'w') as output:
	for word, scores in words_scores.items():
		try:
			output.write("{}\t{}\t{}\n".format(word, scores[0], scores[1]))
		except Exception, e:
			pass


