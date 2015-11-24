# took about 15 minutes to run on 28G comment file on macbook pro

import json
import sys


path_to_comment_dump = sys.argv[1]

subreddits = {}


with open(path_to_comment_dump) as f:
	for line in f:
		entry = json.loads(line)
		subreddit = entry.get('subreddit')
		if subreddits.get(subreddit) is None:
			subreddits[subreddit] = 1
		else:
			subreddits[subreddit] += 1

counts = subreddits.items()
counts.sort(key=lambda x: x[1], reverse=True)
with open('num_comments.txt', 'w') as f:
	for reddit, score in counts:
		f.write("{}\t{}\n".format(reddit, score))
