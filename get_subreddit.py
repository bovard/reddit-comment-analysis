import json
import sys

path_to_comment_dump = sys.argv[1]

subreddits = ['AskMen', 'AskWomen', 'cats', 'dogs', 'nfl', 'soccer', 'leagueoflegends', 'DotA2']
subreddit_results = []
searches = []
for idx,r in enumerate(subreddits):
	subreddit_results.append([])
	searches.append('"subreddit":"{}"'.format(r))

with open(path_to_comment_dump) as f:
	for line in f:
		for idx, r in enumerate(subreddits):
			if searches[idx] in line:
				subreddit_results[idx].append(line)
				break

for idx, r in enumerate(subreddits):
	print "Collected {} comments from subreddit {}".format(len(subreddit_results[idx]), r)
	with open('./subreddits/{}.json'.format(r), 'w') as f:
		f.write(''.join(subreddit_results[idx]))
