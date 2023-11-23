import { unicode_parser } from "./unicode_parser.mjs";

export const fetchPosts = async (user, cookie) => {
    try {
        const res = await fetch(`https://www.linkedin.com/voyager/api/identity/profileUpdatesV2?count=10&includeLongTermHistory=true&moduleKey=creator_profile_all_content_view%3Adesktop&numComments=0&profileUrn=urn%3Ali%3Afsd_profile%3A${user.id}&q=memberShareFeed&start=0`, {
            "headers": {
                "accept": "application/vnd.linkedin.normalized+json+2.1",
                "csrf-token": cookie.ajax.replace(/"/g, ''), // Stripping the quotes,
                "cookie": `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
            },
            "body": null,
            "method": "GET"
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const json = await res.json()
        return json
    } catch (error) {
        throw new Error(`Error fetching post for ${user.username}`);
    }
}

export const extractPosts = async (user, json) => {
    try {
        const postIds = json.data['*elements']
        const filtredPost = json.included.filter(elem => postIds.includes(elem?.entityUrn))

        const cleanedPosts = [];
        const cleanedRepostedPosts = [];

        for (const post of filtredPost) {
            const postText = post?.commentary?.text?.text;
            const headerText = post?.header?.text?.text;

            if (headerText) {
                cleanedRepostedPosts.push(unicode_parser(postText ?? ""));
                // cleanedRepostedPosts.push(postText);
            } else {
                cleanedPosts.push(unicode_parser(postText ?? ""));
                // cleanedPosts.push(postText);
            }
        }

        return {
            ...user,
            post: [
                {
                    user_post: cleanedPosts,
                    reposted_post: cleanedRepostedPosts
                }
            ]
        }
    } catch (error) {
        throw new Error(`Error extracting post for ${user.username}`);
    }
}


export const extractPostsForLikeNComment = async (user, json) => {
    try {  
      const postIds = json.data['*elements']
      const filtredPost = json.included.filter(elem => postIds.includes(elem?.entityUrn))
  
      const posts = []
  
      for (const post of filtredPost) {
        // console.log(post.entityUrn);
        const postText = post?.commentary ? post?.commentary?.text?.text : null;
        const headerText = post?.header?.text?.text;
        const threadId = post?.updateMetadata?.shareUrn;
        const activity = post?.updateMetadata?.urn;
        const socialDetail = post['*socialDetail']
        const senderId = socialDetail.includes('ugcPost') ? threadId : activity
  
        if (headerText && postText) {
          posts.push({ post: postText, id: post.entityUrn, threadId, activity, socialDetail, senderId });
          // cleanedRepostedPosts.push(postText);
        } else if (postText) {
          posts.push({ post: postText, id: post.entityUrn, threadId, activity, socialDetail, senderId });
          // cleanedPosts.push(postText);
        }
      }
      // console.log(posts);
      posts.sort((a, b) => {
        const indexA = postIds.indexOf(a.id)
        const indexB = postIds.indexOf(b.id)
        return indexA - indexB
      })
      // console.log(posts);
  
      return posts
    } catch (error) {
      console.log(error);
      throw new Error(`Error extracting post for ${user.username}`);
    }
  }