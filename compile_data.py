import os
import json

SUBREDDITS = './subreddits'

TS_IDX = 0 # Total Score
NS_IDX = 1 # Normalized Score
TC_IDX = 2 # Normalized unique Comments
NC_IDX = 3 # Total unique Comments

reddits = []
reddit_data = {}
top_word_list = set()
top_words = {}
data_frame = {}


def normalize(words_counts):
    """
    Normalizes for comments and score
    """
    sorted_words_counts = sorted(words_counts.items(), key=lambda entry: entry[1][1], reverse=True)
    max_count = sorted_words_counts[0][1][1]
    sorted_words_counts = sorted(words_counts.items(), key=lambda entry: entry[1][0], reverse=True)
    max_score = sorted_words_counts[0][1][0]

    normalized = {}
    for entry in sorted_words_counts:
        word = entry[0]
        score, count = entry[1]
        normalized_score = round(float(score) / max_score, 3)
        normalized_count = round(float(count) / max_count, 3)
        normalized[word] = (
            score,
            normalized_score,
            count,
            normalized_count
        )
    return normalized


def sort_words(normalized_words_counts, by_score=True):
    """
    sorts a normalized words_counts
    """
    idx = 0
    if not by_score:
        idx = 2
    sorted_words_counts = sorted(normalized_words_counts.items(), key=lambda entry: entry[1][idx], reverse=True)
    return sorted_words_counts


# parse each subreddit

for subreddit in os.listdir(SUBREDDITS):
    name = subreddit.split('.')[0]
    print 'parsing {}'.format(name)
    reddits.append(name)

    from word_count_score import get_words_counts

    filename = "{}/{}".format(SUBREDDITS, subreddit)
    word_count_scores = get_words_counts(filename)
    print 'done!'
    print 'processed {} words'.format(len(word_count_scores.keys()))
    print ''
    normalized = normalize(word_count_scores)
    reddit_data[name] = normalized

    # add to top_words
    sorted_words = sort_words(normalized)
    sorted_words = sorted_words[:100]
    sorted_words = [e[0] for e in sorted_words]
    top_words[name] = sorted_words


    # add to top_word_list
    for w in sorted_words:
        top_word_list.add(w)



# combine everything into data_frame
print ''
print 'combining everything!'
for word in top_word_list:
    entry = {}
    for r in reddits:
        if reddit_data[r].get(word):
            entry[r] = {
                "ts": reddit_data[r][word][TS_IDX],
                "ns": reddit_data[r][word][NS_IDX],
                "tc": reddit_data[r][word][TC_IDX],
                "nc": reddit_data[r][word][NC_IDX]
            }
        else:
            entry[r] = {
                "ts": 0,
                "ns": 0,
                "tc": 0,
                "nc": 0
            }
    data_frame[word] = entry

print 'writing file!'
print 'a total of {} unique words'.format(len(top_word_list))
all_data = {
    'dataTable': data_frame,
    'allWords': list(top_word_list),
    'subredditTopWords': top_words,
    'subreddits': reddits
}

with open('data.json', 'w') as f:
    f.write(json.dumps(all_data))
