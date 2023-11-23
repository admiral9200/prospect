import { NextRequest, NextResponse } from "next/server"
import { fetchDescription } from '@/helpers/connection.mjs'
import { scrapProfile } from '@/helpers/scrape_profile.mjs'
import { one_month_past } from '@/helpers/utils.mjs'
import generateMsg from '@/helpers/generateMsg.mjs'
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client
import { handle_msg, handle_connection, search_url } from '@/helpers/campaigns-utils.mjs'
import { update } from '@/helpers/supabase-utils.mjs'

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))


export const UPDATE = async (req: NextRequest, res: NextResponse) => {
    console.log("onboarding update: ", req.json())
}