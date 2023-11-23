
import Image from "next/image";
import { useState, useEffect } from "react"
import axios from "axios";
import { useRouter } from 'next/navigation';

  const unacceptableDomains = [
    "google.com",
    "gmail.com",
    "outlook.com",
    "facebook.com",
    "twitter.com",
    "amazon.com",
    "wikipedia.org",
    "apple.com",
    "microsoft.com",
    "youtube.com",
    "instagram.com",
    "linkedin.com",
    "yahoo.com",
    "reddit.com",
    "netflix.com",
    "ebay.com",
    "pinterest.com",
    "tumblr.com",
    "cnn.com",
    "bbc.com",
    "nasa.gov",
    "whitehouse.gov",
    "example.com",
    "test.com",
    "tempmail.com",
    "throwawaymail.com",
    "10minutemail.com",
    "mailinator.com",
    "guerrillamail.com",
    "dispostable.com",
    "fakeinbox.com",
    "maildrop.cc",
    "getnada.com",
    "inboxalias.com",
    "mailnesia.com",
    "trashmail.com",
    "sharklasers.com",
    "mintemail.com",
    "yopmail.com",
    "mailinator2.com",
    "jetable.org",
    "mytemp.email",
  ];

const AddDomain = () => {
  const [domain, setDomain] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

   const validateCustomDomain = (domain) => {
    const customDomainRegex = /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
    return customDomainRegex.test(domain);
  };

  const addDomain = async () => {

      const isValidCustomDomain = validateCustomDomain(domain);
      const isUnacceptableDomain = unacceptableDomains.includes(
        domain.toLowerCase()
      );
      if(domain && isValidCustomDomain && !isUnacceptableDomain) {
      /*
        For now we add this domain to a workspace.
        We could allow users to add domains to personal space later(users table)
        The workspaceId should come from a db look up or navigation state.
      */

       const workspaceId = "19a686e9-c991-4905-9900-2476a62a8e65"  


       const payload = JSON.stringify({
            domain,
            workspaceId
       })
      //  Get data you need from sendgrid
      setLoading(true)
      const response = await axios.post('/api/register-domain', payload)
       setLoading(false)
      if(response.status === 200) {
        // redirect user to view the new domain dns_data using the id of the dns record.
        const domainId = response.data.data;
        router.push(
          `/verify-domain?domainId=${domainId}&workspaceId=${workspaceId}`
        );
      } else {
        // else  let the user know something went wrong and they must initiate again.
        alert('Domain creation failed')
        
      }
    }
  }

  useEffect(() => {
    const isValidCustomDomain = validateCustomDomain(domain);
    const isUnacceptableDomain = unacceptableDomains.includes(
      domain.toLowerCase()
    );

    if (!domain) {
      setMessage("");
    } else if (isValidCustomDomain && !isUnacceptableDomain) {
      setMessage("Valid custom domain");
    } else {
      setMessage("Not a valid custom domain or in the list of unacceptable domains");
    }
  }, [domain]);

 

  return (
    <div className="px-4 absolute top-40 lg:top-0 left-0 lg:left-72 right-0 bottom-0 m-auto lg:flex lg:justify-center lg:items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-start">
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-bold text-[26px]">
              Send email from any email address
            </h2>
            <p className="text-[14px] text-gray-600 font-normal">
              It requires the addition of a DNS record to confirm your domain
              verification.
            </p>
          </div>

          <div className="py-8 flex flex-col justify-start items-start w-full">
            <div className="flex items-center justify-center pb-2">
              <p className="pr-2 font-bold">Add Domain</p>
              <Image src={"/excla.svg"} width={20} height={20} alt="" />
            </div>
            <input
              className="w-full rounded-md text-sm border-3 border-gray-200 px-2 py-3"
              placeholder="your domain address"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            {message && <small>{message}</small>}
          </div>
        </div>
        <button
          className="text-white w-[180px] h-[50px] bg-[#6039DB] rounded-lg"
          onClick={() => addDomain()}
        >
          {loading ? "loading..." : "Add Domain"}
        </button>
      </div>
    </div>
  );
};

export default AddDomain;