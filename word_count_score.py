# usage: python word_count_score.py subreddits/cats.json subreddits/dogs.json
# reqs: pip install stop-words

import json
import sys
import stop_words


def get_words_counts(filename):
	"""
	Reads in a file with reddit comment json
	@returns a dictionary of words with scores and counts
	example:
	{
		"egg": (250, 50)
	}
	egg was mentioned in 50 unique comments
	the total score for all unique comments was 250
	(so avarge would be 250/50 = 5)
	"""
	print "Processing {}".format(filename)

	# we'll ignore stop words (the, is, and, etc...)
	stopwords = stop_words.get_stop_words('english')

	words_scores = {}
	with open(filename) as f:
		for entry in f.readlines():
			entry = json.loads(entry)
			words = entry['body']
			score = entry['score']

			# removes all non-space, non-alpha characters
			import re
			words = " ".join(re.findall("[a-zA-Z ']+", words))

			# makes everything lowercase
			words = words.lower()

			# used so we only count the word once per comment
			mentioned = [] 
			for word in words.split(' '):
				if word.startswith("'"):
					word = word[1:]
				if word.endswith("'"):
					word = word[:-1]

				word = word.strip()
				if len(word) < 2:
					continue
				if word in stopwords:
					continue

				if words_scores.get(word) is None:
					words_scores[word] = (int(score), 1)
				elif word not in mentioned:
					mentioned.append(word)
					previous = words_scores[word] 
					words_scores[word] = (previous[0] + int(score), previous[1] + 1)
	return words_scores

def write_words_scores(words_scores):
	with open('output.txt', 'w') as output:
		for word, scores in words_scores.items():
			try:
				output.write("{}\t{}\t{}\n".format(word, scores[0], scores[1]))
			except Exception, e:
				pass

def sort_and_normalize(words_counts):
	"""
	Normalizes and sorts the words_counts by total score
	"""
	sorted_words_counts = sorted(words_counts.items(), key=lambda entry: entry[1][0], reverse=True)
	max_score = sorted_words_counts[0][1][0]

	normalized = []
	for entry in sorted_words_counts:
		word = entry[0]
		score, count = entry[1]
		normalized_score = round(float(score) / max_score, 3)
		normalized.append((str(word), (normalized_score, score, count)))

	return normalized


def get_top_bottom(words_counts, n=100):
	"""
	Gets the top and bottom n words by total score
	@returns top_words, bottom_words
	"""
	sorted_words_counts = sorted(words_counts.items(), key=lambda entry: entry[1][0])
	print "Bottom words"
	for i in range(n):
		print sorted_words_counts[i]
	print ''
	print "Top Words"
	for i in range(1, n + 1):
		print sorted_words_counts[i * -1]


def main():
	if len(sys.argv) < 3:
		print "You need to specify two files to process"
		print "Example: python word_count_score.py subreddits/cats.json subredddits/dogs.json"
		exit()

	first_file = sys.argv[1]
	second_file = sys.argv[2]

	first_words_counts = get_words_counts(first_file)
	second_words_counts = get_words_counts(second_file)

	print "Number of words found for each:"
	print len(first_words_counts.keys()), len(second_words_counts.keys())

	print ''
	print "getting top words for {}".format(first_file)
	first_normalized = sort_and_normalize(first_words_counts)
	for i in range(100):
		print first_normalized[i]
	print ''
	print "getting top words for {}".format(second_file)
	second_normalized = sort_and_normalize(second_words_counts)
	for i in range(100):
		print second_normalized[i]


if __name__ == "__main__":
    main()