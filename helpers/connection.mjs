export const sendConnectionReq = async (profile, cookie) => {

  try {
    const body = {
      invitee: {
        inviteeUnion: {
          memberProfile: `urn:li:fsd_profile:${profile.id}`,
        },
      },
      ...(profile.send_msg_with_connection ? { customMessage: profile.resposne } : {}),
    };
    const res = await fetch(
      "https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreateV2&decorationId=com.linkedin.voyager.dash.deco.relationships.InvitationCreationResultWithInvitee-2",
      {
        headers: {
          accept: "application/vnd.linkedin.normalized+json+2.1",
          "csrf-token": cookie.ajax.replace(/"/g, ""), // Stripping the quotes,
          cookie: `li_at=${cookie.li_at}; JSESSIONID=${cookie.ajax};`,
        },
        body: JSON.stringify(body),
        method: "POST",
      }
    );
    const json = await res.json();
    // console.log('connection_json', json);
    // console.log(json);
    console.log(json.data.code);
    // console.log(JSON.stringify(json));
    if (!res.ok && json.data.code != "CANT_RESEND_YET") return { req_sent: false, error: json.data.code };
    return { ...json, req_sent: true };
    // return { ...json, req_sent: true, req_pending: json.data.code == "CANT_RESEND_YET" ? true : false };
  } catch (error) {
    console.log(error);
    throw new Error("Impossible to send connection request :", error);
  }
};

export const fetchDescription = async (targetId, cookie) => {
  try {
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:urn%3Ali%3Afsd_profile%3A${targetId})&&queryId=voyagerIdentityDashProfileCards.54b0e030a9a5f3ffbb452eaab3b2d876`,
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
    if (!res.ok) throw new Error('Could not fetch description')

    const json = await res.json();
    const desc_obj = json.included.find(
      (item) => item?.actor?.supplementaryActorInfo?.text
    );
    // console.log(desc_obj.actor?.supplementaryActorInfo?.text);
    // console.log(desc_obj);
    // console.log(degree.actor?.supplementaryActorInfo?.text.includes('1st'));
    const degree = desc_obj?.actor?.supplementaryActorInfo?.text
    console.log('fetchDescription', degree);
    return (
      {
        // headline: desc_obj?.actor?.description?.text ?? '',
        degree_type: desc_obj?.actor?.supplementaryActorInfo?.text ?? [],
        first_degree_connection:
          degree?.includes("1st") ? degree?.includes("1st") : false,
        // degree?.includes("1st") ? degree?.includes("1st") : degree == undefined ? true : '',
      } ?? {}
    );
  } catch (error) {
    console.log('fetch description error', error);
  }
};
