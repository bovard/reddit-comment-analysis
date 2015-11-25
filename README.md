# reddit-comment-analysis

Tools for getting data out of reddit comments.


# getting the data

We got the data from [reddit](https://www.reddit.com/r/datasets/comments/3k178q/reddits_august_comment_dump_is_now_available/)

After downloading, you'll want to decompress it with 

```
bzip2 -d filename.bz2
```

You'll end up with a 29GB file of json comment data called RC_2015-08. Each entry looks like:

```
{
    "author": "stytches187",
    "author_flair_css_class": null,
    "author_flair_text": null,
    "body": "Signed and upvoted. Thank you for posting",
    "controversiality": 0,
    "created_utc": "1438387241",
    "distinguished": null,
    "edited": false,
    "gilded": 0,
    "id": "ctnf77v",
    "link_id": "t3_3f1zdc",
    "parent_id": "t3_3f1zdc",
    "retrieved_on": 1440210825,
    "score": -8,
    "subreddit": "cats",
    "subreddit_id": "t5_2qhta",
    "ups": -8
}
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