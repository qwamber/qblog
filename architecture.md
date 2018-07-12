# database architecture

The database structure is as follows:

 - `blogs`
    - *a blog key*
      - `name (string)` (the blog's name)
      - `subdomain (string)` (the subdomain that will be used for the blog)
      - `owner (string)` (the UID of the user that created the blog)
      - `blogCreated (number)` (the Unix time when the blog was created)
      - `posts`
         - *post key*
            - `title (string)` (the post title)
            - `body (string)` (the body of the post)
            - `writer (string)` (the UID of the user that wrote the post)
            - `created (number)` (the Unix time when the post was created)
 - `users`
    - *a user ID*
       - `name (string)` (the user's name)
       - `emailAddress (string)` (the user's email address)
       - `blogs`
          - *a blog key* `(boolean)` (a blog owned by the
            user, where the key is the blog key in `blogs/` and the value is
            always `true`)
