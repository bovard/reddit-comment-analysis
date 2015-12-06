# usage: python word_count_score.py subreddits/cats.json subreddits/dogs.json
# reqs: pip install stop-words

import json
import sys
import stop_words

TOP_HUNDRED = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
               "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
               "this", "but", "his", "by", "from", "they", "we", "say", "her",
               "she", "or", "an", "will", "my", "one", "all", "would", "there",
               "their", "what", "so", "up", "out", "if", "about", "who", "get",
               "which", "go", "me", "when", "make", "can", "like", "time", "no",
               "just", "him", "know", "take", "people", "into", "year", "your",
               "good", "some", "could", "them", "see", "other", "than", "then",
               "now", "look", "only", "come", "its", "over", "think", "also",
               "back", "after", "use", "two", "how", "our", "work", "first",
               "well", "way", "even", "new", "want", "because", "any", "these",
               "give", "day", "most", "us", "com", "http", "shit", "fuck", "fucking"]

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
                if word in TOP_HUNDRED:
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

def combine(first_normalized, second_normalized):
    """
    Takes the top 100 words from both and compares them to the other list
    """
    results = get_association(first_normalized, second_normalized, 100) 

    print ''
    print 'RESULTS!'
    for i in range(10):
        print results[i]

    return results


def get_association(first, second, n=100):
    to_return = []
    print ''
    second_words = [entry[0] for entry in second]
    for i in range(n):
        word = first[i][0]
        if not word in second_words:
            to_return.append((
                first[i][0], 
                first[i][1][0], 
                0, 
                first[i][1][1], 
                0, 
                first[i][1][2], 
                0
            ))
        else:
            idx = second_words.index(word)
            to_return.append((
                first[i][0], 
                first[i][1][0], 
                second[idx][1][0], 
                first[i][1][1], 
                second[idx][1][1], 
                first[i][1][2], 
                second[idx][1][2]
            ))

    print ''
    first_words = [entry[0] for entry in first]
    for i in range(n):
        word = second[i][0]
        if not word in first_words:
            to_return.append((
                second[i][0], 
                0, 
                second[i][1][0], 
                0, 
                second[i][1][1], 
                0, 
                second[i][1][2]
            ))
        else:
            idx = first_words.index(word)
            to_return.append((
                second[i][0], 
                first[idx][1][0], 
                second[i][1][0], 
                first[idx][1][1], 
                second[i][1][1], 
                first[idx][1][2], 
                second[i][1][2]
            ))
    return to_return

def write_to_csv(results, name='output.csv'):
    # de duplicate
    to_export = []
    for r in results:
        if r[0] not in [entry[0] for entry in to_export]:
            to_export.append(r)
    results = to_export
    import csv
    fieldnames = ["word", "norm score a", "norm score b", "raw score a", "raw score b", "num comments a", "num comments b"]
    with open(name, 'w') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(fieldnames)    
        for row in results:
            writer.writerow(row)



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
    for i in range(10):
        print first_normalized[i]
    print ''
    print "getting top words for {}".format(second_file)
    second_normalized = sort_and_normalize(second_words_counts)
    for i in range(10):
        print second_normalized[i]

    results = combine(first_normalized, second_normalized)
    write_to_csv(results)



if __name__ == "__main__":
    main()