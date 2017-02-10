# React Infinite Paged
The idea here is to combine pagination and infinite scroll.

Say we have 100 records of cat pictures available from an API, and we want to only fetch 10 at a time, as the user scrolls down the page.

We would start by fetching `/api/cats?offset=0&limit=10` at first, and then just increment the offset by 10 each time. Pretty "standard" infinite scroll with lazy fetching.

Now, what if we also want to give the user the ability to directly to:

`/cats/page=4`

This means that we should start by loading `/api/cats?offset=30&limit=10`, then fetch more cats as the user scrolls either up or down. And supposedly, we also want to keep the `page` up to date in the URL as the user scrolls, so that they can share links with their friends (or enemies that really hate cats).
