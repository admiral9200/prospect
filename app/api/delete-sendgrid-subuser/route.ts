import client from "@sendgrid/client";
import supabaseClient from "@/utils/supabase-client";
import { NextRequest, NextResponse } from "next/server";

const sendgridApiKey = process.env.SENDGRID_API_KEY as string;

client.setApiKey(sendgridApiKey);

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    console.log('got payload');
    const { email, workspaceId, userId } = await req.json();
    console.log('email: ', email);
    console.log('workspaceId: ', workspaceId);
    console.log('userId: ', userId);

    const request = {
      url: `/v3/subusers/${email}`,
      method: "DELETE",
    };

    console.log('deleting from sendgrid');
    // @ts-ignore
    const [response, body] = await client.request(request);

    console.log("Sendgrid delete response: ", response);

    if (response.statusCode === 204) {
      console.log('deleting from db');
      await deleteSubuserByEmail(workspaceId, userId, email);
      console.log('deleted from db');
      return NextResponse.json(
        {
          data: null,
          message: "success",
          error: null,
        },
        {
          status: 200,
        }
      );
    } else {
      throw new Error(`Failed to delete from SendGrid. Response code: ${response.statusCode}`);
    }
  } catch (e: any) {
    console.error(e);

    if (e.response && e.response.body && e.response.body.errors) {
      // SendGrid returned errors
      const sendgridErrors = e.response.body.errors;
      return NextResponse.json(
        {
          data: null,
          error: sendgridErrors,
          message: "SendGrid error",
        },
        {
          status: 400, 
        }
      );
    } else {
      // Other errors
      return NextResponse.json(
        {
          data: null,
          error: e.message || e,
          message: "internal server error",
        },
        {
          status: 500,
        }
      );
    }
  }
};

async function deleteSubuserByEmail(workspaceId, userId, emailToDelete) {
  try {
    // Fetch the workspace data with the "domains" column
    const { data: workspaceData, error: workspaceError } = await supabaseClient
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

    // Iterate through the "domains" array and remove the object with the specified email
    const updatedDomains = domains.map((domain) => {
      if (domain.subusers && domain.subusers[userId]) {
        const subusersArray = domain.subusers[userId];
        const updatedSubusersArray = subusersArray.filter(
          (subuser) => subuser.email !== emailToDelete
        );
        domain.subusers[userId] = updatedSubusersArray;
      }
      return domain;
    });

    // Update the workspace data with the modified "domains" array
    const { error: updateError } = await supabaseClient
      .from("workspace")
      .update({ domains: updatedDomains })
      .eq("id", workspaceId);

    if (updateError) {
      throw new Error(
        `Error updating workspace data: ${updateError.message || updateError}`
      );
    }

    return true; // Object with email deleted successfully
  } catch (error: any) {
    throw new Error(
      `Error deleting object with email: ${error.message || error}`
    );
  }
}
