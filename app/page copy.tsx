// pages/upload.tsx
'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Papa from 'papaparse';

interface CSVData {
  postUrl: string;
  action: string;
  sharedPostUrl: string;
  type: string;
  imgUrl: string;
  postContent: string;
  likeCount: number;
  commentCount: number;
  postDate: string;
  profileUrl: string;
  timestamp: string;
  videoUrl: string;
  sharedPostCompanyUrl: string;
}

interface ResponseData {
  [key: string]: string;
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [responses, setResponses] = useState<ResponseData | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
      setFileName(files[0].name);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (file) {
      // Parse the CSV file directly in the browser
      Papa.parse<CSVData>(file, {
        header: true,
        complete: async ({ data }) => {
          const results: { [key: string]: {date: string, content: string}[] } = {};

          data.forEach(({ profileUrl, postContent, postDate }) => {
            const post = {date: postDate, content: postContent};
            if (profileUrl in results) {
              results[profileUrl].push(post);
            } else {
              results[profileUrl] = [post];
            }
          });

          const res = await fetch('/api/generateResponse', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profiles: results }),
          });

          const responseData = await res.json();
          setResponses(responseData.responses);
        },
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-96">
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow w-full">
        <div className="px-4 py-5 sm:px-6">
          AI Personalized Outreach for LinkedIn
        </div>
        <div className="px-4 py-5 sm:p-6 text-center">
          <div className='mb-2'><h1>Upload CSV File</h1></div> 
          <form onSubmit={handleSubmit}>
            <div className="mt-2 mb-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv"/>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">{fileName ? fileName : 'CSV up to 10MB'}</p>
              </div>
            </div>
            <div>
              <button className="bg-purple-700 text-white rounded-md py-2 px-3" type="submit">Upload</button>
            </div>
          </form>
        </div>
        <div className="px-4 py-4 sm:px-6">
          {responses && (
            <div className="overflow-x-auto">
              <div className="align-middle inline-block min-w-full">
                <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(responses).map(([profileUrl, response], index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {profileUrl}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                            {response}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UploadPage;