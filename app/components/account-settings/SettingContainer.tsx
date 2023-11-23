// @ts-nocheck
'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import TextArea from "./TextArea";
import Accordion from "./Accordian";
import ToggleStatus from "./ToggleStatus";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import axios from "axios";
import VoiceCloner from "../voice-cloner/cloner";

const getDomain = (email) => {
  const domainRegex = /@(.+)/;
  const matches = email.match(domainRegex);
  if (matches && matches.length > 1) {
    return matches[1];
  }
};

const SettingContainer = () => {
  const [current, setCurrent] = useState("general_info");   
  const [email, setEmail] = useState("");
  const [isMatched, setIsMatched] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [addEmail, setAddEmail] = useState(false);
  const [noDomain, setNoDomain] = useState(false);
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const [openEvent, setOpenEvent] = useState(false);
  const [clickEvent, setClickEvent] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [userAvatar, setUserAvatar] = useState("");
  const [profile, setProfile] = useState({
    lname: "",
    fname: "",
    value: ""
  })
  const [updating, setUpdating] = useState(false);
  const handleProfile = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };
const handleUpdateProfile = async () => {
 const { lname, fname, value } = profile;
let isSuccess = true;
if (lname && fname) {
  const lowercaseLname = lname.toLowerCase();
  const lowercaseFname = fname.toLowerCase();
  const fullName = `${lowercaseFname} ${lowercaseLname}`;
  setUpdating(true);
  const { _, error: nameError } = await supabase
    .from('users')
    .update({
      full_name: fullName,
    })
    .eq('id', user?.id);
  if (nameError) {
    console.error('Error updating name:', nameError);
    alert('Name update failed. Please try again.');
    isSuccess = false; 
  }
} else {
  alert('Please provide both first and last names.');
  isSuccess = false; 
}
if (value && isSuccess) {
  const { _, error: valueError } = await supabase
    .from('users')
    .update({
      user_value: value,
    })
    .eq('id', user?.id);
  if (valueError) {
    console.error('Error updating value:', valueError);
    alert('Value update failed. Please try again.');
    isSuccess = false; 
  }
}
if (isSuccess) {
  alert('Success');
}
setUpdating(false);
}
  const workspaceId = "19a686e9-c991-4905-9900-2476a62a8e65";
  async function checkWebhookIdByEmail(workspaceId, emailToCheck) {
    try {
      // Fetch the workspace data with the "domains" column
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspace")
        .select("domains")
        .eq("id", workspaceId)
        .single();
      if (workspaceError) {
        throw new Error(
          `Error fetching workspace data: ${
            workspaceError.message || workspaceError
          }`
        );
      }
      // Get the "domains" array from the workspace data
      const domains = workspaceData.domains || [];
      // Iterate through the "domains" array to find the matching subuser
      for (const domain of domains) {
        if (domain.subusers) {
          // Iterate through the subusers using Object.keys to access UUID keys
          for (const uuid of Object.keys(domain.subusers)) {
            const subuserArray = domain.subusers[uuid];
            const matchingSubuser = subuserArray.find(
              (subuser) => subuser.email === emailToCheck
            );
            if (matchingSubuser && matchingSubuser.webhookId) {
              // If a matching subuser with a webhookId is found
              return {
                hasWebhookId: true,
                webhookId: matchingSubuser.webhookId,
                username: matchingSubuser.username,
              };
            }
          }
        }
      }
      // If no matching subuser or no webhookId is found
      return {
        hasWebhookId: false,
        webhookId: null,
      };
    } catch (error) {
      throw new Error(`Error checking webhookId: ${error}`);
    }
  }
  const handleWebhook = async () => {
    const { hasWebhookId, webhookId, username } = await checkWebhookIdByEmail(
      workspaceId,
      email
    );
    if (hasWebhookId) {
      // redirect to update the webhook.
      const payload = JSON.stringify({
        webhookId,
        open: openEvent,
        click: clickEvent,
        username,
        email,
      });
      const response = await axios.post(
        "/api/update-sendgrid-webhook",
        payload
      );
      console.log(response);
    } else {
      console.log("updating");
      const payload = JSON.stringify({
        username,
        emailToUpdate: email,
        workspaceId,
        open: openEvent,
        click: clickEvent,
      });
      // create webhook
      const response = await axios.post("/api/create-webhook", payload);
    }
  };
  const handleSaveEmail = async () => {
    // check is this email matches any domain stored in this users workspace.
    setLoading(true);
    const { data, error } = await supabase
      .from("workspace")
      .select("*")
      .eq("id", workspaceId);
    console.log("data: ", data);
    const domains = data && data[0].domains;
    if (!domains) {
      setLoading(false);
      alert("Please create a domain.");
      setNoDomain(true);
      return;
    }
    if (!error) {
      // check if the given email has any matching domains.
      const allSavedDomains = domains.map((domain) => domain.name);
      const domainOfEmail = getDomain(email);
      const isDomainSaved = allSavedDomains.includes(domainOfEmail);
      if (isDomainSaved) {
        // check if its an authenticated domain.
        const matchingDomain = domains.find(
          (domain) => domain.name === domainOfEmail
        );
        const isAuthenticated = matchingDomain.valid;
        if (!isAuthenticated) {
          alert("Please authenticate the domain before adding an email.");
          setLoading(false);
          return;
        }
        const payload = JSON.stringify({
          domainName: domainOfEmail,
          password: `${email}1$`,
          username: email,
          email,
          workspaceId,
          userId: user?.id,
        });
        const response = await axios.post(
          "/api/register-sendgrid-subuser",
          payload
        );
        if (response.status === 200 && response.data.data === "exist") {
          alert("Email already exist");
        }
        if (response.status === 200 && response.data.data === "created") {
          // register a webhook for that user
          await handleWebhook();
          await fetchAssociatedObjectsByUUID(workspaceId, user?.id);
          setLoading(false);
          setAddEmail(false);
          alert("Created");
        }
        if (response.status === 500) {
          alert("Something went wrong");
        }
        setLoading(false);
        return;
      }
      if (!isDomainSaved) {

        setNoDomain(true);
        setTimeout(() => {
          setNoDomain(true);
        }, 3000)
        setLoading(false);
      }
    }
    if (error) {
      alert("There was an error fetching domains for this ws");
      setLoading(false);
    }
  };
  async function fetchAssociatedObjectsByUUID(workspaceId, targetUUID) {
    try {
      // Fetch the workspace data with the "domains" column
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspace")
        .select("domains")
        .eq("id", workspaceId)
        .single();
      if (workspaceError) {
        throw new Error(
          `Error fetching workspace data: ${
            workspaceError.message || workspaceError
          }`
        );
      }
      // Get the "domains" array from the workspace data
      const domains = workspaceData.domains || [];
      const associatedObjects = [];
      // Iterate through the "domains" array and collect associated objects with the target UUID
      domains.forEach((domain) => {
        if (domain.subusers && domain.subusers[targetUUID]) {
          // @ts-ignore
          associatedObjects.push(...domain.subusers[targetUUID]);
        }
      });
      // @ts-ignore
      setUserData(associatedObjects);
    } catch (error: any) {
      throw new Error(
        `Error fetching associated objects: ${error.message || error}`
      );
    }
  }
  const handleDeleteSubuser = async (e) => {
    e.preventDefault();
    const email = e.target.dataset.email;
    const index = e.target.dataset.index;
    const payload = JSON.stringify({
      email,
      workspaceId,
      userId: user?.id,
    });
    setDeleting(true);
    setDeletingIndex(index);
    try {
      const response = await axios.post(
        "/api/delete-sendgrid-subuser",
        payload
      );
      if (response.status === 200) {
        await fetchAssociatedObjectsByUUID(workspaceId, user?.id);
        alert("Successful");
      }
    } catch (e) {
      alert("Something went wrong");
    }
    setDeleting(false);
  };
  useEffect(() => {
    // fetch all workspace data.
    const getuserData = async () => {
      if (user) {
        await fetchAssociatedObjectsByUUID(workspaceId, user.id);
        setUserAvatar(user.user_metadata.avatar_url);
      }
    };
    getuserData();
  }, [user]);
  return (
    <div className="flex min-h-[600px] w-full">
      {/* left start */}
      <div className="bg-[#6039DB] pt-4 pb-4 w-[350px] min-h-[650px] max-h-[650px] text-white flex flex-col justify-between items-start">
        <div>
          <p className="text-[20px] font-semibold pl-4 pb-4 pt-2">
            Account Settings
          </p>
          <div>
            <ul>
              <li className="py-2 w-full">
                <div
                  className={`${
                    current == "general_info" ? "bg-white text-[#6039DB]" : ""
                  } py-4 rounded-r-lg`}
                >
                  <button
                    className="flex items-center justify-start pl-6 font-normal"
                    onClick={() => setCurrent("general_info")}
                  >
                    <Image
                      src={
                        current == "general_info"
                          ? "/account_settings/general_info_active.svg"
                          : "/account_settings/general_info_inactive.svg"
                      }
                      width={25}
                      height={25}
                      alt=""
                    />
                    <p className="text-[16px] px-2">General info</p>
                  </button>
                </div>
              </li>
              <li className="py-2 pr-8">
                <div
                  className={`${
                    current == "my_domains" ? "bg-white text-[#6039DB]" : ""
                  } py-4 rounded-r-lg`}
                >
                  <button
                    className="flex items-center justify-start pl-6 font-normal"
                    onClick={() => setCurrent("my_domains")}
                  >
                    <Image
                      src={
                        current == "my_domains"
                          ? "/account_settings/domains_active.svg"
                          : "/account_settings/domains_inactive.svg"
                      }
                      width={25}
                      height={25}
                      alt=""
                    />
                    <p className="text-[16px] px-2">My Domains</p>
                  </button>
                </div>
              </li>
              <li className="py-2 pr-8">
                <div
                  className={`${
                    current == "signature" ? "bg-white text-[#6039DB]" : ""
                  } py-4 rounded-r-lg`}
                >
                  <button
                    className="flex items-center justify-start pl-6 font-normal"
                    onClick={() => setCurrent("signature")}
                  >
                    <Image
                      src={
                        current == "signature"
                          ? "/account_settings/signature_inactive.svg"
                          : "/account_settings/signature_inactive.svg"
                      }
                      width={25}
                      height={25}
                      alt=""
                    />
                    <p className="text-[16px] px-2">Email Signature</p>
                  </button>
                </div>
              </li>
              {/* start with voice */}
              <li className="py-2 pr-8">
                <div
                  className={`${
                    current == "voice_cloner" ? "bg-white text-[#6039DB]" : ""
                  } py-4 rounded-r-lg`}
                >
                  <button
                    className="flex items-center justify-start pl-6 font-normal"
                    onClick={() => setCurrent("voice_cloner")}
                  >
                    <Image
                      src={
                        current == "voice_cloner"
                          ? "/account_settings/signature_inactive.svg"
                          : "/account_settings/signature_inactive.svg"
                      }
                      width={25}
                      height={25}
                      alt=""
                    />
                    <p className="text-[16px] px-2">AI Voice Cloner</p>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="pl-4">
          <Image src={"/settings.svg"} width={200} height={40} alt="" />
        </div>
      </div>
      {/* left end */}
      {/* right content start */}
      <div className="w-full ">
        <div className="text-left py-6 border-[1px] border-gray-300">
          <p className="px-4 font-bold">
            {current == "general_info" && "General info"}
            {current == "my_domains" && "My Domains"}
            {current == "signature" && "Email signature"}
            {current == "voice_cloner" && "Voice Assistant"}
          </p>
        </div>
        <div className="p-8 w-full">
          {current == "general_info" && (
            <div className="w-full flex flex-col justify-center items-start">
              <div className="w-full flex justify-between items-center mb-2">
                <div className="flex flex-col justify-start items-start">
                  <p className="text-[13px] font-semibold text-black mb-2">
                    First Name
                  </p>
                  <input name='fname' value={profile.fname} onChange={(e) => handleProfile(e)} className="border-[1.5px] border-gray-200 rounded-lg py-2 pl-2" />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p className="text-[13px] font-semibold text-black mb-2">
                    Last Name
                  </p>
                  <input name='lname' value={profile.lname} onChange={(e) => handleProfile(e)} className="border-[1.5px] border-gray-200 rounded-lg py-2" />
                </div>
              </div>
              <div className="w-full text-left text-[13px] font-semibold">
                <p className="mb-2 mt-4">Value Proposition</p>
                <TextArea profile={profile} handleProfile={handleProfile}/>
              </div>
              <button onClick={handleUpdateProfile} className="text-white bg-[#6039DB] rounded-lg w-[146px] h-[50px] mt-8">
                {updating ?  "Updating..." : "Update"}
              </button>
            </div>
          )}

          {/* Entire email connection UI */}
          {current == "my_domains" && addEmail && (
            <div>
              <Accordion
                imgUrl="/account_settings/mail_icon.svg"
                title="Add an e-mail account"
                isConnected={isConnected}
              >
                <div className="p-4 w-full flex flex-col items-start justify-start">
                  <div className="flex justify-start items-center w-full space-x-20">
                    <div className="flex flex-col justify-start items-start">
                      <div className="flex justify-center items-center mb-2">
                        <p className="mr-2 font-bold">Add Email</p>
                        <Image
                          src={"/account_settings/info_icon.svg"}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </div>
                      <input
                        className="px-2 py-3 border-2 border-gray-200 rounded-lg placeholder:text-[14px]"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <div className="flex justify-center items-center mb-2">
                        <p className="mr-2 font-bold">Tracking Details</p>
                        <Image
                          src={"/account_settings/info_icon.svg"}
                          width={18}
                          height={18}
                          alt=""
                        />
                      </div>
                      <div>
                        <div className="flex justify-center items-center">
                          <ToggleStatus
                            enabled={openEvent}
                            setEnabled={setOpenEvent}
                          />
                          <p className="pl-2 text-[14px]">Open tracking</p>
                        </div>
                        <div className="flex justify-center items-center mt-2">
                          <ToggleStatus
                            enabled={clickEvent}
                            setEnabled={setClickEvent}
                          />
                          <p className="pl-2 text-[14px]">Click tracking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {noDomain && (
                    <div className="my-2 flex flex-col justify-start items-start">
                      <div className="flex justify-start items-center">
                        <Image
                          src={"/account_settings/info_icon_red.svg"}
                          width={18}
                          height={18}
                          alt=""
                        />
                        <p className="text-[#FF0000] text-[14px] pl-2">
                          Email does not match any registered domains.
                        </p>
                      </div>
                      <Link href="/add-domain">
                        <button className="text-[#6039DB] ml-6 text-[14px]">
                          <u>Add domain</u>
                        </button>
                      </Link>
                    </div>
                  )}
                  <div className="my-2">
                    <button
                      onClick={() => handleSaveEmail()}
                      className="text-white bg-[#6039DB] rounded-lg px-4 py-2 text-[14px]"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setAddEmail(false)}
                      className="text-[#6039DB] text-[13px] pl-4"
                    >
                      <u>Cancel</u>
                    </button>
                  </div>
                  <p className="text-left text-gray-400 text-[13px]">
                    Here we have a text explaining what this email will be used
                    for here we have a text explaining what this email will be
                    used for here we have a text explaining what this email will
                    be used for
                  </p>
                </div>
              </Accordion>

              <Accordion
                imgUrl="/linkedinlogo 1.svg"
                title="Connect your Linkedin"
                isConnected={isConnected}
              >
                <div className="p-4 w-full flex flex-col items-start justify-start">
                  {!isMatched && (
                    <>
                      <p className="text-[15px]">Connect your</p>
                      <p className="text-[15px] pb-2">LinkedIn account</p>
                    </>
                  )}
                  {isMatched && (
                    <button className="text-[#6039DB] text-[12.5px] font-semibold">
                      + Connect to Linkedin
                    </button>
                  )}
                  <p className="pl-2 text-left text-gray-400 text-[12px] mt-4">
                    Here we have a text explaining what this email will be used
                    for here we have a text explaining what this email will be
                    used for here we have a text explaining what this email will
                    be used for
                  </p>
                </div>
              </Accordion>
            </div>
          )}

          {current == "my_domains" && !addEmail && (
            <div>
              <Accordion
                imgUrl="/account_settings/mail_icon.svg"
                title="Add an e-mail account"
                isConnected={isConnected}
              >
                <div className="p-4 w-full flex flex-col items-start justify-start">
                  <div className="w-full">
                    {
                      Array.isArray(userData) &&
                        userData.map((user, index) => (
                          <div
                            key={user.id}
                            className="flex justify-between items-center border-b-[1px] border-gray-200 pb-4"
                          >
                            <div className="flex justify-center items-center">
                              <img
                                src={userAvatar}
                                alt=""
                                className="rounded-full w-[30px] h-[30px]"
                              />
                              <p className="pl-2 text-[12px] text-black">
                                {user.email}
                              </p>
                            </div>
                            <button
                              data-email={user.email}
                              data-index={index}
                              onClick={(e) => handleDeleteSubuser(e)}
                              className="text-gray-600 text-[12px]"
                            >
                              {deleting && deletingIndex == index
                                ? "Deleting..."
                                : "Remove"}
                            </button>
                          </div>
                        ))
                    }
                  </div>
                  <button
                    onClick={() => setAddEmail(true)}
                    className="text-[#6039DB] text-[13px] my-2"
                  >
                    + Connect another account
                  </button>
                  <p className="text-left text-gray-400 text-[12px]">
                    Here we have a text explaining what this email will be used
                    for here we have a text explaining what this email will be
                    used for here we have a text explaining what this email will
                    be used for
                  </p>
                </div>
              </Accordion>

              <Accordion
                imgUrl="/linkedinlogo 1.svg"
                title="Connect your Linkedin"
                isConnected={isConnected}
              >
                <div className="p-4 w-full flex flex-col items-start justify-start">
                  <div className="flex w-full justify-between items-center pb-4">
                    <div className="flex justify-center items-center">
                      <Image
                        src={"/avatar-17.png"}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full"
                      />
                      <p className="pl-2 text-[12px] text-black">
                        carlalva@gmail.com
                      </p>
                    </div>
                    <button className="text-gray-600 text-[12px]">
                      Remove
                    </button>
                  </div>
                  <p className="pl-2 text-left text-gray-400 text-[12px] mt-4">
                    Here we have a text explaining what this email will be used
                    for here we have a text explaining what this email will be
                    used for here we have a text explaining what this email will
                    be used for
                  </p>
                </div>
              </Accordion>
            </div>
          )}

          {/* where i put new code */}
          {current === "voice_cloner" && <VoiceCloner />}
        </div>
      </div>
      {/* right content start */}
    </div>
  );
}

export default SettingContainer;