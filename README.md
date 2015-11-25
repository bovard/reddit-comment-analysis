# reddit-comment-analysis

Tools for getting data out of reddit comments.


# getting the data

We got the data from [reddit](https://www.reddit.com/r/datasets/comments/3k178q/reddits_august_comment_dump_is_now_available/)

After downloading, you'll want to decompress it with 

```
bzip2 -d filename.bz2
```

# running the scripts

First thing you will want to do it to pull out all the subreddit data (which ends up in subreddits/). To control what subreddits you are looking at, you can edit the `subreddits` list in [get_subreddit.py](https://github.com/bovard/reddit-comment-analysis/blob/master/get_subreddit.py#L7).

To do this, you'll need to run the get_subreddit.py

```
python get_subreddit.py path/to/giant/29G/RC_2015-08
```

Then you can compile together the data for the visualization by doing:

```
python compile_data.py
```