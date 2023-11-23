import { unicode_parser } from '@/helpers/unicode_parser.mjs'

export const fetchimageUrl = async (user, cookie) => {
  try {
    const res = await fetch(`https://www.linkedin.com/voyager/api/voyagerPremiumDashUpsellSlotContent?decorationId=com.linkedin.voyager.dash.deco.premium.PremiumUpsellSlotContent-37&q=viewee&slotUrn=urn%3Ali%3Afsd_premiumUpsellSlot%3APROFILE_MESSAGE_ACTION&vieweeProfileUrn=urn%3Ali%3Afsd_profile%3A${user.id}`, {
      "headers": {
        "accept": "application/vnd.linkedin.normalized+json+2.1",
        "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
        "cookie": `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
        "x-li-track": "{\"clientVersion\":\"1.13.20\",\"mpVersion\":\"1.13.20\",\"osName\":\"web\",\"timezoneOffset\":5,\"timezone\":\"Asia/Karachi\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":1.25,\"displayWidth\":1920,\"displayHeight\":1080}",
      },
      "body": null,
      "method": "GET"
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json()
    const imageUrlObj = json.included.find((o) => o?.profilePicture?.a11yText.includes(user.firstName))
    const rootUrl = imageUrlObj?.profilePicture?.displayImageReference?.vectorImage?.rootUrl ?? ""
    const urlPath = imageUrlObj?.profilePicture?.displayImageReference?.vectorImage?.artifacts[2]?.fileIdentifyingUrlPathSegment ?? ""
    // console.log(rootUrl + urlPath);
    return { ...user, imageUrl: rootUrl + urlPath }
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching image URL for ${user.firstName}`);
  }
}

export const extractProfileInfo = async (json, username) => {
  function findProfileIdAndData(obj, path = []) {
    for (const key in obj) {
      const currentPath = [...path, key]; // Keep track of the current path
      //   console.log(currentPath);
      if (
        key === "report" &&
        typeof obj[key] === "object" &&
        obj[key].hasOwnProperty("authorProfileId")
      ) {
        const authorProfileId = obj[key].authorProfileId;
        return { authorProfileId, path: currentPath };
      } else if (typeof obj[key] === "object") {
        const result = findProfileIdAndData(obj[key], currentPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
  const track = findProfileIdAndData(json);
  const linkedin_url = json.included[track.path[1]].profileStatefulProfileActions.overflowActions.find(e => e.shareProfileUrl || e.shareProfileUrlViaMessage)

  try {
    const data = {
      id: track?.authorProfileId,
      username: linkedin_url['shareProfileUrlViaMessage' || 'shareProfileUrl'].split('/').reverse()[0],
      firstName: json.included[track?.path[1]]?.firstName,
      lastName: json.included[track?.path[1]]?.lastName,
      headline: unicode_parser(json.included[track?.path[1]]?.headline ?? ""),
      // headline: json.included[track?.path[1]]?.headline,
      countryCode: json.included[track?.path[1]]?.location.countryCode,
      companyName: json.included[track?.path[1] - 1]?.companyName,
      currentCompany: json.included[16]?.name,
      companyUrl: json.included[16]?.url,
      linkedinUrl: linkedin_url['shareProfileUrlViaMessage' || 'shareProfileUrl'],
      // linkedinUrl: `https://www.linkedin.com/in/${username}`,
    };
    // console.log(data);
    return data;
  } catch (error) {
    throw new Error(`Error extracting profile info for ${username}`)
  }
};

export const fetchProfileInfo = async (username, cookie) => {
  try {
    // console.log('fetchProfileInfo username : ', username, 'and cookie', cookie)
    // console.log(`Fetching profile info for ${username}`);
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${username}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.TopCardSupplementary-129`,
      {
        headers: {
          accept: "application/vnd.linkedin.normalized+json+2.1",
          "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
          cookie: `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
          "x-li-track": "{\"clientVersion\":\"1.13.20\",\"mpVersion\":\"1.13.20\",\"osName\":\"web\",\"timezoneOffset\":5,\"timezone\":\"Asia/Karachi\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":1.25,\"displayWidth\":1920,\"displayHeight\":1080}",
        },
        body: null,
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(`Error fetching profile info for ${username}: ${error.message}`);
    console.error(error.stack);
    throw new Error(`Error fetching profile info for ${username}`);
  }
};


export const extractProfileBio = async (user, json) => {
  try {
    // console.log('fetchProfileInfo username : ', user, 'and json', json)
    const bioElement = `urn:li:fsd_profileCard:(${user.id},ABOUT`;
    const experienceElement = `urn:li:fsd_profileCard:(${user.id},EXPERIENCE`;

    const filtredObjBio = json.included.find(
      (elem) => elem?.entityUrn.startsWith(bioElement)
    );
    const filtredObjExp = json.included.find(
      (elem) => elem?.entityUrn.startsWith(experienceElement)
    );

    // console.log(filtredObjBio);
    const bio = unicode_parser(filtredObjBio?.topComponents[1]?.components?.textComponent?.text?.text ?? "");
    // const bio = filtredObjBio?.topComponents[1]?.components?.textComponent?.text?.text ?? "";

    const exp =
      filtredObjExp?.topComponents[1]?.components?.fixedListComponent?.components.map(
        (elm) => ({
          title: elm?.components?.entityComponent?.title?.text ?? "",
          subtitle: elm?.components?.entityComponent?.subtitle?.text ?? "",
          skill:
            unicode_parser(elm?.components?.entityComponent?.subComponents?.components[0]
              ?.components?.fixedListComponent?.components[0]?.components
              ?.textComponent?.text?.text ?? ""),
          url: elm?.components?.entityComponent?.image?.actionTarget ?? "",
        })
      ) ?? [];
    // console.log(exp);
    return { ...user, bio, exp };
  } catch (error) {
    console.log(error);
    throw new Error(`Error extracting profile bio for ${user.username}`);
  }

};

export const fetchProfileBio = async (user, cookie) => {
  try {
    // console.log('fetchProfileBio user id : ', user, 'and cookie', cookie)
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:urn%3Ali%3Afsd_profile%3A${user.id})&&queryId=voyagerIdentityDashProfileCards.3c16e320676acb02602ae17c4556669d`,
      {
        headers: {
          accept: "application/vnd.linkedin.normalized+json+2.1",
          "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
          cookie: `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
        },
        body: null,
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(`Error fetching profile bio for ${user.username}`);
  }
};

export const extractProfileEmail = (user, json) => {
  // console.log(json.included[0].emailAddress.emailAddress);
  return { ...user, email: json?.included[0]?.emailAddress?.emailAddress ?? "" };
};

export const fetchProfileEmail = async (user, cookie) => {
  try {
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(memberIdentity:${user.username})&&queryId=voyagerIdentityDashProfiles.84cab0be7183be5d0b8e79cd7d5ffb7b`,
      {
        headers: {
          accept: "application/vnd.linkedin.normalized+json+2.1",
          "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
          cookie: `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
        },
        body: null,
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(`Error fetching profile email for ${user.username}`);
  }
};

export const extractProfileUrl = (json) => {
  try {
    let url;
    const objWithProfileActions = json.included.find(
      (obj) => obj.profileStatefulProfileActions
    );
    if (objWithProfileActions) {
      url =
        objWithProfileActions?.profileStatefulProfileActions?.overflowActions[1]
          ?.shareProfileUrl ?? "";
    }
    return url;
  } catch (error) {
    // console.error("Error reading profile ID:", error);
    throw new Error("Error reading profile ID");
  }
};
